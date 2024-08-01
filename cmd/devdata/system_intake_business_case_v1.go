package main

import (
	"context"

	"github.com/guregu/null"

	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

func makeDraftBusinessCaseV1(ctx context.Context, name string, store *storage.Store, intake *models.SystemIntake) *models.SystemIntake {
	return makeBusinessCaseV1(ctx, name, store, intake)
}

func makeFinalBusinessCaseV1(ctx context.Context, name string, store *storage.Store, intake *models.SystemIntake) *models.SystemIntake {
	return makeBusinessCaseV1(ctx, name, store, intake, func(b *models.BusinessCaseWithCosts) {
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
	ctx context.Context,
	store *storage.Store,
	intake *models.SystemIntake,
) *models.SystemIntake {
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

func makeBusinessCaseV1(ctx context.Context, name string, store *storage.Store, intake *models.SystemIntake, callbacks ...func(*models.BusinessCaseWithCosts)) *models.SystemIntake {
	if intake == nil {
		intake = makeSystemIntake(ctx, name, nil, "USR1", store)
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
		SystemIntakeID:         intake.ID,
		EUAUserID:              intake.EUAUserID.ValueOrZero(),
		Requester:              null.StringFrom("Shane Clark"),
		RequesterPhoneNumber:   null.StringFrom("3124567890"),
		Status:                 models.BusinessCaseStatusOPEN,
		ProjectName:            null.StringFrom(name),
		BusinessOwner:          null.StringFrom("Shane Clark"),
		BusinessNeed:           null.StringFrom("business need"),
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
	bcWCosts := models.BusinessCaseWithCosts{
		BusinessCase: businessCase,
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
	}
	for _, cb := range callbacks {
		cb(&bcWCosts)
	}

	_, err = store.CreateBusinessCase(ctx, &bcWCosts)
	if err != nil {
		panic(err)
	}
	return intake
}
