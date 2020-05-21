package testhelpers

import (
	"github.com/google/uuid"

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
	elc := models.EstimatedLifecycleCost{
		ID:             uuid.New(),
		BusinessCaseID: uuid.New(),
		Solution:       models.LifecycleCostSolutionASIS,
		Phase:          models.LifecycleCostPhaseDEVELOPMENT,
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
	if opts.BusinessCaseID != nil {
		elc.BusinessCaseID = *opts.BusinessCaseID
	}
	return elc
}
