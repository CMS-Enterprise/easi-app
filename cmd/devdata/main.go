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

	"github.com/cmsgov/easi-app/pkg/appconfig"
	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/authentication"
	"github.com/cmsgov/easi-app/pkg/graph/resolvers"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func fetchUserInfoMock(ctx context.Context, eua string) (*models.UserInfo, error) {
	return &models.UserInfo{
		EuaUserID:  eua,
		CommonName: "Test Man",
		Email:      "testman@example.com",
	}, nil
}

func ctxWithLoggerAndPrincipal(logger *zap.Logger, euaID string) context.Context {
	princ := &authentication.EUAPrincipal{
		EUAID:            euaID,
		JobCodeEASi:      true,
		JobCodeGRT:       true,
		JobCode508User:   true,
		JobCode508Tester: true,
	}
	ctx := appcontext.WithLogger(context.Background(), logger)
	ctx = appcontext.WithPrincipal(ctx, princ)
	return ctx
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

	store, storeErr := storage.NewStore(logger, dbConfig, ldClient)
	if storeErr != nil {
		panic(storeErr)
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

	makeSystemIntake("A Completed Intake Form", logger, store, func(i *models.SystemIntake) {
		i.ID = uuid.MustParse("af7a3924-3ff7-48ec-8a54-b8b4bc95610b")
	})

	makeSystemIntake("With Contract Month and Year", logger, store, func(i *models.SystemIntake) {
		i.ExistingContract = null.StringFrom("HAVE_CONTRACT")
		i.ContractStartMonth = null.StringFrom("10")
		i.ContractStartYear = null.StringFrom("2021")
		i.ContractEndMonth = null.StringFrom("10")
		i.ContractEndYear = null.StringFrom("2022")
	})

	makeSystemIntake("With Contract Dates", logger, store, func(i *models.SystemIntake) {
		i.ExistingContract = null.StringFrom("HAVE_CONTRACT")
		i.ContractStartDate = date(2021, 4, 5)
		i.ContractEndDate = date(2022, 4, 5)
	})

	makeSystemIntake("With Both Contract Dates", logger, store, func(i *models.SystemIntake) {
		i.ExistingContract = null.StringFrom("HAVE_CONTRACT")
		i.ContractStartMonth = null.StringFrom("10")
		i.ContractStartYear = null.StringFrom("2021")
		i.ContractEndMonth = null.StringFrom("10")
		i.ContractEndYear = null.StringFrom("2022")
		i.ContractStartDate = date(2021, 4, 9)
		i.ContractEndDate = date(2022, 4, 8)
	})

	makeSystemIntake("Ready for business case", logger, store, func(i *models.SystemIntake) {
		i.Status = models.SystemIntakeStatusNEEDBIZCASE
	})

	makeSystemIntake("For business case integration test", logger, store, func(i *models.SystemIntake) {
		i.ID = uuid.MustParse("cd79738d-d453-4e26-a27d-9d2a303e0262")
		i.EUAUserID = null.StringFrom("TEST")
		i.Status = models.SystemIntakeStatusNEEDBIZCASE
		i.RequestType = models.SystemIntakeRequestTypeNEW
		i.Requester = "John Requester"
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
		i.ExistingContract = null.StringFrom("No")
		i.GrtReviewEmailBody = null.StringFrom("")
	})

	makeSystemIntake("Closable Request", logger, store, func(i *models.SystemIntake) {
		i.ID = uuid.MustParse("20cbcfbf-6459-4c96-943b-e76b83122dbf")
	})

	makeSystemIntake("Intake with no contract vehicle or number", logger, store, func(i *models.SystemIntake) {
		i.ID = uuid.MustParse("38e46d77-e474-4d15-a7c0-f6411221e2a4")
		i.ContractVehicle = null.StringFromPtr(nil)
		i.ContractNumber = null.StringFromPtr(nil)
	})

	makeSystemIntake("Intake with legacy Contract Vehicle", logger, store, func(i *models.SystemIntake) {
		i.ID = uuid.MustParse("2ed89f9f-7fd9-4e92-89d2-cee170a44d0d")
		i.ContractVehicle = null.StringFrom("Honda")
		i.ContractNumber = null.StringFromPtr(nil)
	})

	intake := makeSystemIntake("Draft Business Case", logger, store, func(i *models.SystemIntake) {
		i.Status = models.SystemIntakeStatusBIZCASEDRAFT
	})
	makeBusinessCase("Draft Business Case", logger, store, intake)

	intake = makeSystemIntake("With GRB scheduled", logger, store, func(i *models.SystemIntake) {
		i.Status = models.SystemIntakeStatusREADYFORGRB
		tomorrow := time.Now().Add(24 * time.Hour)
		nextMonth := time.Now().Add(30 * 24 * time.Hour)
		i.GRBDate = &tomorrow
		i.GRTDate = &nextMonth
	})
	makeBusinessCase("With GRB scheduled", logger, store, intake)

	intake = makeSystemIntake("With GRT scheduled", logger, store, func(i *models.SystemIntake) {
		i.Status = models.SystemIntakeStatusREADYFORGRT
		lastMonth := time.Now().Add(-30 * 24 * time.Hour)
		tomorrow := time.Now().Add(24 * time.Hour)
		i.GRBDate = &lastMonth
		i.GRTDate = &tomorrow
	})
	makeBusinessCase("With GRT scheduled", logger, store, intake)

	intake = makeSystemIntake("With LCID Issued", logger, store, func(i *models.SystemIntake) {
		lifecycleExpiresAt := time.Now().Add(30 * 24 * time.Hour)
		submittedAt := time.Now().Add(-365 * 24 * time.Hour)
		i.LifecycleID = null.StringFrom("210001")
		i.LifecycleExpiresAt = &lifecycleExpiresAt
		i.Status = models.SystemIntakeStatusLCIDISSUED
		i.SubmittedAt = &submittedAt
	})
	makeBusinessCase("With LCID Issued", logger, store, intake, func(c *models.BusinessCase) {
		c.Status = models.BusinessCaseStatusCLOSED
	})

	// Fresh request, no actions taken
	makeTRBRequest(models.TRBTNeedHelp, logger, store, func(t *models.TRBRequest) {
		t.Name = "0 - Brand new request"
	})

	// In progress form, not submitted
	inProgress := makeTRBRequest(models.TRBTNeedHelp, logger, store, func(t *models.TRBRequest) {
		t.Name = "1 - In progress form"
	})
	updateTRBRequestForm(logger, store, map[string]interface{}{
		"trbRequestId":             inProgress.ID.String(),
		"component":                "Center for Medicare",
		"needsAssistanceWith":      "Something is wrong with my system",
		"hasSolutionInMind":        true,
		"proposedSolution":         "Get a tech support guru to fix it",
		"whereInProcess":           models.TRBWhereInProcessOptionOther,
		"whereInProcessOther":      "Just starting",
		"hasExpectedStartEndDates": true,
		"expectedStartDate":        "2023-02-27T05:00:00.000Z",
		"expectedEndDate":          "2023-01-31T05:00:00.000Z",
		"collabGroups": []models.TRBCollabGroupOption{
			models.TRBCollabGroupOptionEnterpriseArchitecture,
			models.TRBCollabGroupOptionOther,
		},
		"collabDateEnterpriseArchitecture": "The other day",
		"collabGroupOther":                 "CMS Splunk Team",
		"collabDateOther":                  "Last week",
	})

	// makeTRBRequest(models.TRBTFormalReview, logger, store, func(t *models.TRBRequest) {
	// 	t.ID = uuid.MustParse("9841c768-bdcd-4856-bae2-62cfdaffacf6")
	// 	t.Name = "TACO Review"
	// 	t.CreatedBy = "TACO"
	// })
	// makeTRBRequest(models.TRBTFormalReview, logger, store, func(t *models.TRBRequest) {
	// 	t.ID = uuid.MustParse("21f175b9-bcbe-41c1-9c07-9844869bc1ce")
	// 	t.Name = "Archived Request"
	// 	t.Archived = true
	// })
}

func makeSystemIntake(name string, logger *zap.Logger, store *storage.Store, callbacks ...func(*models.SystemIntake)) *models.SystemIntake {
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
		EUAUserID: null.StringFrom("ABCD"),
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
		ExistingContract:   null.StringFrom("HAVE_CONTRACT"),
		CostIncrease:       null.StringFrom("YES"),
		CostIncreaseAmount: null.StringFrom("10 million dollars?"),

		ContractStartDate: date(2021, 1, 1),
		ContractEndDate:   date(2023, 12, 31),
		ContractNumber:    null.StringFrom("123456-7890"),
		Contractor:        null.StringFrom("Contractor Name"),
	}

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
		Feedback:       null.StringFrom("This business case needs feedback"),
	}))

	must(store.CreateNote(ctx, &models.Note{
		SystemIntakeID: intake.ID,
		AuthorEUAID:    "QQQQ",
		AuthorName:     null.StringFrom("Author Name"),
		Content:        null.StringFrom("a clever remark"),
		CreatedAt:      &fiveMinutesAgo,
	}))

	must(store.UpdateSystemIntakeFundingSources(ctx, intake.ID, fundingSources))

	return &intake
}

func makeBusinessCase(name string, logger *zap.Logger, store *storage.Store, intake *models.SystemIntake, callbacks ...func(*models.BusinessCase)) {
	ctx := appcontext.WithLogger(context.Background(), logger)
	if intake == nil {
		intake = makeSystemIntake(name, logger, store)
	}

	phase := models.LifecycleCostPhaseDEVELOPMENT
	cost := 123456
	noCost := 0
	businessCase := models.BusinessCase{
		SystemIntakeID:       intake.ID,
		EUAUserID:            "ABCD",
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
		EUAUserID: "ABCD",
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

func makeTRBRequest(rType models.TRBRequestType, logger *zap.Logger, store *storage.Store, callbacks ...func(*models.TRBRequest)) *models.TRBRequest {
	ctx := ctxWithLoggerAndPrincipal(logger, "ABCD") //TODO Parameterize the EUA ID

	trb, err := resolvers.CreateTRBRequest(ctx, rType, fetchUserInfoMock, store)
	if err != nil {
		panic(err)
	}
	for _, cb := range callbacks {
		cb(trb)
	}
	must(store.UpdateTRBRequest(ctx, trb))
	return trb
}

func updateTRBRequestForm(logger *zap.Logger, store *storage.Store, changes map[string]interface{}) *models.TRBRequestForm {
	ctx := ctxWithLoggerAndPrincipal(logger, "ABCD") //TODO Parameterize the EUA ID

	form, err := resolvers.UpdateTRBRequestForm(ctx, store, nil, fetchUserInfoMock, changes)
	if err != nil {
		panic(err)
	}
	return form
}
