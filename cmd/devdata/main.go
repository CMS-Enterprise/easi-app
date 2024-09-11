package main

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
	_ "github.com/lib/pq" // required for postgres driver in sql
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"golang.org/x/sync/errgroup"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cms-enterprise/easi-app/cmd/devdata/mock"
	"github.com/cms-enterprise/easi-app/pkg/appconfig"
	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/local"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
	"github.com/cms-enterprise/easi-app/pkg/testhelpers"
	"github.com/cms-enterprise/easi-app/pkg/upload"
	"github.com/cms-enterprise/easi-app/pkg/userhelpers"
	"github.com/cms-enterprise/easi-app/pkg/usersearch"
)

type seederConfig struct {
	logger           *zap.Logger
	store            *storage.Store
	s3Client         *upload.S3Client
	UserSearchClient usersearch.Client
}

const closedRequestCount int = 10

func main() {
	config := testhelpers.NewConfig()

	// https://pkg.go.dev/go.uber.org/zap#example-AtomicLevel
	atom := zap.NewAtomicLevel()

	// To keep the example deterministic, disable timestamps in the output.
	encoderCfg := zap.NewProductionEncoderConfig()
	encoderCfg.TimeKey = ""

	logger := zap.New(zapcore.NewCore(
		zapcore.NewJSONEncoder(encoderCfg),
		zapcore.Lock(os.Stdout),
		atom,
	))
	defer logger.Sync()

	// This prevents the seed script from dumping unnecessary logs
	atom.SetLevel(zap.ErrorLevel)

	dbConfig := storage.DBConfig{
		Host:           config.GetString(appconfig.DBHostConfigKey),
		Port:           config.GetString(appconfig.DBPortConfigKey),
		Database:       config.GetString(appconfig.DBNameConfigKey),
		Username:       config.GetString(appconfig.DBUsernameConfigKey),
		Password:       config.GetString(appconfig.DBPasswordConfigKey),
		SSLMode:        config.GetString(appconfig.DBSSLModeConfigKey),
		MaxConnections: config.GetInt(appconfig.DBMaxConnections),
	}

	ldClient, ldErr := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	if ldErr != nil {
		panic(ldErr)
	}

	store, storeErr := storage.NewStore(dbConfig, ldClient)
	if storeErr != nil {
		panic(storeErr)
	}

	s3Cfg := upload.Config{
		Bucket:  config.GetString(appconfig.AWSS3FileUploadBucket),
		Region:  config.GetString(appconfig.AWSRegion),
		IsLocal: true,
	}

	s3Client := upload.NewS3Client(s3Cfg)

	ctx := context.Background()

	ctx = mock.CtxWithNewDataloaders(ctx, store)
	ctx = mock.CtxWithLoggerAndPrincipal(ctx, logger, store, mock.PrincipalUser)

	localOktaClient := local.NewOktaAPIClient()

	seederConfig := &seederConfig{
		logger:           logger,
		store:            store,
		s3Client:         &s3Client,
		UserSearchClient: localOktaClient,
	}

	var intake *models.SystemIntake
	var intakeID uuid.UUID

	// for setting GRT/GRB meeting dates when progressing
	futureMeetingDate := time.Now().AddDate(0, 2, 0)
	pastMeetingDate := time.Now().AddDate(0, -2, 0)

	// generate closed requests
	g, gCtx := errgroup.WithContext(ctx)
	reviewer1, err := userhelpers.GetOrCreateUserAccount(ctx, store, store, "A11Y", false, userhelpers.GetUserInfoAccountInfoWrapperFunc(mock.FetchUserInfoMock))
	if err != nil {
		fmt.Println(err)
	}
	reviewer2, err := userhelpers.GetOrCreateUserAccount(ctx, store, store, "BTMN", false, userhelpers.GetUserInfoAccountInfoWrapperFunc(mock.FetchUserInfoMock))
	if err != nil {
		fmt.Println(err)
	}
	for i := range closedRequestCount {
		caseNum := i + 1
		g.Go(func() error {
			ID := uuid.New()
			sysIn := makeSystemIntakeAndIssueLCID(
				gCtx,
				fmt.Sprintf("closed request #%d", caseNum),
				&ID,
				mock.PrincipalUser,
				store,
				time.Now().AddDate(2, 0, 0),
			)
			createdByID := appcontext.Principal(ctx).Account().ID
			reviewer := models.NewSystemIntakeGRBReviewer(reviewer1.ID, createdByID)
			reviewer.VotingRole = models.SIGRBRVRAlternate
			reviewer.GRBRole = models.SIGRBRRACA3021Rep
			reviewer.SystemIntakeID = sysIn.ID
			err = store.CreateSystemIntakeGRBReviewer(ctx, store, reviewer)
			if err != nil {
				fmt.Println(err)
				return err
			}
			reviewer.UserID = reviewer2.ID
			reviewer.ID = uuid.New()
			err = store.CreateSystemIntakeGRBReviewer(ctx, store, reviewer)
			if err != nil {
				fmt.Println(err)
				return err
			}
			setSystemIntakeRelationExistingSystem(
				gCtx,
				store,
				ID,
				[]string{"111111", "111112"},
				[]string{"1AB1A00-1234-5678-ABC1-1A001B00CC6G"},
			)
			return nil
		})
	}
	if err := g.Wait(); err != nil {
		panic(err)
	}

	intakeID = uuid.MustParse("3a1d5160-c774-4cd9-9f69-afef824b2e3f")
	intake = makeSystemIntakeAndProgressToStep(
		ctx,
		"Rejected Request/Not Approved",
		&intakeID,
		mock.PrincipalUser,
		store,
		models.SystemIntakeStepToProgressToGrtMeeting,
		&progressOptions{
			completeOtherSteps: true,
			meetingDate:        &pastMeetingDate,
		},
	)
	closeIntakeNotApproved(ctx, store, intake, models.TRBFRNotRecommended)

	intakeID = uuid.MustParse("411de072-3019-4bbc-8105-6271ce95ce5d")
	intake = makeSystemIntakeAndSubmit(
		ctx,
		"Not ITGov Request",
		&intakeID,
		mock.PrincipalUser,
		store,
	)
	closeIntakeNotITGovRequest(ctx, store, intake)

	intakeID = uuid.MustParse("69f2ef12-938a-4568-8dd4-9fb738953cc0")
	intake = makeSystemIntakeAndProgressToStep(
		ctx,
		"Closed Request",
		&intakeID,
		mock.PrincipalUser,
		store,
		models.SystemIntakeStepToProgressToFinalBusinessCase,
		&progressOptions{
			completeOtherSteps: true,
		},
	)
	closeIntake(ctx, store, intake)

	// lcid issued expiration date will be 1 year from now
	lcidExpirationDate := time.Now().AddDate(1, 0, 0)

	intakeID = uuid.MustParse("e3fab202-70d8-44e1-9904-5a89588b8615")
	intake = makeSystemIntakeAndSubmit(ctx, "LCID issued after initial form submitted and reopened", &intakeID, mock.PrincipalUser, store)
	intake = issueLCID(ctx, store, intake, time.Now().AddDate(1, 0, 0), models.TRBFRStronglyRecommended)
	reopenIntake(ctx, store, intake)

	intakeID = uuid.MustParse("8edb237e-ad48-49b2-91cf-8534362bc6cf")
	intake = makeSystemIntakeAndIssueLCID(ctx, "LCID issued, but reopened and edits requested", &intakeID, mock.PrincipalUser, store, lcidExpirationDate)
	intake = reopenIntake(ctx, store, intake)
	requestEditsToIntakeForm(ctx, store, intake, models.SystemIntakeFormStepFinalBusinessCase)

	intakeID = uuid.MustParse("cd795d09-6afb-4fdd-b0a2-c37716297f41")
	intake = makeSystemIntakeAndIssueLCID(ctx, "LCID issued, but reopened and progressed backward", &intakeID, mock.PrincipalUser, store, lcidExpirationDate)
	intake = reopenIntake(ctx, store, intake)
	progressIntake(ctx, store, intake, models.SystemIntakeStepToProgressToDraftBusinessCase, nil)

	intakeID = uuid.MustParse("fec8e351-809c-4af2-bd0d-197b6b433206")
	intake = makeSystemIntakeAndIssueLCID(ctx, "LCID issued, but reopened", &intakeID, mock.PrincipalUser, store, lcidExpirationDate)
	reopenIntake(ctx, store, intake)

	intakeID = uuid.MustParse("0f1db17c-9118-4ce2-9491-fa8dd88e60b5")
	intake = makeSystemIntakeAndIssueLCID(ctx, "LCID issued, retired, and retirement date changed", &intakeID, mock.PrincipalUser, store, lcidExpirationDate)
	intake = retireLCID(ctx, store, intake, intake.LifecycleExpiresAt.AddDate(1, 0, 0))
	changeLCIDRetireDate(ctx, store, intake, intake.LifecycleRetiresAt.AddDate(1, 0, 0))

	intakeID = uuid.MustParse("c6332484-b661-4c18-a5bb-6186445ccb9f")
	intake = makeSystemIntakeAndIssueLCID(ctx, "Retired LCID", &intakeID, mock.PrincipalUser, store, lcidExpirationDate)
	retireLCID(ctx, store, intake, intake.LifecycleExpiresAt.AddDate(1, 0, 0))

	intakeID = uuid.MustParse("346d3539-9aac-42c7-bb29-acfd2482455e")
	intake = makeSystemIntakeAndIssueLCID(ctx, "Expired LCID", &intakeID, mock.PrincipalUser, store, lcidExpirationDate)
	expireLCID(ctx, store, intake)

	intakeID = uuid.MustParse("82d96de6-7746-4081-a07e-15b355a928e3")
	intake = makeSystemIntakeAndIssueLCID(ctx, "Confirmed LCID", &intakeID, mock.PrincipalUser, store, lcidExpirationDate)
	confirmLCID(ctx, store, intake, intake.LifecycleExpiresAt.AddDate(1, 0, 0), models.TRBFRNotRecommended)

	intakeID = uuid.MustParse("4ee45041-b21b-4792-a766-4d861d601bdc")
	intake = makeSystemIntakeAndIssueLCID(ctx, "Updated LCID", &intakeID, mock.PrincipalUser, store, lcidExpirationDate)
	updateLCID(ctx, store, intake, intake.LifecycleExpiresAt.AddDate(1, 0, 0))

	intakeID = uuid.MustParse("409c68e1-9b38-462f-8023-8e00e0b62d67")
	intake = makeSystemIntakeAndSubmit(ctx, "LCID issued after initial form submitted", &intakeID, mock.PrincipalUser, store)
	issueLCID(ctx, store, intake, lcidExpirationDate, models.TRBFRStronglyRecommended)

	intakeID = uuid.MustParse("37bd26a1-b0a8-48ee-a080-471e0e581e41")
	makeSystemIntakeAndIssueLCID(ctx, "Intake with Expiring LCID (121 days)", &intakeID, mock.PrincipalUser, store, time.Now().AddDate(0, 0, 121))

	intakeID = uuid.MustParse("1aca9946-79df-4fc9-9851-a79f23423236")
	makeSystemIntakeAndIssueLCID(ctx, "Intake with Expiring LCID (119 days)", &intakeID, mock.PrincipalUser, store, time.Now().AddDate(0, 0, 119))

	intakeID = uuid.MustParse("969e8ce8-810d-4492-b0b3-422b2f9a91a1")
	makeSystemIntakeAndIssueLCID(ctx, "Intake with Expiring LCID (59 days)", &intakeID, mock.PrincipalUser, store, time.Now().AddDate(0, 0, 59))

	intakeID = uuid.MustParse("1fecf78f-e309-4540-9f44-6e41ea686c56")
	makeSystemIntakeAndIssueLCID(ctx, "Intake with Expiring LCID (45 days)", &intakeID, mock.PrincipalUser, store, time.Now().AddDate(0, 0, 45))

	intakeID = uuid.MustParse("98edbd5a-f97d-47f2-9ea1-9369509da398")
	makeSystemIntakeAndIssueLCID(ctx, "Intake with Expiring LCID (45 days) and no EUA ID", &intakeID, "", store, time.Now().AddDate(0, 0, 45))

	intakeID = uuid.MustParse("9ab475a8-a691-45e9-b55d-648b6e752efa")
	makeSystemIntakeAndIssueLCID(ctx, "LCID issued", &intakeID, mock.PrincipalUser, store, lcidExpirationDate)

	intakeID = uuid.MustParse("5af245bc-fc54-4677-bab1-1b3e798bb43c")
	intake = makeSystemIntakeAndProgressToStep(
		ctx,
		"System Intake with GRB Reviewers",
		&intakeID,
		mock.PrincipalUser,
		store,
		models.SystemIntakeStepToProgressToGrbMeeting,
		&progressOptions{
			meetingDate:        &futureMeetingDate,
			completeOtherSteps: true,
			fillForm:           true,
		},
	)
	createSystemIntakeGRBReviewer(
		ctx,
		store,
		intake,
		mock.PrincipalUser,
		models.SystemIntakeGRBReviewerVotingRoleVoting,
		models.SystemIntakeGRBReviewerRoleCmcsRep,
	)
	createSystemIntakeGRBReviewer(
		ctx,
		store,
		intake,
		"ABCD",
		models.SystemIntakeGRBReviewerVotingRoleAlternate,
		models.SystemIntakeGRBReviewerRoleCciioRep,
	)
	createSystemIntakeGRBReviewer(
		ctx,
		store,
		intake,
		"A11Y",
		models.SystemIntakeGRBReviewerVotingRoleNonVoting,
		models.SystemIntakeGRBReviewerRoleFedAdminBdgChair,
	)

	intakeID = uuid.MustParse("d80cf287-35cb-4e76-b8b3-0467eabd75b8")
	makeSystemIntakeAndProgressToStep(
		ctx,
		"skip to grb meeting with date set in past",
		&intakeID,
		mock.PrincipalUser,
		store,
		models.SystemIntakeStepToProgressToGrbMeeting,
		&progressOptions{
			meetingDate: &pastMeetingDate,
		},
	)

	intakeID = uuid.MustParse("5c82f10a-0413-4a43-9b0f-e9e5c4f2699f")
	makeSystemIntakeAndProgressToStep(
		ctx,
		"skip to grb meeting with date set in future",
		&intakeID,
		mock.PrincipalUser,
		store,
		models.SystemIntakeStepToProgressToGrbMeeting,
		&progressOptions{
			meetingDate: &futureMeetingDate,
		},
	)

	intakeID = uuid.MustParse("8f0b8dfc-acb2-4cd3-a79e-241c355f551c")
	makeSystemIntakeAndProgressToStep(
		ctx,
		"skip to grb meeting without date set",
		&intakeID,
		mock.PrincipalUser,
		store,
		models.SystemIntakeStepToProgressToGrbMeeting,
		nil,
	)

	intakeID = uuid.MustParse("1a261eb8-162d-46a6-afaf-b5c9507dedd1")
	makeSystemIntakeAndProgressToStep(
		ctx,
		"grb meeting with date set in past",
		&intakeID,
		mock.PrincipalUser,
		store,
		models.SystemIntakeStepToProgressToGrbMeeting,
		&progressOptions{
			meetingDate:        &pastMeetingDate,
			completeOtherSteps: true,
		},
	)

	intakeID = uuid.MustParse("8ef9d0fb-e673-441c-9876-f874b179f89c")
	makeSystemIntakeAndProgressToStep(
		ctx,
		"grb meeting with date set in future",
		&intakeID,
		mock.PrincipalUser,
		store,
		models.SystemIntakeStepToProgressToGrbMeeting,
		&progressOptions{
			meetingDate:        &futureMeetingDate,
			completeOtherSteps: true,
		},
	)

	intakeID = uuid.MustParse("d9c931c6-0858-494d-b991-e02a94a42f38")
	makeSystemIntakeAndProgressToStep(
		ctx,
		"grb meeting without date set",
		&intakeID,
		mock.PrincipalUser,
		store,
		models.SystemIntakeStepToProgressToGrbMeeting,
		&progressOptions{
			completeOtherSteps: true,
		},
	)

	intakeID = uuid.MustParse("44000b37-55bf-4535-ac2e-6c163a28ca72")
	makeSystemIntakeAndProgressToStep(
		ctx,
		"skip to final biz case and request edits",
		&intakeID,
		mock.PrincipalUser,
		store,
		models.SystemIntakeStepToProgressToFinalBusinessCase,
		&progressOptions{
			fillForm:     true,
			submitForm:   true,
			requestEdits: true,
		},
	)

	intakeID = uuid.MustParse("18bc6ef2-21c1-451b-bc69-8f489027406d")
	makeSystemIntakeAndProgressToStep(
		ctx,
		"skip to final biz case and submit",
		&intakeID,
		mock.PrincipalUser,
		store,
		models.SystemIntakeStepToProgressToFinalBusinessCase,
		&progressOptions{
			completeOtherSteps: true,
			submitForm:         true,
		},
	)

	intakeID = uuid.MustParse("10395f89-d81e-4ee2-9716-f029788df7d0")
	makeSystemIntakeAndProgressToStep(
		ctx,
		"skip to final biz case with form filled",
		&intakeID,
		mock.PrincipalUser,
		store,
		models.SystemIntakeStepToProgressToFinalBusinessCase,
		&progressOptions{
			completeOtherSteps: false,
			fillForm:           true,
		},
	)

	intakeID = uuid.MustParse("2c8ac23d-ea64-4851-9f8a-0cfb8468ef51")
	makeSystemIntakeAndProgressToStep(
		ctx,
		"skip to final biz case",
		&intakeID,
		mock.PrincipalUser,
		store,
		models.SystemIntakeStepToProgressToFinalBusinessCase,
		&progressOptions{
			completeOtherSteps: false,
		},
	)

	intakeID = uuid.MustParse("67eebec8-9242-4f2c-b337-f674686a5ab5")
	makeSystemIntakeAndProgressToStep(
		ctx,
		"Edits requested on final biz case",
		&intakeID,
		mock.PrincipalUser,
		store,
		models.SystemIntakeStepToProgressToFinalBusinessCase,
		&progressOptions{
			completeOtherSteps: true,
			submitForm:         true,
			requestEdits:       true,
		},
	)

	intakeID = uuid.MustParse("18f245bc-f84c-401f-973a-62af7950f9c1")
	makeSystemIntakeAndProgressToStep(
		ctx,
		"final biz case submitted",
		&intakeID,
		mock.PrincipalUser,
		store,
		models.SystemIntakeStepToProgressToFinalBusinessCase,
		&progressOptions{
			completeOtherSteps: true,
			submitForm:         true,
		},
	)

	// getting to the final business case through the normal process means
	// the business case was already filled as a draft, so there's no
	// seed data needed for an unfilled Final business case

	intakeID = uuid.MustParse("561a5cfc-83a6-4600-9531-3a465dddec19")
	makeSystemIntakeAndProgressToStep(
		ctx,
		"final biz case with form filled",
		&intakeID,
		mock.PrincipalUser,
		store,
		models.SystemIntakeStepToProgressToFinalBusinessCase,
		&progressOptions{
			completeOtherSteps: true,
		},
	)

	intakeID = uuid.MustParse("19ad5fba-617a-43b8-a503-16bc7b53721e")
	makeSystemIntakeAndProgressToStep(
		ctx,
		"skip to grt without date set",
		&intakeID,
		mock.PrincipalUser,
		store,
		models.SystemIntakeStepToProgressToGrtMeeting,
		&progressOptions{
			completeOtherSteps: false,
		},
	)

	intakeID = uuid.MustParse("40beb03a-9def-43c2-98e1-9c052405781b")
	makeSystemIntakeAndProgressToStep(
		ctx,
		"skip to grt with date set in past",
		&intakeID,
		mock.PrincipalUser,
		store,
		models.SystemIntakeStepToProgressToGrtMeeting,
		&progressOptions{
			meetingDate:        &pastMeetingDate,
			completeOtherSteps: false,
		},
	)

	intakeID = uuid.MustParse("534e01cb-8116-4fce-9bf9-3089ae8b8927")
	makeSystemIntakeAndProgressToStep(
		ctx,
		"skip to grt with date set in future",
		&intakeID,
		mock.PrincipalUser,
		store,
		models.SystemIntakeStepToProgressToGrtMeeting,
		&progressOptions{
			meetingDate:        &futureMeetingDate,
			completeOtherSteps: false,
		},
	)

	intakeID = uuid.MustParse("902aa086-b2b0-47ee-8fcf-69c97cd8de12")
	makeSystemIntakeAndProgressToStep(
		ctx,
		"grt meeting with date set in past",
		&intakeID,
		mock.PrincipalUser,
		store,
		models.SystemIntakeStepToProgressToGrtMeeting,
		&progressOptions{
			meetingDate:        &pastMeetingDate,
			completeOtherSteps: true,
		},
	)

	intakeID = uuid.MustParse("116eb955-b09a-4377-ba92-04816de2c2ac")
	makeSystemIntakeAndProgressToStep(
		ctx,
		"grt meeting with date set in future",
		&intakeID,
		mock.PrincipalUser,
		store,
		models.SystemIntakeStepToProgressToGrtMeeting,
		&progressOptions{
			meetingDate:        &futureMeetingDate,
			completeOtherSteps: true,
		},
	)

	intakeID = uuid.MustParse("58171a68-6bb3-497d-96ef-dcf07c146083")
	makeSystemIntakeAndProgressToStep(
		ctx,
		"grt meeting without date set",
		&intakeID,
		mock.PrincipalUser,
		store,
		models.SystemIntakeStepToProgressToGrtMeeting,
		&progressOptions{
			completeOtherSteps: true,
		},
	)

	intakeID = uuid.MustParse("ce874e71-de26-46da-bbfe-a8e3af960108")
	makeSystemIntakeAndProgressToStep(
		ctx,
		"Edits requested on draft biz case",
		&intakeID,
		mock.PrincipalUser,
		store,
		models.SystemIntakeStepToProgressToDraftBusinessCase,
		&progressOptions{
			fillForm:     true,
			submitForm:   true,
			requestEdits: true,
		},
	)

	intakeID = uuid.MustParse("782e8bf3-39b7-4f6f-a809-d9936a0bcfc9")
	makeSystemIntakeAndProgressToStep(
		ctx,
		"draft biz case submitted",
		&intakeID,
		mock.PrincipalUser,
		store,
		models.SystemIntakeStepToProgressToDraftBusinessCase,
		&progressOptions{
			fillForm:   true,
			submitForm: true,
		},
	)

	intakeID = uuid.MustParse("fba27c4c-aeb2-4e7b-942b-eafa4ecaf620")
	makeSystemIntakeAndProgressToStep(
		ctx,
		"draft biz case filled out",
		&intakeID,
		mock.PrincipalUser,
		store,
		models.SystemIntakeStepToProgressToDraftBusinessCase,
		&progressOptions{
			fillForm: true,
		},
	)

	// one cannot skip to a draft biz case, so that is omitted

	intakeID = uuid.MustParse("4d3f9821-e043-42bf-9cd0-faa5f053ed32")
	makeSystemIntakeAndProgressToStep(
		ctx,
		"starting draft biz case",
		&intakeID,
		mock.PrincipalUser,
		store,
		models.SystemIntakeStepToProgressToDraftBusinessCase,
		nil,
	)

	intakeID = uuid.MustParse("29486f85-1aba-4eaf-a7dd-6137b9873adc")
	makeSystemIntakeAndSubmit(
		ctx,
		"Edits requested on initial request form",
		&intakeID,
		mock.PrincipalUser,
		store,
	)
	requestEditsToIntakeForm(ctx, store, intake, models.SystemIntakeFormStepInitialRequestForm)

	// Intakes with Relation data
	// 1. Intake with no related systems/services
	intakeID = uuid.MustParse("6a825f1d-e935-4d9b-b09f-f3761385d349")
	makeSystemIntakeAndSubmit(ctx, "System Intake Relation (New System/Contract)", &intakeID, mock.PrincipalUser, store)
	setSystemIntakeRelationNewSystem(
		ctx,
		store,
		intakeID,
		[]string{"12345", "67890"},
	)

	// 2. Intakes related to CEDAR System(s)
	intakeID = uuid.MustParse("29d73aa0-3a29-478e-afb4-374a7594be47")
	makeSystemIntakeAndSubmit(ctx, "System Intake Relation (Existing System 0A)", &intakeID, mock.PrincipalUser, store)
	setSystemIntakeRelationExistingSystem(
		ctx,
		store,
		intakeID,
		[]string{"00001", "00002"},
		[]string{
			"{11AB1A00-1234-5678-ABC1-1A001B00CC0A}",
			"{11AB1A00-1234-5678-ABC1-1A001B00CC1B}",
		},
	)

	intakeID = uuid.MustParse("28f36737-b5cf-464a-a5a2-f1c89acea4cf")
	makeSystemIntakeAndSubmit(ctx, "Related Intake 1 (system 0A)", &intakeID, mock.PrincipalUser, store)
	setSystemIntakeRelationExistingSystem(
		ctx,
		store,
		intakeID,
		[]string{"00003", "00004"},
		[]string{
			"{11AB1A00-1234-5678-ABC1-1A001B00CC0A}",
			"{11AB1A00-1234-5678-ABC1-1A001B00CC3D}",
		},
	)

	intakeID = uuid.MustParse("dd31c8bd-b677-434c-aa35-56138f0b443b")
	makeSystemIntakeAndSubmit(ctx, "Related Intake 2 (system 1B)", &intakeID, mock.PrincipalUser, store)
	setSystemIntakeRelationExistingSystem(
		ctx,
		store,
		intakeID,
		[]string{"00003", "00004"},
		[]string{
			"{11AB1A00-1234-5678-ABC1-1A001B00CC1B}",
			"{11AB1A00-1234-5678-ABC1-1A001B00CC4E}",
		},
	)

	intakeID = uuid.MustParse("020fba51-9b95-4e87-8cd4-808ae6e3dac8")
	makeSystemIntakeAndSubmit(ctx, "Related Intake 3 (contract 01)", &intakeID, mock.PrincipalUser, store)
	setSystemIntakeRelationExistingSystem(
		ctx,
		store,
		intakeID,
		[]string{"00005", "00001"},
		[]string{
			"{11AB1A00-1234-5678-ABC1-1A001B00CC5F}",
			"{11AB1A00-1234-5678-ABC1-1A001B00CC6G}",
		},
	)
	// 3. Intakes related to an existing contract/service
	intakeID = uuid.MustParse("b8e3fbf3-73af-4bac-bac3-fd6167a36166")
	makeSystemIntakeAndSubmit(ctx, "System Intake Relation (Existing Contract/Service 01)", &intakeID, mock.PrincipalUser, store)
	setSystemIntakeRelationExistingService(
		ctx,
		store,
		intakeID,
		"My Cool Existing Contract/Service",
		[]string{"00001"},
	)

	// 4. Unlinked from system/contract intake
	intakeID = uuid.MustParse("964cc832-827b-4744-b503-eb1f04af1e10")
	makeSystemIntakeAndSubmit(ctx, "System Intake Relation (Unlinked)", &intakeID, mock.PrincipalUser, store)
	setSystemIntakeRelationExistingSystem(
		ctx,
		store,
		intakeID,
		[]string{"12345", "67890"},
		[]string{
			"{11AB1A00-1234-5678-ABC1-1A001B00CC0A}",
			"{11AB1A00-1234-5678-ABC1-1A001B00CC1B}",
		},
	)
	unlinkSystemIntakeRelation(ctx, store, intakeID)

	// 5. Link deactivated Systems
	intakeID = uuid.MustParse("04cb8a97-3515-4071-9b80-2710834cd94c")
	makeSystemIntakeAndSubmit(ctx, "System Intake Relation (Deactivated System)", &intakeID, mock.PrincipalUser, store)
	setSystemIntakeRelationExistingSystem(
		ctx,
		store,
		intakeID,
		[]string{"12345", "67890"},
		[]string{
			"{11AB1A00-1234-5678-ABC1-1A001B00CC5F}",
			"{11AB1A00-1234-5678-ABC1-1A001B00CC6G}",
		},
	)

	// initial intake form
	intakeID = uuid.MustParse("14ecf18c-8367-402d-a48e-92e7d2853f50")
	makeSystemIntakeAndSubmit(ctx, "initial form filled and submitted", &intakeID, mock.PrincipalUser, store)

	intakeID = uuid.MustParse("43fe5a4e-525c-40da-b0f6-3b36b5f84cc1")
	createSystemIntake(ctx, &intakeID, store, "USR1", "User One", models.SystemIntakeRequestTypeNEW)

	intakeID = uuid.MustParse("d2b96357-3a76-42e3-82ab-978a20f5acad")
	makeSystemIntake(ctx, "initial form filled but not yet submitted", &intakeID, mock.PrincipalUser, store)

	must(nil, seederConfig.seedTRBRequests(ctx))

	// For Governance Review Cypress Tests
	intakeID = uuid.MustParse("af7a3924-3ff7-48ec-8a54-b8b4bc95610b")
	intake = makeSystemIntakeAndSubmit(ctx, "A Completed Intake Form", &intakeID, mock.PrincipalUser, store)
	createSystemIntakeNote(ctx, store, intake, "This is my note")

	intakeID = uuid.MustParse("cd79738d-d453-4e26-a27d-9d2a303e0262")
	intake = makeSystemIntakeAndProgressToStep(
		ctx,
		"For business case Cypress test",
		&intakeID,
		mock.EndToEndUserOne,
		store,
		models.SystemIntakeStepToProgressToDraftBusinessCase,
		&progressOptions{
			fillForm: false,
		},
	)
	modifySystemIntake(ctx, store, intake, func(i *models.SystemIntake) {
		i.RequestType = models.SystemIntakeRequestTypeNEW
		i.Requester = "EndToEnd One" // matches pkg/local/okta_api.go, but doesn't really have to :shrug:
		i.Component = null.StringFrom("Center for Consumer Information and Insurance Oversight")
		i.BusinessOwner = null.StringFrom("John BusinessOwner")
		i.BusinessOwnerComponent = null.StringFrom("Center for Consumer Information and Insurance Oversight")
		i.ProductManager = null.StringFrom("John ProductManager")
		i.ProductManagerComponent = null.StringFrom("Center for Consumer Information and Insurance Oversight")
		i.ISSO = null.StringFrom("")
		i.TRBCollaborator = null.StringFrom("")
		i.OITSecurityCollaborator = null.StringFrom("")
		i.EACollaborator = null.StringFrom("")
		i.ProjectName = null.StringFrom("Easy Access to System Information")
		i.ExistingFunding = null.BoolFrom(false)
		i.FundingNumber = null.StringFrom("")
		i.BusinessNeed = null.StringFrom("Business Need: The quick brown fox jumps over the lazy dog.")
		i.Solution = null.StringFrom("The quick brown fox jumps over the lazy dog.")
		i.ProcessStatus = null.StringFrom("Initial development underway")
		i.EASupportRequest = null.BoolFrom(false)
		i.HasUIChanges = null.BoolFrom(false)
		i.ExistingContract = null.StringFrom("No")
		i.GrtReviewEmailBody = null.StringFrom("")
	})

	intakeID = uuid.MustParse("20cbcfbf-6459-4c96-943b-e76b83122dbf")
	makeSystemIntakeAndSubmit(ctx, "Closable Request", &intakeID, mock.PrincipalUser, store)

	intakeID = uuid.MustParse("38e46d77-e474-4d15-a7c0-f6411221e2a4")
	intake = makeSystemIntakeAndSubmit(ctx, "Intake with no contract vehicle", &intakeID, mock.PrincipalUser, store)
	modifySystemIntake(ctx, store, intake, func(i *models.SystemIntake) {
		i.ContractVehicle = null.StringFromPtr(nil)
	})

	intakeID = uuid.MustParse("2ed89f9f-7fd9-4e92-89d2-cee170a44d0d")
	intake = makeSystemIntakeAndSubmit(ctx, "Intake with legacy Contract Vehicle", &intakeID, mock.PrincipalUser, store)
	modifySystemIntake(ctx, store, intake, func(i *models.SystemIntake) {
		i.ContractVehicle = null.StringFrom("Honda")
	})

	intakeID = uuid.MustParse("69357721-1e0c-4a37-a90f-64bb29814e7a")
	makeSystemIntakeAndProgressToStep(
		ctx,
		"Draft Business Case",
		&intakeID,
		mock.PrincipalUser,
		store,
		models.SystemIntakeStepToProgressToDraftBusinessCase,
		&progressOptions{
			fillForm: true,
		},
	)

	intakeID = uuid.MustParse("a5689bec-e4cf-4f2b-a7de-72020e8d65be")
	makeSystemIntakeAndProgressToStep(
		ctx,
		"With GRB scheduled",
		&intakeID,
		mock.PrincipalUser,
		store,
		models.SystemIntakeStepToProgressToGrbMeeting,
		&progressOptions{
			meetingDate:        &futureMeetingDate,
			completeOtherSteps: true,
		},
	)

	intakeID = uuid.MustParse("a2fa0d4b-909f-45d8-ad8c-90f22cf0db19")
	makeSystemIntakeAndProgressToStep(
		ctx,
		"With GRT scheduled",
		&intakeID,
		mock.PrincipalUser,
		store,
		models.SystemIntakeStepToProgressToGrtMeeting,
		&progressOptions{
			meetingDate:        &futureMeetingDate,
			completeOtherSteps: true,
		},
	)
	// Don't add new requests here as the Cypress tests are reliant on their intakes showing up on the first page of results
}

func must(_ interface{}, err error) {
	if err != nil {
		panic(err)
	}
}
