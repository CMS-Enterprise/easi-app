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

// borrowed from cmd/devdata/main.go
func date(year, month, day int) *time.Time {
	date := time.Date(year, time.Month(month), day, 0, 0, 0, 0, time.UTC)
	return &date
}

func makeTestData() *testData {
	now := time.Now()
	fiveMinutesAgo := now.Add(-5 * time.Minute)
	tenMinutesAgo := now.Add(-10 * time.Minute)

	projectName := "Intake API Test Project"

	// borrowed from cmd/devdata/main.go makeSystemIntake()
	systemIntake := &models.SystemIntake{
		ID: uuid.New(),

		CreatedAt: &tenMinutesAgo,
		UpdatedAt: &fiveMinutesAgo,

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

		ProjectName:     null.StringFrom(projectName),
		ExistingFunding: null.BoolFrom(true),
		FundingNumber:   null.StringFrom("123456"),
		FundingSource:   null.StringFrom("Research"),
		BusinessNeed:    null.StringFrom("A business need. TACO is a new tool for customers to access consolidated Active health information and facilitate the new Medicare process. The purpose is to provide a more integrated and unified customer service experience."),
		Solution:        null.StringFrom("A solution. TACO is a new tool for customers to access consolidated Active health information and facilitate the new Medicare process. The purpose is to provide a more integrated and unified customer service experience."),

		ProcessStatus:      null.StringFrom("I have done some initial research"),
		EASupportRequest:   null.BoolFrom(true),
		ExistingContract:   null.StringFrom("HAVE_CONTRACT"),
		CostIncrease:       null.StringFrom("YES"),
		CostIncreaseAmount: null.StringFrom("10 million dollars?"),

		ContractStartDate: date(2021, 1, 1),
		ContractEndDate:   date(2023, 12, 31),
		ContractVehicle:   null.StringFrom("Sole source"),
		Contractor:        null.StringFrom("Contractor Name"),

		LifecycleCostBaseline: null.StringFrom("100 BILLION DOLLARS!"),
	}

	// borrowed from cmd/devdata/main.go makeSystemIntake()
	action := &models.Action{
		ID:             uuid.New(),
		IntakeID:       &systemIntake.ID,
		ActionType:     models.ActionTypeSUBMITINTAKE,
		ActorName:      "Actor Name",
		ActorEmail:     "actor@example.com",
		ActorEUAUserID: "ACT1",
		CreatedAt:      &tenMinutesAgo,
	}

	// borrowed from cmd/devdata/main.go makeSystemIntake()
	note := &models.Note{
		ID:             uuid.New(),
		SystemIntakeID: systemIntake.ID,
		AuthorEUAID:    "QQQQ",
		AuthorName:     null.StringFrom("Author Name"),
		Content:        null.StringFrom("a clever remark"),
		CreatedAt:      &fiveMinutesAgo,
	}

	// borrowed from cmd/devdata/main.go makeBusinessCase()
	phase := models.LifecycleCostPhaseDEVELOPMENT
	cost := 123456
	noCost := 0
	businessCase := &models.BusinessCase{
		ID:                   uuid.New(),
		CreatedAt:            &fiveMinutesAgo,
		UpdatedAt:            &now,
		SystemIntakeID:       systemIntake.ID,
		EUAUserID:            "ABCD",
		Requester:            null.StringFrom("Shane Clark"),
		RequesterPhoneNumber: null.StringFrom("3124567890"),
		Status:               models.BusinessCaseStatusOPEN,
		ProjectName:          null.StringFrom(projectName),
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
		ArchivedAt:             &now,

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

	feedback := &models.GRTFeedback{
		ID:           uuid.New(),
		IntakeID:     systemIntake.ID,
		FeedbackType: models.GRTFeedbackTypeGRB,
		Feedback:     "Example feedback",
		CreatedAt:    &now,
		UpdatedAt:    &now,
	}

	return &testData{
		action,
		businessCase,
		feedback,
		note,
		systemIntake,
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
