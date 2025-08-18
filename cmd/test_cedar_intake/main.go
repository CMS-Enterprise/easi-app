package main

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
	"github.com/spf13/cobra"
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cms-enterprise/easi-app/pkg/appconfig"
	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/cedar/intake"
	"github.com/cms-enterprise/easi-app/pkg/cedar/intake/translation"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
	"github.com/cms-enterprise/easi-app/pkg/testhelpers"
)

func noErr(err error) {
	if err != nil {
		fmt.Println("Error!")
		fmt.Println(err)
		panic("Aborting")
	}
}

type testData struct {
	action       *models.Action
	businessCase *models.BusinessCaseWithCosts
	// feedback     *models.GRTFeedback
	note         *models.SystemIntakeNote
	systemIntake *models.SystemIntake
}

type usefulTimes struct {
	now                   time.Time
	fiveMinutesAgo        time.Time
	sevenMinutesAgo       time.Time
	tenMinutesAgo         time.Time
	oneHourInTheFuture    time.Time
	twoHoursInTheFuture   time.Time
	threeYearsInTheFuture time.Time
}

// borrowed from cmd/devdata/main.go
func date(year, month, day int) *time.Time {
	date := time.Date(year, time.Month(month), day, 0, 0, 0, 0, time.UTC)
	return &date
}

// sample data adapted from Impl environment - 08/17/2022
func makeTestSystemIntake(times usefulTimes, projectName string) *models.SystemIntake {
	systemIntakeID := uuid.New()
	systemIntake := &models.SystemIntake{
		ID:          systemIntakeID,
		ProjectName: null.StringFrom(projectName),

		CreatedAt:   &times.tenMinutesAgo,
		SubmittedAt: &times.sevenMinutesAgo,
		UpdatedAt:   &times.fiveMinutesAgo,
		DecidedAt:   nil,
		ArchivedAt:  nil,

		EUAUserID: null.StringFrom("SWKJ"),

		RequestType: models.SystemIntakeRequestTypeNEW,

		Requester: "Dylan Sprague",
		Component: null.StringFrom("Center for Medicaid and CHIP Services"),

		BusinessOwner:          null.StringFrom("Clay Benson"),
		BusinessOwnerComponent: null.StringFrom("Center for Clinical Standards and Quality"),

		ProductManager:          null.StringFrom("Jeremiah Strang"),
		ProductManagerComponent: null.StringFrom("Center for Clinical Standards and Quality"),

		ISSOName:                    null.StringFrom("Isaac ISSO"),
		TRBCollaboratorName:         null.StringFrom("Sara TRB"),
		OITSecurityCollaboratorName: null.StringFrom("Chris OIT"),
		CollaboratorName508:         null.StringFrom("Joe 508"),

		ExistingFunding: null.BoolFrom(true),
		FundingSources: []*models.SystemIntakeFundingSource{
			{
				ID:             uuid.New(),
				ProjectNumber:  null.StringFrom("123456"),
				Investment:     null.StringFrom("HITECH Medicare"),
				SystemIntakeID: systemIntakeID,
				CreatedAt:      &times.now,
			},
			{
				ID:             uuid.New(),
				ProjectNumber:  null.StringFrom("789012"),
				Investment:     null.StringFrom("Recovery Audit Contractors"),
				SystemIntakeID: systemIntakeID,
				CreatedAt:      &times.now,
			},
		},

		BusinessNeed: null.StringFrom("A business need. TACO is a new tool for customers to access consolidated Active health information and facilitate the new Medicare process. The purpose is to provide a more integrated and unified customer service experience."),
		Solution:     null.StringFrom("A solution. TACO is a new tool for customers to access consolidated Active health information and facilitate the new Medicare process. The purpose is to provide a more integrated and unified customer service experience."),

		ProcessStatus:      null.StringFrom("I have done some initial research"),
		EASupportRequest:   null.BoolFrom(true),
		HasUIChanges:       null.BoolFrom(false),
		ExistingContract:   null.StringFrom("NOT_STARTED"),
		CostIncrease:       null.StringFrom("YES"),
		CostIncreaseAmount: null.StringFrom("10 million dollars?"),
		ContractStartDate:  date(2021, 1, 1),
		ContractEndDate:    date(2023, 12, 31),
		ContractVehicle:    null.StringFrom("Sole source"),
		Contractor:         null.StringFrom("ACME Co."),
		AdminLead:          null.StringFrom("Valerie Hartz"),
		GRTDate:            &times.oneHourInTheFuture,
		GRBDate:            &times.twoHoursInTheFuture,

		LifecycleID:           null.StringFrom("221360"),
		LifecycleScope:        models.HTMLPointer("This LCID covers stuff for 3 years"),
		LifecycleCostBaseline: null.StringFrom("about 10,000,000"),
		LifecycleExpiresAt:    &times.threeYearsInTheFuture,

		Step:          models.SystemIntakeStepDECISION,
		State:         models.SystemIntakeStateOpen,
		DecisionState: models.SIDSNotApproved,
	}

	return systemIntake
}

func makeTestAction(systemIntake models.SystemIntake) *models.Action {
	action := &models.Action{
		ID:             uuid.New(),
		IntakeID:       &systemIntake.ID,
		ActionType:     models.ActionTypeSUBMITINTAKE,
		ActorName:      "Dylan Sprague",
		ActorEmail:     "dylan.sprague@oddball.io",
		ActorEUAUserID: "SWKJ",
		CreatedAt:      systemIntake.SubmittedAt,
	}

	return action
}

func makeTestNote(systemIntake models.SystemIntake) *models.SystemIntakeNote {
	note := &models.SystemIntakeNote{
		ID:             uuid.New(),
		SystemIntakeID: systemIntake.ID,
		AuthorEUAID:    "BC0V",
		AuthorName:     null.StringFrom("Clay Benson"),
		Content:        models.HTMLPointer("a clever remark"),
		CreatedAt:      systemIntake.UpdatedAt,
	}

	return note
}

func makeTestBusinessCase(times usefulTimes, systemIntake models.SystemIntake) *models.BusinessCaseWithCosts {
	bc := models.BusinessCase{
		ID:             uuid.New(),
		SystemIntakeID: systemIntake.ID,

		CreatedAt:  &times.fiveMinutesAgo,
		UpdatedAt:  &times.now,
		ArchivedAt: nil,

		EUAUserID:            systemIntake.EUAUserID.ValueOrZero(),
		Requester:            null.StringFrom(systemIntake.Requester),
		RequesterPhoneNumber: null.StringFrom("123-456-7890"),
		BusinessOwner:        systemIntake.BusinessOwner,
		ProjectName:          systemIntake.ProjectName,
		BusinessNeed:         systemIntake.BusinessNeed,
		Status:               models.BusinessCaseStatusOPEN,

		CMSBenefit:             null.StringFrom("Reduce FTE hours and generate better end products"),
		CurrentSolutionSummary: null.StringFrom("Nothing good"),
		PriorityAlignment:      null.StringFrom("Aligns with CMS' automation push"),
		SuccessIndicators:      null.StringFrom("95% on rotten tomatoes"),

		// business solution - preferred
		PreferredTitle:                   null.StringFrom("Cut the Gordian Knot"),
		PreferredSummary:                 null.StringFrom("Call in Alexander the Great"),
		PreferredAcquisitionApproach:     null.StringFrom("Visit Macedonia"),
		PreferredPros:                    null.StringFrom("Is simple"),
		PreferredCons:                    null.StringFrom("Might accidentally conquer ancient Persia"),
		PreferredCostSavings:             null.StringFrom("Lots"),
		PreferredHasUI:                   null.StringFrom("YES"),
		PreferredHostingType:             null.StringFrom("cloud"),
		PreferredHostingLocation:         null.StringFrom("aws-west"),
		PreferredSecurityIsApproved:      null.BoolFrom(true),
		PreferredSecurityIsBeingReviewed: null.StringFrom(""),
		PreferredHostingCloudServiceType: null.StringFrom("PaaS"),

		// business solution - alternative A
		AlternativeATitle:                   null.StringFrom("Scylla"),
		AlternativeASummary:                 null.StringFrom("Six-headed sea monster"),
		AlternativeAAcquisitionApproach:     null.StringFrom("Sail near Calabria"),
		AlternativeAPros:                    null.StringFrom("Manage to get through"),
		AlternativeACons:                    null.StringFrom("Lose a few sailors"),
		AlternativeACostSavings:             null.StringFrom("Save on salary"),
		AlternativeAHasUI:                   null.StringFrom("NO"),
		AlternativeAHostingType:             null.StringFrom("none"),
		AlternativeAHostingLocation:         null.StringFrom(""),
		AlternativeASecurityIsApproved:      null.BoolFrom(false),
		AlternativeASecurityIsBeingReviewed: null.StringFrom("NOT_SURE"),
		AlternativeAHostingCloudServiceType: null.StringFrom(""),

		// business solution - alternative B
		AlternativeBTitle:                   null.StringFrom("Charybdis"),
		AlternativeBSummary:                 null.StringFrom("Giant whirlpool"),
		AlternativeBAcquisitionApproach:     null.StringFrom("Sail near Sicily"),
		AlternativeBPros:                    null.StringFrom("Might be able to avoid it completely"),
		AlternativeBCons:                    null.StringFrom("Might lose the entire ship"),
		AlternativeBCostSavings:             null.StringFrom(""),
		AlternativeBHasUI:                   null.StringFrom("NOT_SURE"),
		AlternativeBHostingType:             null.StringFrom("dataCenter"),
		AlternativeBHostingLocation:         null.StringFrom("AWS"),
		AlternativeBSecurityIsApproved:      null.BoolFromPtr(nil),
		AlternativeBSecurityIsBeingReviewed: null.StringFromPtr(nil),
		AlternativeBHostingCloudServiceType: null.StringFromPtr(nil),
	}
	businessCase := &models.BusinessCaseWithCosts{
		BusinessCase:       bc,
		LifecycleCostLines: []models.EstimatedLifecycleCost{},
	}

	// lifecycle cost items
	possibleSolutions := []models.LifecycleCostSolution{
		models.LifecycleCostSolutionPREFERRED,
		models.LifecycleCostSolutionA,
		models.LifecycleCostSolutionB,
	}
	possibleYears := []models.LifecycleCostYear{
		models.LifecycleCostYear1,
		models.LifecycleCostYear2,
		models.LifecycleCostYear3,
		models.LifecycleCostYear4,
		models.LifecycleCostYear5,
	}
	possiblePhases := []models.LifecycleCostPhase{
		models.LifecycleCostPhaseDEVELOPMENT,
		models.LifecycleCostPhaseOPERATIONMAINTENANCE,
		models.LifecycleCostPhaseHELPDESK,
		models.LifecycleCostPhaseSOFTWARE,
		models.LifecycleCostPhasePLANNING,
		models.LifecycleCostPhaseINFRASTRUCTURE,
		models.LifecycleCostPhaseOIT,
		models.LifecycleCostPhaseOTHER,
	}

	increasingCost := 1

	for _, solution := range possibleSolutions {
		for _, year := range possibleYears {
			for _, phase := range possiblePhases {
				phase := phase

				// make a copy, so when we increment costAmount, previously created lifecycleCost.Cost's don't point to the updated value
				cost := int64(increasingCost)

				lifecycleCost := models.EstimatedLifecycleCost{
					ID:             uuid.New(),
					BusinessCaseID: businessCase.ID,
					Solution:       solution,
					Year:           year,
					Phase:          &phase,
					Cost:           &cost,
				}
				businessCase.LifecycleCostLines = append(businessCase.LifecycleCostLines, lifecycleCost)
				increasingCost++
			}
		}
	}

	return businessCase
}

// func makeTestGRTFeedback(times usefulTimes, systemIntake models.SystemIntake) *models.GRTFeedback {
// 	feedback := &models.GRTFeedback{
// 		ID:           uuid.New(),
// 		IntakeID:     systemIntake.ID,
// 		FeedbackType: models.GRTFeedbackTypeGRB,
// 		Feedback:     "this was awesome. Great job! ",
// 		CreatedAt:    &times.now,
// 		UpdatedAt:    &times.now,
// 	}

// 	return feedback
// }

func makeTestData() *testData {
	now := time.Now()
	times := usefulTimes{
		now:                   now,
		fiveMinutesAgo:        now.Add(-5 * time.Minute),
		sevenMinutesAgo:       now.Add(-7 * time.Minute),
		tenMinutesAgo:         now.Add(-10 * time.Minute),
		oneHourInTheFuture:    now.Add(1 * time.Hour),
		twoHoursInTheFuture:   now.Add(2 * time.Hour),
		threeYearsInTheFuture: now.AddDate(3, 0, 0),
	}

	projectName := fmt.Sprintf("TestIntake-%s-Project", now.Format(time.RFC3339))

	testIntake := makeTestSystemIntake(times, projectName)
	testAction := makeTestAction(*testIntake)
	testNote := makeTestNote(*testIntake)
	testBusinessCase := makeTestBusinessCase(times, *testIntake)
	// testGRTFeedback := makeTestGRTFeedback(times, *testIntake)

	return &testData{
		action:       testAction,
		businessCase: testBusinessCase,
		// feedback:     testGRTFeedback,
		note:         testNote,
		systemIntake: testIntake,
	}
}

func makeCedarIntakeClient() *intake.Client {
	cedarAPIHost := os.Getenv(appconfig.CEDARAPIURL)
	cedarAPIKey := os.Getenv(appconfig.CEDARAPIKey)

	client := intake.NewClient(cedarAPIHost, cedarAPIKey, false, false)
	return client
}

func submitToCEDAR(ctx context.Context) {
	zapLogger, err := zap.NewDevelopment()
	noErr(err)

	ctx = appcontext.WithLogger(ctx, zapLogger)

	client := makeCedarIntakeClient()

	testData := makeTestData()

	/*
		fmt.Println("Sending action")
		err = client.PublishAction(ctx, *testData.action)
		noErr(err)
		fmt.Println("Successfully sent action")
	*/

	fmt.Println("Sending Business Case")
	err = client.PublishBusinessCase(ctx, *testData.businessCase)
	noErr(err)
	fmt.Println("Successfully sent Business Case")

	// fmt.Println("Sending GRT feedback")
	// err = client.PublishGRTFeedback(ctx, *testData.feedback)
	// noErr(err)
	// fmt.Println("Successfully sent GRT feedback")

	/*
		fmt.Println("Sending note")
		err = client.PublishNote(ctx, *testData.note)
		noErr(err)
		fmt.Println("Successfully sent note")
	*/

	fmt.Println("Sending system intake")
	err = client.PublishSystemIntake(ctx, *testData.systemIntake)
	noErr(err)
	fmt.Println("Successfully sent system intake")
}

func dumpIntakeObject(ctx context.Context, obj translation.IntakeObject, directory string) {

	filename := filepath.Join(directory, obj.ObjectType()+".json")

	intakeModel, err := obj.CreateIntakeModel(ctx)
	noErr(err)

	err = os.WriteFile(filename, []byte(*intakeModel.Body), 0600)
	noErr(err)
}

func dumpPayload(ctx context.Context) {
	// os.Executable() doesn't work properly with "go run", so use runtime.Caller() instead
	// see https://stackoverflow.com/a/70491592
	_, sourceFilename, _, _ := runtime.Caller(0)
	execDir := filepath.Dir(sourceFilename)

	testData := makeTestData()

	fmt.Println("Dumping Business Case data")
	businessCaseIntakeObject := translation.TranslatableBusinessCase(*testData.businessCase)
	dumpIntakeObject(ctx, &businessCaseIntakeObject, execDir)
	fmt.Println("Business case data dumped inside " + execDir + string(filepath.Separator))

	// fmt.Println("Dumping GRT feedback data")
	// feedbackIntakeObject := translation.TranslatableFeedback(*testData.feedback)
	// dumpIntakeObject(&feedbackIntakeObject, execDir)
	// fmt.Println("GRT feedback data dumped inside " + execDir + string(filepath.Separator))

	fmt.Println("Dumping system intake data")
	systemIntakeIntakeObject := translation.TranslatableSystemIntake(*testData.systemIntake)
	dumpIntakeObject(ctx, &systemIntakeIntakeObject, execDir)
	fmt.Println("System intake data dumped inside " + execDir + string(filepath.Separator))
}

func submitCmd(ctx context.Context) *cobra.Command {
	return &cobra.Command{
		Use:   "submit",
		Short: "Submit test data to CEDAR Intake",
		Long:  "Submit test data to CEDAR Intake",
		Run: func(cmd *cobra.Command, args []string) {
			submitToCEDAR(ctx)
		},
	}
}

func dumpCmd(ctx context.Context) *cobra.Command {
	return &cobra.Command{
		Use:   "dump",
		Short: "Dump test data payloads to local files",
		Long:  "Dump test data payloads to local files",
		Run: func(cmd *cobra.Command, args []string) {
			dumpPayload(ctx)
		},
	}
}

var rootCmd = &cobra.Command{
	Use:   "test_cedar_intake",
	Short: "Utility for testing functionality related to the CEDAR Intake API",
	Long:  `Utility for either submitting test data to the CEDAR Intake API or dumping the JSON payload that would be submitted to a local file`,
}

func execute() {
	ctx := context.Background()
	logger, err := zap.NewDevelopment()
	if err != nil {
		panic(fmt.Errorf("problem initializing dev logger in test_cedar_intake: %w", err))
	}

	ctx = appcontext.WithLogger(ctx, logger)

	config := testhelpers.NewConfig()
	dbConfig := storage.DBConfig{
		Host:           config.GetString(appconfig.DBHostConfigKey),
		Port:           config.GetString(appconfig.DBPortConfigKey),
		Database:       config.GetString(appconfig.DBNameConfigKey),
		Username:       config.GetString(appconfig.DBUsernameConfigKey),
		Password:       config.GetString(appconfig.DBPasswordConfigKey),
		SSLMode:        config.GetString(appconfig.DBSSLModeConfigKey),
		MaxConnections: config.GetInt(appconfig.DBMaxConnections),
	}

	ldClient, err := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	if err != nil {
		panic(fmt.Errorf("problem creating custom launchDarkly client in test_cedar_intake: %w", err))
	}

	store, err := storage.NewStore(dbConfig, ldClient)
	if err != nil {
		panic(fmt.Errorf("problem intializing store in test_cedar_intake: %w", err))
	}

	buildDataloaders := func() *dataloaders.Dataloaders {
		return dataloaders.NewDataloaders(
			store,
			func(ctx context.Context, s []string) ([]*models.UserInfo, error) { return nil, nil },
			func(ctx context.Context) ([]*models.CedarSystem, error) { return nil, nil },
		)
	}

	ctx = dataloaders.CTXWithLoaders(ctx, buildDataloaders)

	rootCmd.AddCommand(
		submitCmd(ctx),
		dumpCmd(ctx),
	)

	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func main() {
	execute()
}
