package main

import (
	"context"
	"time"

	"github.com/guregu/null"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/cmd/devdata/mock"
	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

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

func makeDraftBusinessCaseV1(name string, logger *zap.Logger, store *storage.Store, intake *models.SystemIntake) *models.SystemIntake {
	return makeBusinessCaseV1(name, logger, store, intake)
}

func makeFinalBusinessCaseV1(name string, logger *zap.Logger, store *storage.Store, intake *models.SystemIntake) *models.SystemIntake {
	return makeBusinessCaseV1(name, logger, store, intake, func(b *models.BusinessCase) {
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

func makeBusinessCaseV1(name string, logger *zap.Logger, store *storage.Store, intake *models.SystemIntake, callbacks ...func(*models.BusinessCase)) *models.SystemIntake {
	ctx := appcontext.WithLogger(context.Background(), logger)
	if intake == nil {
		intake = makeSystemIntake(name, nil, logger, store)
	}
	if intake.Step == models.SystemIntakeStepDRAFTBIZCASE {
		intake.DraftBusinessCaseState = models.SIRFSInProgress
	}
	if intake.Step == models.SystemIntakeStepFINALBIZCASE {
		intake.FinalBusinessCaseState = models.SIRFSInProgress
	}
	intake, err := store.UpdateSystemIntake(ctx, intake)
	if err != nil {
		panic(err)
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

	_, err = store.CreateBusinessCase(ctx, &businessCase)
	if err != nil {
		panic(err)
	}
	return intake
}
