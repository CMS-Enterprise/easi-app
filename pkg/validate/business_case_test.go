package validate

import (
	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func (s ValidateTestSuite) TestValidateLifecycleCosts() {
	s.Run("returns true when the lifecycle costs are valid", func() {
		bizCaseID := uuid.New()
		//opt1 := testhelpers.EstimatedLifecycleCostOptions{}
		preferred := models.LifecycleCostSolutionPREFERRED
		elc1 := testhelpers.NewEstimatedLifecycleCost(bizCaseID, testhelpers.EstimatedLifecycleCostOptions{})
		elc2 := testhelpers.NewEstimatedLifecycleCost(bizCaseID, testhelpers.EstimatedLifecycleCostOptions{
			Solution: &preferred,
		})

		costs := models.EstimatedLifecycleCosts{
			elc1,
			elc2,
		}
		s.True(CheckUniqLifecycleCosts(costs))
	})
	s.Run("returns false when the lifecycle costs are invalid", func() {
		bizCaseID := uuid.New()
		elc1 := testhelpers.NewEstimatedLifecycleCost(bizCaseID, testhelpers.EstimatedLifecycleCostOptions{})
		elc2 := testhelpers.NewEstimatedLifecycleCost(bizCaseID, testhelpers.EstimatedLifecycleCostOptions{})

		costs := models.EstimatedLifecycleCosts{
			elc1,
			elc2,
		}
		s.False(CheckUniqLifecycleCosts(costs))
	})
}
