package main

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
	_ "github.com/lib/pq" // required for postgres driver in sql
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cmsgov/easi-app/cmd/devdata/mock"
	"github.com/cmsgov/easi-app/pkg/appconfig"
	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/graph/resolvers"
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

	intakeID := uuid.MustParse("4d3f9821-e043-42bf-9cd0-faa5f053ed32")
	makeSystemIntakeAndProgressToStep(
		"submitted and progressed to draft biz case",
		logger,
		store,
		&intakeID,
		model.SystemIntakeStepToProgressToDraftBusinessCase,
	)

	intakeID = uuid.MustParse("18f245bc-f84c-401f-973a-62af7950f9c1")
	makeSystemIntakeAndProgressToStep(
		"submitted and progressed to final biz case",
		logger,
		store,
		&intakeID,
		model.SystemIntakeStepToProgressToFinalBusinessCase,
	)
	intakeID = uuid.MustParse("116eb955-b09a-4377-ba92-04816de2c2ac")
	makeSystemIntakeAndProgressToStep(
		"submitted and progressed to grt meeting",
		logger,
		store,
		&intakeID,
		model.SystemIntakeStepToProgressToGrtMeeting,
	)
	intakeID = uuid.MustParse("8ef9d0fb-e673-441c-9876-f874b179f89c")
	makeSystemIntakeAndProgressToStep(
		"submitted and progressed to grb meeting",
		logger,
		store,
		&intakeID,
		model.SystemIntakeStepToProgressToGrbMeeting,
	)

	intakeID = uuid.MustParse("29486f85-1aba-4eaf-a7dd-6137b9873adc")
	makeSystemIntakeAndRequestEditsToForm(
		"Edits requested on initial request form",
		logger,
		store,
		&intakeID,
		model.SystemIntakeFormStepInitialRequestForm,
	)

	intakeID = uuid.MustParse("ce874e71-de26-46da-bbfe-a8e3af960108")
	makeSystemIntakeAndRequestEditsToForm(
		"Edits requested on draft biz case",
		logger,
		store,
		&intakeID,
		model.SystemIntakeFormStepDraftBusinessCase,
	)

	intakeID = uuid.MustParse("67eebec8-9242-4f2c-b337-f674686a5ab5")
	makeSystemIntakeAndRequestEditsToForm(
		"Edits requested on final biz case",
		logger,
		store,
		&intakeID,
		model.SystemIntakeFormStepFinalBusinessCase,
	)

	intakeID = uuid.MustParse("14ecf18c-8367-402d-a48e-92e7d2853f50")
	makeSystemIntakeAndSubmit("my awesome intake request", &intakeID, logger, store)
	makeSystemIntake("my OTHER awesome intake request", nil, logger, store)

	must(nil, seederConfig.seedTRBRequests(ctx))
}

// creates, fills out the initial request form, and submits a system intake
func makeSystemIntakeAndSubmit(
	requestName string,
	intakeID *uuid.UUID,
	logger *zap.Logger,
	store *storage.Store,
) *models.SystemIntake {
	intake := makeSystemIntake(requestName, intakeID, logger, store)
	return submitSystemIntake(logger, store, intake)
}

// creates an intake and fills out the initial request form
func makeSystemIntake(
	requestName string,
	intakeID *uuid.UUID,
	logger *zap.Logger,
	store *storage.Store,
) *models.SystemIntake {
	intake := createSystemIntake(
		intakeID,
		logger,
		store,
		"USR1",
		"Requester Person",
		models.SystemIntakeRequestTypeNEW,
	)
	intake = updateSystemIntakeRequestDetails(logger, store, intake,
		requestName,
		"An intense business need",
		"with a great business solution",
		true,
		"Some CEDAR System ID",
		"the current stage",
		true,
	)
	updateSystemIntakeContact(logger, store, intake,
		"USR1",
		"Center for Medicare",
		"Requester",
	)
	createSystemIntakeContact(logger, store, intake,
		"A11Y",
		"Center for Medicare",
		"Business Owner",
	)
	createSystemIntakeContact(logger, store, intake,
		"OQYV",
		"Center for Medicare",
		"Product Manager",
	)
	createSystemIntakeContact(logger, store, intake,
		"GP87",
		"Center for Medicare",
		"ISSO",
	)
	intake = updateSystemIntakeContactDetails(logger, store, intake,
		"User One",
		"Office of the Actuary",
		"Ally Anderson",
		"Office of Minority Health",
		"Hallie O'Hara",
		"Emergency Preparedness and Response Operations",
		true,
		"Leatha Gorczany",
	)
	intake = updateSystemIntakeContractDetails(logger, store, intake)
	return intake
}

// This is a v2 function that uses the resolver to create the intake
func createSystemIntake(
	intakeID *uuid.UUID,
	logger *zap.Logger,
	store *storage.Store,
	requesterEUAID string,
	requesterName string,
	requestType models.SystemIntakeRequestType,
) *models.SystemIntake {
	ctx := mock.CtxWithLoggerAndPrincipal(logger, requesterEUAID)
	// if there's no given intakeID, we can default to the resolver
	if intakeID == nil {
		input := model.CreateSystemIntakeInput{
			RequestType: requestType,
			Requester: &model.SystemIntakeRequesterInput{
				Name: requesterName,
			},
		}
		intake, err := resolvers.CreateSystemIntake(ctx, store, input)
		if err != nil {
			panic(err)
		}
		return intake
	}
	// however, if given an intakeID we must use the store method
	i := models.SystemIntake{
		ID:          *intakeID,
		EUAUserID:   null.StringFrom(requesterEUAID),
		RequestType: requestType,
		Requester:   requesterName,
		Status:      models.SystemIntakeStatusINTAKEDRAFT,
		State:       models.SystemIntakeStateOPEN,
		Step:        models.SystemIntakeStepINITIALFORM,
	}
	intake, err := store.CreateSystemIntake(ctx, &i)
	if err != nil {
		panic(err)
	}
	return intake
}

// This is a v2 function that uses the resolver to fill in an intake's request details
func updateSystemIntakeRequestDetails(
	logger *zap.Logger,
	store *storage.Store,
	intake *models.SystemIntake,
	requestName string,
	businessNeed string,
	businessSolution string,
	needsEaSupport bool,
	currentStage string,
	cedarSystemID string,
	hasUIChanges bool,
) *models.SystemIntake {
	ctx := mock.CtxWithLoggerAndPrincipal(logger, intake.EUAUserID.ValueOrZero())
	input := model.UpdateSystemIntakeRequestDetailsInput{
		ID:               intake.ID,
		RequestName:      &requestName,
		BusinessNeed:     &businessNeed,
		BusinessSolution: &businessSolution,
		NeedsEaSupport:   &needsEaSupport,
		CurrentStage:     &currentStage,
		CedarSystemID:    &cedarSystemID,
		HasUIChanges:     &hasUIChanges,
	}
	fetchCedarSystemMock := func(context.Context, string) (*models.CedarSystem, error) {
		return &models.CedarSystem{}, nil
	}
	payload, err := resolvers.SystemIntakeUpdate(ctx, store, fetchCedarSystemMock, input)
	if err != nil {
		panic(err)
	}
	return payload.SystemIntake
}

func createSystemIntakeContact(
	logger *zap.Logger,
	store *storage.Store,
	intake *models.SystemIntake,
	euaUserID string,
	component string,
	role string,
) {
	ctx := mock.CtxWithLoggerAndPrincipal(logger, intake.EUAUserID.ValueOrZero())
	input := model.CreateSystemIntakeContactInput{
		Component:      component,
		Role:           role,
		EuaUserID:      euaUserID,
		SystemIntakeID: intake.ID,
	}
	_, err := resolvers.CreateSystemIntakeContact(ctx, store, input)
	if err != nil {
		panic(err)
	}
}

func updateSystemIntakeContact(
	logger *zap.Logger,
	store *storage.Store,
	intake *models.SystemIntake,
	euaUserID string,
	component string,
	role string,
) {
	ctx := mock.CtxWithLoggerAndPrincipal(logger, intake.EUAUserID.ValueOrZero())
	input := model.UpdateSystemIntakeContactInput{
		Component: component,
		Role:      role,
		EuaUserID: euaUserID,
	}
	_, err := resolvers.UpdateSystemIntakeContact(ctx, store, input)
	if err != nil {
		panic(err)
	}
}

func updateSystemIntakeContactDetails(
	logger *zap.Logger,
	store *storage.Store,
	intake *models.SystemIntake,
	requesterName string,
	requesterComponent string,
	businessOwnerName string,
	businessOwnerComponent string,
	productManagerName string,
	productManagerComponent string,
	issoIsPresent bool,
	issoName string,
) *models.SystemIntake {
	ctx := mock.CtxWithLoggerAndPrincipal(logger, intake.EUAUserID.ValueOrZero())
	govTeamsPresent := true

	input := model.UpdateSystemIntakeContactDetailsInput{
		ID: intake.ID,
		Requester: &model.SystemIntakeRequesterWithComponentInput{
			Name:      requesterName,
			Component: requesterComponent,
		},
		BusinessOwner: &model.SystemIntakeBusinessOwnerInput{
			Name:      businessOwnerName,
			Component: businessOwnerComponent,
		},
		ProductManager: &model.SystemIntakeProductManagerInput{
			Name:      productManagerName,
			Component: productManagerComponent,
		},
		Isso: &model.SystemIntakeISSOInput{
			IsPresent: &issoIsPresent,
			Name:      &issoName,
		},
		GovernanceTeams: &model.SystemIntakeGovernanceTeamInput{
			IsPresent: &govTeamsPresent,
			Teams: []*model.SystemIntakeCollaboratorInput{
				{
					Collaborator: "Mrs TRB member",
					Key:          "technicalReviewBoard",
				},
				{
					Collaborator: "Ms security team member",
					Key:          "securityPrivacy",
				},
				{
					Collaborator: "Mr Enterprise Architecture",
					Key:          "enterpriseArchitecture",
				},
			},
		},
	}
	payload, err := resolvers.SystemIntakeUpdateContactDetails(ctx, store, input)
	if err != nil {
		panic(err)
	}
	return payload.SystemIntake
}

func updateSystemIntakeContractDetails(
	logger *zap.Logger,
	store *storage.Store,
	intake *models.SystemIntake,
) *models.SystemIntake {
	ctx := mock.CtxWithLoggerAndPrincipal(logger, intake.EUAUserID.ValueOrZero())
	existingFunding := true
	fundingNumber1 := "123456"
	fundingNumber2 := "789012"
	source1 := "ACA 3021"
	source2 := "Fed Admin"
	source3 := "MIP Base"
	currentAnnualSpending := "It's kind of a lot"
	plannedYearOneSpending := "A little bit more"
	contractor := "Dr Doom"
	startDate := time.Now().AddDate(-1, 0, 0)
	hasContract := "HAVE_CONTRACT"
	endDate := time.Now().AddDate(3, 0, 0)
	contractNumber := "123456789"
	input := model.UpdateSystemIntakeContractDetailsInput{
		ID: intake.ID,
		FundingSources: &model.SystemIntakeFundingSourcesInput{
			ExistingFunding: &existingFunding,
			FundingSources: []*model.SystemIntakeFundingSourceInput{
				{
					FundingNumber: &fundingNumber1,
					Source:        &source1,
				},
				{
					FundingNumber: &fundingNumber2,
					Source:        &source2,
				},
				{
					FundingNumber: &fundingNumber2,
					Source:        &source3,
				},
			},
		},
		Costs: &model.SystemIntakeCostsInput{}, //doesn't appear in current form
		AnnualSpending: &model.SystemIntakeAnnualSpendingInput{
			CurrentAnnualSpending:  &currentAnnualSpending,
			PlannedYearOneSpending: &plannedYearOneSpending,
		},
		Contract: &model.SystemIntakeContractInput{
			Contractor:  &contractor,
			StartDate:   &startDate,
			HasContract: &hasContract,
			EndDate:     &endDate,
			Number:      &contractNumber,
		},
	}
	payload, err := resolvers.SystemIntakeUpdateContractDetails(ctx, store, input)
	if err != nil {
		panic(err)
	}
	return payload.SystemIntake
}

func submitSystemIntake(
	logger *zap.Logger,
	store *storage.Store,
	intake *models.SystemIntake,
) *models.SystemIntake {
	ctx := mock.CtxWithLoggerAndPrincipal(logger, intake.EUAUserID.ValueOrZero())
	// until the submit function is refactored out of services, manually submit
	// NOTE: does not send emails
	mockSubmitIntake := func(ctx context.Context, intake *models.SystemIntake, action *models.Action) error {
		updatedTime := time.Now()
		intake.SubmittedAt = &updatedTime
		intake.UpdatedAt = &updatedTime

		// TODO: Remove when Admin Actions v2 is live
		intake.Status = models.SystemIntakeStatusINTAKESUBMITTED
		intake.RequestFormState = models.SIRFSSubmitted
		_, err := store.UpdateSystemIntake(ctx, intake)
		if err != nil {
			panic(err)
		}
		_, err = store.CreateAction(ctx, action)
		if err != nil {
			panic(err)
		}
		return nil
	}
	input := model.SubmitIntakeInput{
		ID: intake.ID,
	}
	payload, err := resolvers.SubmitIntake(ctx, store, mock.FetchUserInfoMock, mockSubmitIntake, input)
	if err != nil {
		panic(err)
	}
	return payload.SystemIntake
}

// This is a legacy V1 helper that doesn't use resolvers
func makeSystemIntakeV1(name string, logger *zap.Logger, store *storage.Store, callbacks ...func(*models.SystemIntake)) *models.SystemIntake {
	ctx := appcontext.WithLogger(context.Background(), logger)

	fundingSources := []*models.SystemIntakeFundingSource{
		{
			FundingNumber: null.StringFrom("123456"),
			Source:        null.StringFrom("Research"),
		},
		{
			FundingNumber: null.StringFrom("789012"),
			Source:        null.StringFrom("DARPA"),
		},
	}

	intake := models.SystemIntake{
		EUAUserID: null.StringFrom(mock.PrincipalUser),
		Status:    models.SystemIntakeStatusINTAKESUBMITTED,

		RequestType:                 models.SystemIntakeRequestTypeNEW,
		Requester:                   "User ABCD",
		Component:                   null.StringFrom("Center for Medicaid and CHIP Services"),
		BusinessOwner:               null.StringFrom("User ABCD"),
		BusinessOwnerComponent:      null.StringFrom("Center for Medicaid and CHIP Services"),
		ProductManager:              null.StringFrom("Project Manager"),
		ProductManagerComponent:     null.StringFrom("Center for Program Integrity"),
		ISSOName:                    null.StringFrom("ISSO Name"),
		TRBCollaboratorName:         null.StringFrom("TRB Collaborator Name"),
		OITSecurityCollaboratorName: null.StringFrom("OIT Collaborator Name"),
		EACollaboratorName:          null.StringFrom("EA Collaborator Name"),

		ProjectName:     null.StringFrom(name),
		ExistingFunding: null.BoolFrom(true),
		FundingSources:  fundingSources,

		BusinessNeed: null.StringFrom("A business need. TACO is a new tool for customers to access consolidated Active health information and facilitate the new Medicare process. The purpose is to provide a more integrated and unified customer service experience."),
		Solution:     null.StringFrom("A solution. TACO is a new tool for customers to access consolidated Active health information and facilitate the new Medicare process. The purpose is to provide a more integrated and unified customer service experience."),

		ProcessStatus:      null.StringFrom("I have done some initial research"),
		EASupportRequest:   null.BoolFrom(true),
		HasUIChanges:       null.BoolFrom(true),
		ExistingContract:   null.StringFrom("HAVE_CONTRACT"),
		CostIncrease:       null.StringFrom("YES"),
		CostIncreaseAmount: null.StringFrom("10 million dollars?"),

		ContractStartDate: date(2021, 1, 1),
		ContractEndDate:   date(2023, 12, 31),
		ContractNumber:    null.StringFrom("123456-7890"),
		Contractor:        null.StringFrom("Contractor Name"),
	}

	submittedAt := time.Now()
	intake.SubmittedAt = &submittedAt

	for _, cb := range callbacks {
		cb(&intake)
	}

	must(store.CreateSystemIntake(ctx, &intake))
	must(store.UpdateSystemIntake(ctx, &intake)) // required to set lifecycle id

	tenMinutesAgo := time.Now().Add(-10 * time.Minute)
	fiveMinutesAgo := time.Now().Add(-5 * time.Minute)

	must(store.CreateAction(ctx, &models.Action{
		IntakeID:       &intake.ID,
		ActionType:     models.ActionTypeSUBMITINTAKE,
		ActorName:      "Actor Name",
		ActorEmail:     "actor@example.com",
		ActorEUAUserID: "ACT1",
		CreatedAt:      &tenMinutesAgo,
	}))
	must(store.CreateAction(ctx, &models.Action{
		IntakeID:       &intake.ID,
		ActionType:     models.ActionTypePROVIDEFEEDBACKNEEDBIZCASE,
		ActorName:      "Actor Name",
		ActorEmail:     "actor@example.com",
		ActorEUAUserID: "ACT2",
		Feedback:       models.HTMLPointer("This business case needs feedback"),
	}))

	must(store.CreateSystemIntakeNote(ctx, &models.SystemIntakeNote{
		SystemIntakeID: intake.ID,
		AuthorEUAID:    "QQQQ",
		AuthorName:     null.StringFrom("Author Name"),
		Content:        models.HTMLPointer("a clever remark"),
		CreatedAt:      &fiveMinutesAgo,
	}))

	must(store.UpdateSystemIntakeFundingSources(ctx, intake.ID, fundingSources))

	return &intake
}

func progressIntake(
	logger *zap.Logger,
	store *storage.Store,
	intake *models.SystemIntake,
	newStep model.SystemIntakeStepToProgressTo,
) *models.SystemIntake {
	ctx := mock.CtxWithLoggerAndPrincipal(logger, mock.PrincipalUser)

	feedbackText := models.HTML(fmt.Sprintf("feedback for %s progressing to %s", string(intake.Step), string(newStep)))
	grbRecommendations := models.HTML(fmt.Sprintf("grb recommendations for %s progressing to %s", string(intake.Step), string(newStep)))
	additionalInfo := models.HTML(fmt.Sprintf("additional info for %s progressing to %s", string(intake.Step), string(newStep)))
	adminNote := models.HTML(fmt.Sprintf("admin note about %s progressing to %s", string(intake.Step), string(newStep)))

	input := model.SystemIntakeProgressToNewStepsInput{
		SystemIntakeID:     intake.ID,
		NewStep:            newStep,
		Feedback:           &feedbackText,
		GrbRecommendations: &grbRecommendations,
		AdditionalInfo:     &additionalInfo,
		AdminNote:          &adminNote,
	}

	// this will move the intake to the new step and save it to the database, save the feedback, and save a record of the action
	progressedIntake, err := resolvers.ProgressIntake(ctx, store, nil, mock.FetchUserInfoMock, input)
	if err != nil {
		panic(err)
	}
	return progressedIntake
}

func makeSystemIntakeAndProgressToStep(
	name string,
	logger *zap.Logger,
	store *storage.Store,
	intakeID *uuid.UUID,
	newStep model.SystemIntakeStepToProgressTo,
) *models.SystemIntake {
	intake := makeSystemIntakeAndSubmit(name, intakeID, logger, store)
	return progressIntake(logger, store, intake, newStep)
}

func makeSystemIntakeAndRequestEditsToForm(
	name string,
	logger *zap.Logger,
	store *storage.Store,
	intakeID *uuid.UUID,
	targetedForm model.SystemIntakeFormStep,
) *models.SystemIntake {
	intake := makeSystemIntakeAndSubmit(name, intakeID, logger, store)
	if targetedForm == model.SystemIntakeFormStepDraftBusinessCase {
		makeBusinessCaseV1("draft biz case", logger, store, intake)
	}
	if targetedForm == model.SystemIntakeFormStepFinalBusinessCase {
		makeBusinessCaseV1("final biz case", logger, store, intake, func(b *models.BusinessCase) {
			b.CurrentSolutionSummary = null.StringFrom("It's gonna cost a lot")
			b.CMSBenefit = null.StringFrom("Better Medicare")
			b.PriorityAlignment = null.StringFrom("It's all gonna make sense later")
			b.SuccessIndicators = null.StringFrom("First, we see progress, then success.")
			b.PreferredTitle = null.StringFrom("Preferred Solution")
			b.PreferredSummary = null.StringFrom("This is a summary")
			b.PreferredAcquisitionApproach = null.StringFrom("First we acquire, then we approach")
			b.PreferredSecurityIsApproved = null.BoolFrom(true)
			b.PreferredHostingType = null.StringFrom("cloud")
			b.PreferredHostingLocation = null.StringFrom("aws")
			b.PreferredHostingCloudServiceType = null.StringFrom("paas")
			b.PreferredHasUI = null.StringFrom("YES")
			b.PreferredPros = null.StringFrom("YES")
			b.PreferredCons = null.StringFrom("NO")
			var newCostLines []models.EstimatedLifecycleCost
			for i, v := range []string{"1", "2", "3", "4", "5"} {
				phase1 := models.LifecycleCostPhaseDEVELOPMENT
				phase2 := models.LifecycleCostPhaseOPERATIONMAINTENANCE
				cost := (i + 1) * 100
				estimatedLifeCycleCost := models.EstimatedLifecycleCost{
					Solution: models.LifecycleCostSolutionPREFERRED,
					Year:     models.LifecycleCostYear(v),
					Phase:    &phase1,
					Cost:     &cost,
				}
				newCostLines = append(newCostLines, estimatedLifeCycleCost)
				estimatedLifeCycleCost.Phase = &phase2
				newCostLines = append(newCostLines, estimatedLifeCycleCost)
			}
			b.LifecycleCostLines = newCostLines
			b.PreferredCostSavings = null.StringFrom("Employees not needed")
		})
	}
	intake = submitBusinessCaseV1(logger, store, intake)
	return requestEditsToIntakeForm(logger, store, intake, targetedForm)
}

func requestEditsToIntakeForm(
	logger *zap.Logger,
	store *storage.Store,
	intake *models.SystemIntake,
	targetedForm model.SystemIntakeFormStep,
) *models.SystemIntake {
	ctx := mock.CtxWithLoggerAndPrincipal(logger, mock.PrincipalUser)
	adminNote := models.HTML(fmt.Sprintf("admin note that edits were requested to %s form", string(targetedForm)))
	additionalInfo := models.HTML(fmt.Sprintf("add'l info about edits requested on %s form", string(targetedForm)))

	input := &model.SystemIntakeRequestEditsInput{
		SystemIntakeID: intake.ID,
		IntakeFormStep: targetedForm,
		NotificationRecipients: &models.EmailNotificationRecipients{
			RegularRecipientEmails:   []models.EmailAddress{},
			ShouldNotifyITGovernance: false,
			ShouldNotifyITInvestment: false,
		},
		EmailFeedback:  models.HTML(fmt.Sprintf("feedback on %s form", string(targetedForm))),
		AdditionalInfo: &additionalInfo,
		AdminNote:      &adminNote,
	}
	intake, err := resolvers.CreateSystemIntakeActionRequestEdits(ctx, store, nil, mock.FetchUserInfoMock, *input)
	if err != nil {
		panic(err)
	}
	return intake
}

func makeBusinessCaseV1(name string, logger *zap.Logger, store *storage.Store, intake *models.SystemIntake, callbacks ...func(*models.BusinessCase)) {
	ctx := appcontext.WithLogger(context.Background(), logger)
	if intake == nil {
		intake = makeSystemIntake(name, nil, logger, store)
	}

	phase := models.LifecycleCostPhaseDEVELOPMENT
	cost := 123456
	noCost := 0
	businessCase := models.BusinessCase{
		SystemIntakeID:       intake.ID,
		EUAUserID:            intake.EUAUserID.ValueOrZero(),
		Requester:            null.StringFrom("Shane Clark"),
		RequesterPhoneNumber: null.StringFrom("3124567890"),
		Status:               models.BusinessCaseStatusOPEN,
		ProjectName:          null.StringFrom(name),
		BusinessOwner:        null.StringFrom("Shane Clark"),
		BusinessNeed:         null.StringFrom("business need"),
		LifecycleCostLines: []models.EstimatedLifecycleCost{
			{
				Solution: models.LifecycleCostSolutionPREFERRED,
				Year:     models.LifecycleCostYear1,
				Phase:    &phase,
				Cost:     &cost,
			},
			{
				Solution: models.LifecycleCostSolutionA,
				Year:     models.LifecycleCostYear2,
			},
			{
				Solution: models.LifecycleCostSolutionA,
				Year:     models.LifecycleCostYear3,
				Cost:     &noCost,
			},
		},
		CurrentSolutionSummary: null.StringFrom(""),
		CMSBenefit:             null.StringFrom(""),
		PriorityAlignment:      null.StringFrom(""),
		SuccessIndicators:      null.StringFrom(""),

		AlternativeATitle:       null.StringFrom(""),
		AlternativeASummary:     null.StringFrom(""),
		AlternativeAPros:        null.StringFrom(""),
		AlternativeACons:        null.StringFrom(""),
		AlternativeACostSavings: null.StringFrom(""),

		AlternativeBTitle:       null.StringFrom(""),
		AlternativeBSummary:     null.StringFrom(""),
		AlternativeBPros:        null.StringFrom(""),
		AlternativeBCons:        null.StringFrom(""),
		AlternativeBCostSavings: null.StringFrom(""),
	}
	for _, cb := range callbacks {
		cb(&businessCase)
	}

	must(store.CreateBusinessCase(ctx, &businessCase))
}

func submitBusinessCaseV1(
	logger *zap.Logger,
	store *storage.Store,
	intake *models.SystemIntake,
) *models.SystemIntake {
	ctx := mock.CtxWithLoggerAndPrincipal(logger, intake.EUAUserID.ValueOrZero())
	if intake.Step == models.SystemIntakeStepDRAFTBIZCASE {
		intake.DraftBusinessCaseState = models.SIRFSSubmitted
	}
	if intake.Step == models.SystemIntakeStepFINALBIZCASE {
		intake.FinalBusinessCaseState = models.SIRFSSubmitted
	}
	intake, err := store.UpdateSystemIntake(ctx, intake)
	if err != nil {
		panic(err)
	}
	return intake
}

var lcid = 0

func makeAccessibilityRequest(name string, store *storage.Store, callbacks ...func(*models.AccessibilityRequest)) *models.AccessibilityRequest {
	ctx := context.Background()

	lifecycleID := fmt.Sprintf("%06d", lcid)
	lcid = lcid + 1

	intake := models.SystemIntake{
		Status:                 models.SystemIntakeStatusLCIDISSUED,
		RequestType:            models.SystemIntakeRequestTypeNEW,
		ProjectName:            null.StringFrom(name),
		BusinessOwner:          null.StringFrom("Shane Clark"),
		BusinessOwnerComponent: null.StringFrom("OIT"),
		LifecycleID:            null.StringFrom(lifecycleID),
	}
	must(store.CreateSystemIntake(ctx, &intake))
	must(store.UpdateSystemIntake(ctx, &intake)) // required to set lifecycle id

	accessibilityRequest := models.AccessibilityRequest{
		Name:      fmt.Sprintf("%s v2", name),
		IntakeID:  &intake.ID,
		EUAUserID: mock.PrincipalUser,
	}
	for _, cb := range callbacks {
		cb(&accessibilityRequest)
	}
	must(store.CreateAccessibilityRequestAndInitialStatusRecord(ctx, &accessibilityRequest))
	return &accessibilityRequest
}

func makeTestDate(logger *zap.Logger, store *storage.Store, callbacks ...func(*models.TestDate)) {
	ctx := appcontext.WithLogger(context.Background(), logger)

	testDate := models.TestDate{}
	for _, cb := range callbacks {
		cb(&testDate)
	}

	must(store.CreateTestDate(ctx, &testDate))
}

func must(_ interface{}, err error) {
	if err != nil {
		panic(err)
	}
}

func date(year, month, day int) *time.Time {
	date := time.Date(year, time.Month(month), day, 0, 0, 0, 0, time.UTC)
	return &date
}
