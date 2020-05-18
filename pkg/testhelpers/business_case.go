package testhelpers

import (
	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
)

type EstimatedLifecycleCostOptions struct {
	Solution *models.LifecycleCostSolution
	Phase    *models.LifecycleCostPhase
	Year     *models.LifecycleCostYear
	Cost     *int
}
// New EstimatedLifecycleCost helps generate a new lifecycle cost for a given business case
func NewEstimatedLifecycleCost(businessCaseID uuid.UUID, opts EstimatedLifecycleCostOptions) models.EstimatedLifecycleCost {
	elc := models.EstimatedLifecycleCost{
		ID:             uuid.New(),
		BusinessCaseID: businessCaseID,
		Solution:       models.LifecycleCostSolutionASIS,
		Phase:          models.LifecycleCostPhaseINITIATE,
		Year:           models.LifecycleCostYear1,
		Cost:           100,
	}
	if opts.Solution != nil {
		elc.Solution = *opts.Solution
	}
	if opts.Phase != nil {
		elc.Phase = *opts.Phase
	}
	if opts.Year != nil {
		elc.Year = *opts.Year
	}
	if opts.Cost != nil {
		elc.Cost = *opts.Cost
	}
	return elc
}