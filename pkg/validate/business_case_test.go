package validate

import (
	"fmt"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func (s ValidateTestSuite) TestCheckUniqLifecycleCosts() {
	s.Run("returns empty strings when the lifecycle costs are valid", func() {
		preferred := models.LifecycleCostSolutionPREFERRED
		elc1 := testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{})
		elc2 := testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{
			Solution: &preferred,
		})

		costs := models.EstimatedLifecycleCosts{
			elc1,
			elc2,
		}
		k, _ := checkUniqLifecycleCosts(costs)
		s.Equal("", k)
	})
	s.Run("returns validation when the lifecycle costs are invalid", func() {
		elc1 := testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{})
		elc2 := testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{})

		costs := models.EstimatedLifecycleCosts{
			elc1,
			elc2,
		}
		k, v := checkUniqLifecycleCosts(costs)
		s.Equal("LifecycleCostPhase", k)
		s.Equal("cannot have multiple costs for the same phase, solution, and year", v)
	})
}

func (s ValidateTestSuite) TestCheckSystemIntakeSubmitted() {
	s.Run("returns empty strings when intake is submitted", func() {
		submittedIntake := testhelpers.NewSystemIntake()
		submittedIntake.Status = models.SystemIntakeStatusSUBMITTED
		k, _ := checkSystemIntakeSubmitted(&submittedIntake)
		s.Equal("", k)
	})
	s.Run("returns false when the lifecycle costs are invalid", func() {
		draftIntake := testhelpers.NewSystemIntake()
		k, v := checkSystemIntakeSubmitted(&draftIntake)
		s.Equal("SystemIntake", k)
		s.Equal("must have already been submitted", v)
	})
}

func (s ValidateTestSuite) TestBusinessCaseForSubmission() {
	s.Run("golden path", func() {
		submittedIntake := testhelpers.NewSystemIntake()
		submittedIntake.Status = models.SystemIntakeStatusSUBMITTED
		businessCase := models.BusinessCase{
			SystemIntakeID:     submittedIntake.ID,
			LifecycleCostLines: nil,
		}
		err := BusinessCaseForCreation(&businessCase, &submittedIntake)
		s.NoError(err)
	})
	s.Run("returns validation error when business case fails validation", func() {
		submittedIntake := testhelpers.NewSystemIntake()
		elc1 := testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{})
		elc2 := testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{})
		businessCase := models.BusinessCase{
			SystemIntakeID: submittedIntake.ID,
			LifecycleCostLines: models.EstimatedLifecycleCosts{
				elc1,
				elc2,
			},
		}
		err := BusinessCaseForCreation(&businessCase, &submittedIntake)
		s.Error(err)
		s.IsType(&apperrors.ValidationError{}, err)
		expectedErrMessage := fmt.Sprintf("Could not validate *models.BusinessCase : " +
			"{\"LifecycleCostPhase\":\"cannot have multiple costs for the same phase, solution, and year\"," +
			"\"SystemIntake\":\"must have already been submitted\"}",
		)
		s.Equal(expectedErrMessage, err.Error())
	})
}
