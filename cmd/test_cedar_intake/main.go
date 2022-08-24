package main

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"
	"gopkg.in/launchdarkly/go-server-sdk.v5/ldcomponents"
	"gopkg.in/launchdarkly/go-server-sdk.v5/testhelpers/ldtestdata"

	"github.com/cmsgov/easi-app/pkg/appconfig"
	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/cedar/intake"
	"github.com/cmsgov/easi-app/pkg/models"
)

type testData struct {
	action       *models.Action
	businessCase *models.BusinessCase
	feedback     *models.GRTFeedback
	note         *models.Note
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
		Status:    models.SystemIntakeStatusBIZCASEFINALNEEDED,

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
		EACollaboratorName:          null.StringFrom("Sai EA"),

		ExistingFunding: null.BoolFrom(true),
		FundingSources: []*models.SystemIntakeFundingSource{
			{
				ID:             uuid.New(),
				FundingNumber:  null.StringFrom("123456"),
				Source:         null.StringFrom("HITECH Medicare"),
				SystemIntakeID: systemIntakeID,
				CreatedAt:      &times.now,
			},
			{
				ID:             uuid.New(),
				FundingNumber:  null.StringFrom("789012"),
				Source:         null.StringFrom("Recovery Audit Contractors"),
				SystemIntakeID: systemIntakeID,
				CreatedAt:      &times.now,
			},
		},

		BusinessNeed: null.StringFrom("A business need. TACO is a new tool for customers to access consolidated Active health information and facilitate the new Medicare process. The purpose is to provide a more integrated and unified customer service experience."),
		Solution:     null.StringFrom("A solution. TACO is a new tool for customers to access consolidated Active health information and facilitate the new Medicare process. The purpose is to provide a more integrated and unified customer service experience."),

		ProcessStatus:      null.StringFrom("I have done some initial research"),
		EASupportRequest:   null.BoolFrom(true),
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
		LifecycleScope:        null.StringFrom("This LCID covers stuff for 3 years"),
		LifecycleCostBaseline: null.StringFrom("about 10,000,000"),
		LifecycleExpiresAt:    &times.threeYearsInTheFuture,
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

func makeTestNote(systemIntake models.SystemIntake) *models.Note {
	note := &models.Note{
		ID:             uuid.New(),
		SystemIntakeID: systemIntake.ID,
		AuthorEUAID:    "BC0V",
		AuthorName:     null.StringFrom("Clay Benson"),
		Content:        null.StringFrom("a clever remark"),
		CreatedAt:      systemIntake.UpdatedAt,
	}

	return note
}

func makeTestBusinessCase(times usefulTimes, systemIntake models.SystemIntake) *models.BusinessCase {
	businessCase := &models.BusinessCase{
		ID:                 uuid.New(),
		SystemIntakeID:     systemIntake.ID,
		SystemIntakeStatus: systemIntake.Status,

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

		LifecycleCostLines: models.EstimatedLifecycleCosts{},
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

	costAmount := 1

	for _, solution := range possibleSolutions {
		for _, year := range possibleYears {
			for _, phase := range possiblePhases {
				phase := phase
				lifecycleCost := models.EstimatedLifecycleCost{
					ID:             uuid.New(),
					BusinessCaseID: businessCase.ID,
					Solution:       solution,
					Year:           year,
					Phase:          &phase,
					Cost:           &costAmount,
				}
				businessCase.LifecycleCostLines = append(businessCase.LifecycleCostLines, lifecycleCost)
				costAmount++
			}
		}
	}

	return businessCase
}

func makeTestGRTFeedback(times usefulTimes, systemIntake models.SystemIntake) *models.GRTFeedback {
	feedback := &models.GRTFeedback{
		ID:           uuid.New(),
		IntakeID:     systemIntake.ID,
		FeedbackType: models.GRTFeedbackTypeGRB,
		Feedback:     "this was awesome. Great job! ",
		CreatedAt:    &times.now,
		UpdatedAt:    &times.now,
	}

	return feedback
}

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
	testGRTFeedback := makeTestGRTFeedback(times, *testIntake)

	return &testData{
		action:       testAction,
		businessCase: testBusinessCase,
		feedback:     testGRTFeedback,
		note:         testNote,
		systemIntake: testIntake,
	}
}

func makeCedarIntakeClient() *intake.Client {
	cedarAPIHost := os.Getenv(appconfig.CEDARAPIURL)
	cedarAPIKey := os.Getenv(appconfig.CEDARAPIKey)

	td := ldtestdata.DataSource()
	td.Update(td.Flag("emit-to-cedar").BooleanFlag().VariationForAllUsers(true))
	config := ld.Config{
		DataSource: td,
		Events:     ldcomponents.NoEvents(),
	}

	ldClient, err := ld.MakeCustomClient("fake", config, 0)
	if err != nil {
		fmt.Println(err)
		panic("Error initializing ldClient")
	}

	client := intake.NewClient(cedarAPIHost, cedarAPIKey, ldClient)
	return client
}

func noErr(err error) {
	if err != nil {
		fmt.Println("Error!")
		fmt.Println(err)
		panic("Aborting")
	}
}

func main() {
	zapLogger, err := zap.NewDevelopment()
	noErr(err)

	ctx := appcontext.WithLogger(context.Background(), zapLogger)

	client := makeCedarIntakeClient()

	testData := makeTestData()

	/*
		fmt.Println("Sending action")
		err = client.PublishAction(ctx, *testData.action)
		noErr(err)
		fmt.Println("Successfully sent action")
	*/

	fmt.Println("Sending business case")
	err = client.PublishBusinessCase(ctx, *testData.businessCase)
	noErr(err)
	fmt.Println("Successfully sent business case")

	fmt.Println("Sending GRT feedback")
	err = client.PublishGRTFeedback(ctx, *testData.feedback)
	noErr(err)
	fmt.Println("Successfully sent GRT feedback")

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
