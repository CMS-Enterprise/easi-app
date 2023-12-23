package main

import (
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
	_ "github.com/lib/pq" // required for postgres driver in sql
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cmsgov/easi-app/cmd/devdata/mock"
	"github.com/cmsgov/easi-app/pkg/appconfig"
	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
	"github.com/cmsgov/easi-app/pkg/upload"
)

type seederConfig struct {
	logger   *zap.Logger
	store    *storage.Store
	s3Client *upload.S3Client
}

func main() {
	config := testhelpers.NewConfig()
	logger, loggerErr := zap.NewDevelopment()

	if loggerErr != nil {
		panic(loggerErr)
	}

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

	ctx := mock.CtxWithLoggerAndPrincipal(logger, mock.PrincipalUser)
	seederConfig := &seederConfig{
		logger:   logger,
		store:    store,
		s3Client: &s3Client,
	}

	makeAccessibilityRequest("TACO", store)
	makeAccessibilityRequest("Big Project", store)

	now := time.Now()
	yyyy, mm, dd := now.Date()

	makeAccessibilityRequest("Seeded 508 Request", store, func(i *models.AccessibilityRequest) {
		i.ID = uuid.MustParse("6e224030-09d5-46f7-ad04-4bb851b36eab")
	})

	// Test date is one day after the 508 request is created
	makeTestDate(logger, store, func(i *models.TestDate) {
		i.ID = uuid.MustParse("18624c5b-4c00-49a7-960f-ac6d8b2c58df")
		i.RequestID = uuid.MustParse("6e224030-09d5-46f7-ad04-4bb851b36eab")
		i.TestType = models.TestDateTestTypeInitial
		i.Date = time.Date(yyyy, mm, dd+1, 0, 0, 0, 0, time.UTC)
	})

	makeSystemIntakeV1("A Completed Intake Form", logger, store, func(i *models.SystemIntake) {
		i.ID = uuid.MustParse("af7a3924-3ff7-48ec-8a54-b8b4bc95610b")
	})

	makeSystemIntakeV1("With Contract Month and Year", logger, store, func(i *models.SystemIntake) {
		i.ExistingContract = null.StringFrom("HAVE_CONTRACT")
		i.ContractStartMonth = null.StringFrom("10")
		i.ContractStartYear = null.StringFrom("2021")
		i.ContractEndMonth = null.StringFrom("10")
		i.ContractEndYear = null.StringFrom("2022")
	})

	makeSystemIntakeV1("With Contract Dates", logger, store, func(i *models.SystemIntake) {
		i.ExistingContract = null.StringFrom("HAVE_CONTRACT")
		i.ContractStartDate = date(2021, 4, 5)
		i.ContractEndDate = date(2022, 4, 5)
	})

	makeSystemIntakeV1("With Both Contract Dates", logger, store, func(i *models.SystemIntake) {
		i.ExistingContract = null.StringFrom("HAVE_CONTRACT")
		i.ContractStartMonth = null.StringFrom("10")
		i.ContractStartYear = null.StringFrom("2021")
		i.ContractEndMonth = null.StringFrom("10")
		i.ContractEndYear = null.StringFrom("2022")
		i.ContractStartDate = date(2021, 4, 9)
		i.ContractEndDate = date(2022, 4, 8)
	})

	makeSystemIntakeV1("Ready for business case", logger, store, func(i *models.SystemIntake) {
		i.Status = models.SystemIntakeStatusNEEDBIZCASE
	})

	makeSystemIntakeV1("For business case Cypress test", logger, store, func(i *models.SystemIntake) {
		i.ID = uuid.MustParse("cd79738d-d453-4e26-a27d-9d2a303e0262")
		i.EUAUserID = null.StringFrom("E2E1")
		i.Status = models.SystemIntakeStatusNEEDBIZCASE
		i.RequestType = models.SystemIntakeRequestTypeNEW
		i.Requester = "EndToEnd One" // matches pkg/local/cedar_ldap.go, but doesn't really have to :shrug:
		i.Component = null.StringFrom("Center for Consumer Information and Insurance Oversight")
		i.BusinessOwner = null.StringFrom("John BusinessOwner")
		i.BusinessOwnerComponent = null.StringFrom("Center for Consumer Information and Insurance Oversight")
		i.ProductManager = null.StringFrom("John ProductManager")
		i.ProductManagerComponent = null.StringFrom("Center for Consumer Information and Insurance Oversight")
		i.ISSO = null.StringFrom("")
		i.TRBCollaborator = null.StringFrom("")
		i.OITSecurityCollaborator = null.StringFrom("")
		i.EACollaborator = null.StringFrom("")
		// i.ProjectName = null.StringFrom("Easy Access to System Information")
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

	makeSystemIntakeV1("Closable Request", logger, store, func(i *models.SystemIntake) {
		i.ID = uuid.MustParse("20cbcfbf-6459-4c96-943b-e76b83122dbf")
	})

	makeSystemIntakeV1("Intake with no contract vehicle or number", logger, store, func(i *models.SystemIntake) {
		i.ID = uuid.MustParse("38e46d77-e474-4d15-a7c0-f6411221e2a4")
		i.ContractVehicle = null.StringFromPtr(nil)
		i.ContractNumber = null.StringFromPtr(nil)
	})

	makeSystemIntakeV1("Intake with legacy Contract Vehicle", logger, store, func(i *models.SystemIntake) {
		i.ID = uuid.MustParse("2ed89f9f-7fd9-4e92-89d2-cee170a44d0d")
		i.ContractVehicle = null.StringFrom("Honda")
		i.ContractNumber = null.StringFromPtr(nil)
	})

	intake := makeSystemIntakeV1("Draft Business Case", logger, store, func(i *models.SystemIntake) {
		i.Status = models.SystemIntakeStatusBIZCASEDRAFT
	})
	makeBusinessCaseV1("Draft Business Case", logger, store, intake)

	intake = makeSystemIntakeV1("With GRB scheduled", logger, store, func(i *models.SystemIntake) {
		i.Status = models.SystemIntakeStatusREADYFORGRB
		tomorrow := time.Now().Add(24 * time.Hour)
		nextMonth := time.Now().Add(30 * 24 * time.Hour)
		i.GRBDate = &tomorrow
		i.GRTDate = &nextMonth
	})
	makeBusinessCaseV1("With GRB scheduled", logger, store, intake)

	intake = makeSystemIntakeV1("With GRT scheduled", logger, store, func(i *models.SystemIntake) {
		i.Status = models.SystemIntakeStatusREADYFORGRT
		lastMonth := time.Now().AddDate(0, -1, 0)
		tomorrow := time.Now().AddDate(0, 0, 1)
		i.GRBDate = &lastMonth
		i.GRTDate = &tomorrow
	})
	makeBusinessCaseV1("With GRT scheduled", logger, store, intake)

	intake = makeSystemIntakeV1("With LCID Issued", logger, store, func(i *models.SystemIntake) {
		lifecycleExpiresAt := time.Now().AddDate(0, 0, 90)
		submittedAt := time.Now().AddDate(0, 0, -365)
		i.LifecycleID = null.StringFrom("210001")
		issuedAt := time.Now()
		i.LifecycleIssuedAt = &issuedAt
		i.LifecycleExpiresAt = &lifecycleExpiresAt
		i.Status = models.SystemIntakeStatusLCIDISSUED
		i.SubmittedAt = &submittedAt
	})
	makeBusinessCaseV1("With LCID Issued", logger, store, intake, func(c *models.BusinessCase) {
		c.Status = models.BusinessCaseStatusCLOSED
	})

	makeSystemIntakeV1("Expiring LCID Intake", logger, store, func(i *models.SystemIntake) {
		lifecycleExpiresAt := time.Now().AddDate(0, 0, 30)
		submittedAt := time.Now().AddDate(0, 0, -365)
		i.LifecycleID = null.StringFrom("410001")
		issuedAt := time.Now().AddDate(0, 0, -300)
		i.LifecycleIssuedAt = &issuedAt
		i.LifecycleExpiresAt = &lifecycleExpiresAt
		i.Status = models.SystemIntakeStatusLCIDISSUED
		i.State = models.SystemIntakeStateCLOSED
		i.DecisionState = models.SIDSLcidIssued
		i.SubmittedAt = &submittedAt
	})

	makeSystemIntakeV1("Expiring LCID Intake with alert sent 14 days ago", logger, store, func(i *models.SystemIntake) {
		lifecycleExpiresAt := time.Now().AddDate(0, 0, 30)
		submittedAt := time.Now().AddDate(0, 0, -365)
		i.LifecycleID = null.StringFrom("510001")
		issuedAt := time.Now().AddDate(0, 0, -300)
		i.LifecycleIssuedAt = &issuedAt
		i.LifecycleExpiresAt = &lifecycleExpiresAt
		lastAlertSent := time.Now().AddDate(0, 0, -14)
		i.LifecycleExpirationAlertTS = &lastAlertSent
		i.Status = models.SystemIntakeStatusLCIDISSUED
		i.State = models.SystemIntakeStateCLOSED
		i.DecisionState = models.SIDSLcidIssued
		i.SubmittedAt = &submittedAt
	})

	makeSystemIntakeV1("Intake with expiring LCID and no EUA User ID - test case for EASI-3083", logger, store, func(i *models.SystemIntake) {
		lifecycleExpiresAt := time.Now().AddDate(0, 0, 30)
		submittedAt := time.Now().AddDate(0, 0, -365)
		i.LifecycleID = null.StringFrom("300001")
		issuedAt := time.Now()
		i.LifecycleIssuedAt = &issuedAt
		i.LifecycleExpiresAt = &lifecycleExpiresAt
		i.Status = models.SystemIntakeStatusLCIDISSUED
		i.SubmittedAt = &submittedAt
		i.EUAUserID = null.StringFromPtr(nil)
	})

	var intakeID uuid.UUID
	// for setting GRT/GRB meeting dates when progressing
	futureMeetingDate := time.Now().AddDate(0, 2, 0)
	pastMeetingDate := time.Now().AddDate(0, -2, 0)

	intakeID = uuid.MustParse("d80cf287-35cb-4e76-b8b3-0467eabd75b8")
	makeSystemIntakeAndProgressToStep(
		"skip to grb meeting with date set in past",
		logger,
		store,
		&intakeID,
		model.SystemIntakeStepToProgressToGrbMeeting,
		&progressOptions{
			meetingDate: &pastMeetingDate,
		},
	)

	intakeID = uuid.MustParse("5c82f10a-0413-4a43-9b0f-e9e5c4f2699f")
	makeSystemIntakeAndProgressToStep(
		"skip to grb meeting with date set in future",
		logger,
		store,
		&intakeID,
		model.SystemIntakeStepToProgressToGrbMeeting,
		&progressOptions{
			meetingDate: &futureMeetingDate,
		},
	)

	intakeID = uuid.MustParse("8f0b8dfc-acb2-4cd3-a79e-241c355f551c")
	makeSystemIntakeAndProgressToStep(
		"skip to grb meeting without date set",
		logger,
		store,
		&intakeID,
		model.SystemIntakeStepToProgressToGrbMeeting,
		nil,
	)

	intakeID = uuid.MustParse("1a261eb8-162d-46a6-afaf-b5c9507dedd1")
	makeSystemIntakeAndProgressToStep(
		"grb meeting with date set in past",
		logger,
		store,
		&intakeID,
		model.SystemIntakeStepToProgressToGrbMeeting,
		&progressOptions{
			meetingDate:        &pastMeetingDate,
			completeOtherSteps: true,
		},
	)

	intakeID = uuid.MustParse("8ef9d0fb-e673-441c-9876-f874b179f89c")
	makeSystemIntakeAndProgressToStep(
		"grb meeting with date set in future",
		logger,
		store,
		&intakeID,
		model.SystemIntakeStepToProgressToGrbMeeting,
		&progressOptions{
			meetingDate:        &futureMeetingDate,
			completeOtherSteps: true,
		},
	)

	intakeID = uuid.MustParse("d9c931c6-0858-494d-b991-e02a94a42f38")
	makeSystemIntakeAndProgressToStep(
		"grb meeting without date set",
		logger,
		store,
		&intakeID,
		model.SystemIntakeStepToProgressToGrbMeeting,
		&progressOptions{
			completeOtherSteps: true,
		},
	)

	intakeID = uuid.MustParse("44000b37-55bf-4535-ac2e-6c163a28ca72")
	makeSystemIntakeAndProgressToStep(
		"skip to final biz case and request edits",
		logger,
		store,
		&intakeID,
		model.SystemIntakeStepToProgressToFinalBusinessCase,
		&progressOptions{
			fillForm:     true,
			submitForm:   true,
			requestEdits: true,
		},
	)

	intakeID = uuid.MustParse("18bc6ef2-21c1-451b-bc69-8f489027406d")
	makeSystemIntakeAndProgressToStep(
		"skip to final biz case and submit",
		logger,
		store,
		&intakeID,
		model.SystemIntakeStepToProgressToFinalBusinessCase,
		&progressOptions{
			completeOtherSteps: true,
			submitForm:         true,
		},
	)

	intakeID = uuid.MustParse("10395f89-d81e-4ee2-9716-f029788df7d0")
	makeSystemIntakeAndProgressToStep(
		"skip to final biz case with form filled",
		logger,
		store,
		&intakeID,
		model.SystemIntakeStepToProgressToFinalBusinessCase,
		&progressOptions{
			completeOtherSteps: false,
			fillForm:           true,
		},
	)

	intakeID = uuid.MustParse("2c8ac23d-ea64-4851-9f8a-0cfb8468ef51")
	makeSystemIntakeAndProgressToStep(
		"skip to final biz case",
		logger,
		store,
		&intakeID,
		model.SystemIntakeStepToProgressToFinalBusinessCase,
		&progressOptions{
			completeOtherSteps: false,
		},
	)

	intakeID = uuid.MustParse("67eebec8-9242-4f2c-b337-f674686a5ab5")
	makeSystemIntakeAndProgressToStep(
		"Edits requested on final biz case",
		logger,
		store,
		&intakeID,
		model.SystemIntakeStepToProgressToFinalBusinessCase,
		&progressOptions{
			completeOtherSteps: true,
			submitForm:         true,
			requestEdits:       true,
		},
	)

	intakeID = uuid.MustParse("18f245bc-f84c-401f-973a-62af7950f9c1")
	makeSystemIntakeAndProgressToStep(
		"final biz case submitted",
		logger,
		store,
		&intakeID,
		model.SystemIntakeStepToProgressToFinalBusinessCase,
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
		"final biz case with form filled",
		logger,
		store,
		&intakeID,
		model.SystemIntakeStepToProgressToFinalBusinessCase,
		&progressOptions{
			completeOtherSteps: true,
		},
	)

	intakeID = uuid.MustParse("19ad5fba-617a-43b8-a503-16bc7b53721e")
	makeSystemIntakeAndProgressToStep(
		"skip to grt without date set",
		logger,
		store,
		&intakeID,
		model.SystemIntakeStepToProgressToGrtMeeting,
		&progressOptions{
			completeOtherSteps: false,
		},
	)

	intakeID = uuid.MustParse("40beb03a-9def-43c2-98e1-9c052405781b")
	makeSystemIntakeAndProgressToStep(
		"skip to grt with date set in past",
		logger,
		store,
		&intakeID,
		model.SystemIntakeStepToProgressToGrtMeeting,
		&progressOptions{
			meetingDate:        &pastMeetingDate,
			completeOtherSteps: false,
		},
	)

	intakeID = uuid.MustParse("534e01cb-8116-4fce-9bf9-3089ae8b8927")
	makeSystemIntakeAndProgressToStep(
		"skip to grt with date set in future",
		logger,
		store,
		&intakeID,
		model.SystemIntakeStepToProgressToGrtMeeting,
		&progressOptions{
			meetingDate:        &futureMeetingDate,
			completeOtherSteps: false,
		},
	)

	intakeID = uuid.MustParse("902aa086-b2b0-47ee-8fcf-69c97cd8de12")
	makeSystemIntakeAndProgressToStep(
		"grt meeting with date set in past",
		logger,
		store,
		&intakeID,
		model.SystemIntakeStepToProgressToGrtMeeting,
		&progressOptions{
			meetingDate:        &pastMeetingDate,
			completeOtherSteps: true,
		},
	)

	intakeID = uuid.MustParse("116eb955-b09a-4377-ba92-04816de2c2ac")
	makeSystemIntakeAndProgressToStep(
		"grt meeting with date set in future",
		logger,
		store,
		&intakeID,
		model.SystemIntakeStepToProgressToGrtMeeting,
		&progressOptions{
			meetingDate:        &futureMeetingDate,
			completeOtherSteps: true,
		},
	)

	intakeID = uuid.MustParse("58171a68-6bb3-497d-96ef-dcf07c146083")
	makeSystemIntakeAndProgressToStep(
		"grt meeting without date set",
		logger,
		store,
		&intakeID,
		model.SystemIntakeStepToProgressToGrtMeeting,
		&progressOptions{
			completeOtherSteps: true,
		},
	)

	intakeID = uuid.MustParse("ce874e71-de26-46da-bbfe-a8e3af960108")
	makeSystemIntakeAndProgressToStep(
		"Edits requested on draft biz case",
		logger,
		store,
		&intakeID,
		model.SystemIntakeStepToProgressToDraftBusinessCase,
		&progressOptions{
			fillForm:     true,
			submitForm:   true,
			requestEdits: true,
		},
	)

	intakeID = uuid.MustParse("782e8bf3-39b7-4f6f-a809-d9936a0bcfc9")
	makeSystemIntakeAndProgressToStep(
		"draft biz case submitted",
		logger,
		store,
		&intakeID,
		model.SystemIntakeStepToProgressToDraftBusinessCase,
		&progressOptions{
			fillForm:   true,
			submitForm: true,
		},
	)

	intakeID = uuid.MustParse("fba27c4c-aeb2-4e7b-942b-eafa4ecaf620")
	makeSystemIntakeAndProgressToStep(
		"draft biz case filled out",
		logger,
		store,
		&intakeID,
		model.SystemIntakeStepToProgressToDraftBusinessCase,
		&progressOptions{
			fillForm: true,
		},
	)

	// one cannot skip to a draft biz case, so that is omitted

	intakeID = uuid.MustParse("4d3f9821-e043-42bf-9cd0-faa5f053ed32")
	makeSystemIntakeAndProgressToStep(
		"starting draft biz case",
		logger,
		store,
		&intakeID,
		model.SystemIntakeStepToProgressToDraftBusinessCase,
		nil,
	)

	intakeID = uuid.MustParse("29486f85-1aba-4eaf-a7dd-6137b9873adc")
	makeSystemIntakeAndRequestEditsToForm(
		"Edits requested on initial request form",
		logger,
		store,
		&intakeID,
	)

	// initial intake form
	intakeID = uuid.MustParse("14ecf18c-8367-402d-a48e-92e7d2853f50")
	makeSystemIntakeAndSubmit("initial form filled and submitted", &intakeID, logger, store)

	intakeID = uuid.MustParse("43fe5a4e-525c-40da-b0f6-3b36b5f84cc1")
	createSystemIntake(&intakeID, logger, store, "USR1", "User One", models.SystemIntakeRequestTypeNEW)

	intakeID = uuid.MustParse("d2b96357-3a76-42e3-82ab-978a20f5acad")
	makeSystemIntake("initial form filled but not yet submitted", nil, logger, store)

	must(nil, seederConfig.seedTRBRequests(ctx))
}

func date(year, month, day int) *time.Time {
	date := time.Date(year, time.Month(month), day, 0, 0, 0, 0, time.UTC)
	return &date
}

func must(_ interface{}, err error) {
	if err != nil {
		panic(err)
	}
}
