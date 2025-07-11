package testhelpers

import (
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

// EstimatedLifecycleCostOptions allows cost options to be customized
type EstimatedLifecycleCostOptions struct {
	BusinessCaseID *uuid.UUID
	Solution       *models.LifecycleCostSolution
	Phase          *models.LifecycleCostPhase
	Year           *models.LifecycleCostYear
	Cost           *int64
}

// NewEstimatedLifecycleCost helps generate a new lifecycle cost for a given Business Case
func NewEstimatedLifecycleCost(opts EstimatedLifecycleCostOptions) models.EstimatedLifecycleCost {
	development := models.LifecycleCostPhaseDEVELOPMENT
	cost := int64(100)
	elc := models.EstimatedLifecycleCost{
		ID:             uuid.New(),
		BusinessCaseID: uuid.New(),
		Solution:       models.LifecycleCostSolutionPREFERRED,
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

// NewValidLifecycleCosts helps generate valid lifecycle costs for a given Business Case ready for submission
func NewValidLifecycleCosts(id *uuid.UUID) models.EstimatedLifecycleCosts {
	dev := models.LifecycleCostPhaseDEVELOPMENT
	om := models.LifecycleCostPhaseOPERATIONMAINTENANCE
	other := models.LifecycleCostPhaseOTHER
	cost := int64(100)
	return models.EstimatedLifecycleCosts{
		models.EstimatedLifecycleCost{
			BusinessCaseID: *id,
			Solution:       models.LifecycleCostSolutionPREFERRED,
			Year:           models.LifecycleCostYear1,
			Phase:          &dev,
			Cost:           &cost,
		},
		models.EstimatedLifecycleCost{
			BusinessCaseID: *id,
			Solution:       models.LifecycleCostSolutionPREFERRED,
			Year:           models.LifecycleCostYear1,
			Phase:          &other,
			Cost:           &cost,
		},
		models.EstimatedLifecycleCost{
			BusinessCaseID: *id,
			Solution:       models.LifecycleCostSolutionPREFERRED,
			Year:           models.LifecycleCostYear2,
			Phase:          &om,
			Cost:           &cost,
		},
		models.EstimatedLifecycleCost{
			BusinessCaseID: *id,
			Solution:       models.LifecycleCostSolutionPREFERRED,
			Year:           models.LifecycleCostYear3,
			Phase:          &om,
			Cost:           &cost,
		},
		models.EstimatedLifecycleCost{
			BusinessCaseID: *id,
			Solution:       models.LifecycleCostSolutionPREFERRED,
			Year:           models.LifecycleCostYear4,
			Phase:          &om,
			Cost:           &cost,
		},
		models.EstimatedLifecycleCost{
			BusinessCaseID: *id,
			Solution:       models.LifecycleCostSolutionPREFERRED,
			Year:           models.LifecycleCostYear5,
			Phase:          &om,
			Cost:           &cost,
		},
		models.EstimatedLifecycleCost{
			BusinessCaseID: *id,
			Solution:       models.LifecycleCostSolutionA,
			Year:           models.LifecycleCostYear1,
			Phase:          &dev,
			Cost:           &cost,
		},
		models.EstimatedLifecycleCost{
			BusinessCaseID: *id,
			Solution:       models.LifecycleCostSolutionA,
			Year:           models.LifecycleCostYear1,
			Phase:          &om,
			Cost:           &cost,
		},
		models.EstimatedLifecycleCost{
			BusinessCaseID: *id,
			Solution:       models.LifecycleCostSolutionA,
			Year:           models.LifecycleCostYear2,
			Phase:          &om,
			Cost:           &cost,
		},
		models.EstimatedLifecycleCost{
			BusinessCaseID: *id,
			Solution:       models.LifecycleCostSolutionA,
			Year:           models.LifecycleCostYear3,
			Phase:          &om,
			Cost:           &cost,
		},
		models.EstimatedLifecycleCost{
			BusinessCaseID: *id,
			Solution:       models.LifecycleCostSolutionA,
			Year:           models.LifecycleCostYear4,
			Phase:          &om,
			Cost:           &cost,
		},
		models.EstimatedLifecycleCost{
			BusinessCaseID: *id,
			Solution:       models.LifecycleCostSolutionA,
			Year:           models.LifecycleCostYear5,
			Phase:          &om,
			Cost:           &cost,
		},
		models.EstimatedLifecycleCost{
			BusinessCaseID: *id,
			Solution:       models.LifecycleCostSolutionB,
			Year:           models.LifecycleCostYear1,
			Phase:          &dev,
			Cost:           &cost,
		},
		models.EstimatedLifecycleCost{
			BusinessCaseID: *id,
			Solution:       models.LifecycleCostSolutionB,
			Year:           models.LifecycleCostYear1,
			Phase:          &om,
			Cost:           &cost,
		},
		models.EstimatedLifecycleCost{
			BusinessCaseID: *id,
			Solution:       models.LifecycleCostSolutionB,
			Year:           models.LifecycleCostYear2,
			Phase:          &om,
			Cost:           &cost,
		},
		models.EstimatedLifecycleCost{
			BusinessCaseID: *id,
			Solution:       models.LifecycleCostSolutionB,
			Year:           models.LifecycleCostYear3,
			Phase:          &om,
			Cost:           &cost,
		},
		models.EstimatedLifecycleCost{
			BusinessCaseID: *id,
			Solution:       models.LifecycleCostSolutionB,
			Year:           models.LifecycleCostYear4,
			Phase:          &om,
			Cost:           &cost,
		},
		models.EstimatedLifecycleCost{
			BusinessCaseID: *id,
			Solution:       models.LifecycleCostSolutionB,
			Year:           models.LifecycleCostYear5,
			Phase:          &om,
			Cost:           &cost,
		},
	}
}

// NewBusinessCase allows us to generate a Business Case for tests
func NewBusinessCase(systemIntakeID uuid.UUID) models.BusinessCaseWithCosts {
	now := time.Now().UTC()
	year2 := models.LifecycleCostYear2
	bc := models.BusinessCase{
		ID:                                  uuid.New(),
		EUAUserID:                           RandomEUAID(),
		SystemIntakeID:                      systemIntakeID,
		ProjectName:                         null.StringFrom("Test Project name"),
		ProjectAcronym:                      null.StringFrom("Test Project Acronym"),
		Status:                              models.BusinessCaseStatusOPEN,
		Requester:                           null.StringFrom("Test Requester"),
		RequesterPhoneNumber:                null.StringFrom("6666666666"),
		BusinessOwner:                       null.StringFrom("Test Business Owner"),
		BusinessNeed:                        null.StringFrom("Test Business Need"),
		CollaborationNeeded:                 null.StringFrom("Test Collaboration Needed"),
		CurrentSolutionSummary:              null.StringFrom("Test Current Solution Summary"),
		CMSBenefit:                          null.StringFrom("Test CMS Benefit"),
		PriorityAlignment:                   null.StringFrom("Test Priority Alignment"),
		SuccessIndicators:                   null.StringFrom("Test Success Indicators"),
		ResponseToGRTFeedback:               null.StringFrom("Test Response to GRT Feedback"),
		PreferredTitle:                      null.StringFrom("Test Preferred Title"),
		PreferredSummary:                    null.StringFrom("Test Preferred Summary"),
		PreferredAcquisitionApproach:        null.StringFrom("Test Preferred Acquisition Approach"),
		PreferredTargetContractAwardDate:    &now,
		PreferredTargetCompletionDate:       &now,
		PreferredZeroTrustAlignment:         null.StringFrom("Test Preferred Zero Trust Alignment"),
		PreferredHostingType:                null.StringFrom("none"),
		PreferredHasUI:                      null.StringFrom("YES"),
		PreferredPros:                       null.StringFrom("Test Preferred Pros"),
		PreferredCons:                       null.StringFrom("Test Preferred Cons"),
		PreferredCostSavings:                null.StringFrom("Test Preferred Cost Savings"),
		PreferredWorkforceTrainingReqs:      null.StringFrom("Test Preferred Workforce Training Reqs"),
		AlternativeATitle:                   null.StringFrom("Test Alternative A Title"),
		AlternativeASummary:                 null.StringFrom("Test Alternative A Summary"),
		AlternativeAAcquisitionApproach:     null.StringFrom("Test Alternative A Acquisition Approach"),
		AlternativeATargetContractAwardDate: &now,
		AlternativeATargetCompletionDate:    &now,
		AlternativeAZeroTrustAlignment:      null.StringFrom("Test Alternative A Zero Trust Alignment"),
		AlternativeAHostingType:             null.StringFrom("none"),
		AlternativeAHasUI:                   null.StringFrom("YES"),
		AlternativeAPros:                    null.StringFrom("Test Alternative A Pros"),
		AlternativeACons:                    null.StringFrom("Test Alternative A Cons"),
		AlternativeACostSavings:             null.StringFrom("Test Alternative A Cost Savings"),
		AlternativeAWorkforceTrainingReqs:   null.StringFrom("Test Alternative A Workforce Training Reqs"),
		AlternativeBTitle:                   null.StringFrom("Test Alternative B Title"),
		AlternativeBSummary:                 null.StringFrom("Test Alternative B Summary"),
		AlternativeBAcquisitionApproach:     null.StringFrom("Test Alternative B Acquisition Approach"),
		AlternativeBTargetContractAwardDate: &now,
		AlternativeBTargetCompletionDate:    &now,
		AlternativeBZeroTrustAlignment:      null.StringFrom("Test Alternative B Zero Trust Alignment"),
		AlternativeBHostingType:             null.StringFrom("none"),
		AlternativeBHasUI:                   null.StringFrom("YES"),
		AlternativeBPros:                    null.StringFrom("Test Alternative B Pros"),
		AlternativeBCons:                    null.StringFrom("Test Alternative B Cons"),
		AlternativeBCostSavings:             null.StringFrom("Test Alternative B Cost Savings"),
		AlternativeBWorkforceTrainingReqs:   null.StringFrom("Test Alternative B Workforce Training Reqs"),
		CreatedAt:                           &now,
		UpdatedAt:                           &now,
	}
	return models.BusinessCaseWithCosts{
		BusinessCase: bc,
		LifecycleCostLines: models.EstimatedLifecycleCosts{
			NewEstimatedLifecycleCost(
				EstimatedLifecycleCostOptions{Year: &year2},
			),
			NewEstimatedLifecycleCost(EstimatedLifecycleCostOptions{}),
		},
	}
}
