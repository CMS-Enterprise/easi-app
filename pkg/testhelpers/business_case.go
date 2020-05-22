package testhelpers

import (
	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cmsgov/easi-app/pkg/models"
)

// EstimatedLifecycleCostOptions allows cost options to be customized
type EstimatedLifecycleCostOptions struct {
	BusinessCaseID *uuid.UUID
	Solution       *models.LifecycleCostSolution
	Phase          *models.LifecycleCostPhase
	Year           *models.LifecycleCostYear
	Cost           *int
}

// NewEstimatedLifecycleCost helps generate a new lifecycle cost for a given business case
func NewEstimatedLifecycleCost(opts EstimatedLifecycleCostOptions) models.EstimatedLifecycleCost {
	development := models.LifecycleCostPhaseDEVELOPMENT
	cost := 100
	elc := models.EstimatedLifecycleCost{
		ID:             uuid.New(),
		BusinessCaseID: uuid.New(),
		Solution:       models.LifecycleCostSolutionASIS,
		Phase:          &development,
		Year:           models.LifecycleCostYear1,
		Cost:           &cost,
	}
	if opts.Solution != nil {
		elc.Solution = *opts.Solution
	}
	if opts.Phase != nil {
		elc.Phase = opts.Phase
	}
	if opts.Year != nil {
		elc.Year = *opts.Year
	}
	if opts.Cost != nil {
		elc.Cost = opts.Cost
	}
	if opts.BusinessCaseID != nil {
		elc.BusinessCaseID = *opts.BusinessCaseID
	}
	return elc
}

// NewBusinessCase allows us to generate a business case for tests
func NewBusinessCase() models.BusinessCase {
	year2 := models.LifecycleCostYear2
	return models.BusinessCase{
		EUAUserID:                       RandomEUAID(),
		SystemIntakeID:                  uuid.New(),
		ProjectName:                     null.StringFrom("Test Project Name"),
		Status:                          models.BusinessCaseStatusDRAFT,
		Requester:                       null.StringFrom("Test Requester"),
		RequesterPhoneNumber:            null.StringFrom("Test Requester Phone Number"),
		BusinessOwner:                   null.StringFrom("Test Business Owner"),
		BusinessNeed:                    null.StringFrom("Test Business Need"),
		CMSBenefit:                      null.StringFrom("Test CMS Benefit"),
		PriorityAlignment:               null.StringFrom("Test Priority Alignment"),
		SuccessIndicators:               null.StringFrom("Test Success Indicators"),
		AsIsTitle:                       null.StringFrom("Test As Is Title"),
		AsIsSummary:                     null.StringFrom("Test As Is Summary"),
		AsIsPros:                        null.StringFrom("Test As Is Pros"),
		AsIsCons:                        null.StringFrom("Test As Is Cons"),
		AsIsCostSavings:                 null.StringFrom("Test As Is Cost Savings"),
		PreferredTitle:                  null.StringFrom("Test Preferred Title"),
		PreferredSummary:                null.StringFrom("Test Preferred Summary"),
		PreferredAcquisitionApproach:    null.StringFrom("Test Preferred Acquisition Approach"),
		PreferredPros:                   null.StringFrom("Test Preferred Pros"),
		PreferredCons:                   null.StringFrom("Test Preferred Cons"),
		PreferredCostSavings:            null.StringFrom("Test Preferred Cost Savings"),
		AlternativeATitle:               null.StringFrom("Test Alternative A Title"),
		AlternativeASummary:             null.StringFrom("Test Alternative A Summary"),
		AlternativeAAcquisitionApproach: null.StringFrom("Test Alternative A Acquisition Approach"),
		AlternativeAPros:                null.StringFrom("Test Alternative A Pros"),
		AlternativeACons:                null.StringFrom("Test Alternative A Cons"),
		AlternativeACostSavings:         null.StringFrom("Test Alternative A Cost Savings"),
		AlternativeBTitle:               null.StringFrom("Test Alternative B Title"),
		AlternativeBSummary:             null.StringFrom("Test Alternative B Summary"),
		AlternativeBAcquisitionApproach: null.StringFrom("Test Alternative B Acquisition Approach"),
		AlternativeBPros:                null.StringFrom("Test Alternative B Pros"),
		AlternativeBCons:                null.StringFrom("Test Alternative B Cons"),
		AlternativeBCostSavings:         null.StringFrom("Test Alternative B Cost Savings"),
		LifecycleCostLines: models.EstimatedLifecycleCosts{
			NewEstimatedLifecycleCost(
				EstimatedLifecycleCostOptions{Year: &year2},
			),
			NewEstimatedLifecycleCost(EstimatedLifecycleCostOptions{}),
		},
	}
}
