package appvalidation

import (
	"fmt"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func (s AppValidateTestSuite) TestCheckUniqLifecycleCosts() {
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

func (s AppValidateTestSuite) TestCheckSystemIntakeSubmitted() {
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

func (s AppValidateTestSuite) TestBusinessCaseForSubmission() {
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
		intake := testhelpers.NewSystemIntake()
		businessCase := models.BusinessCase{
			SystemIntakeID: intake.ID,
		}
		err := BusinessCaseForCreation(&businessCase, &intake)
		s.Error(err)
		s.IsType(&apperrors.ValidationError{}, err)
		expectedErrMessage := fmt.Sprintf("Could not validate *models.BusinessCase : " +
			"{\"SystemIntake\":\"must have already been submitted\"}",
		)
		s.Equal(expectedErrMessage, err.Error())
	})

	// Uncomment below when UI has changed for unique lifecycle costs by
	// replacing the previous test with this one.
	//s.Run("returns validation error when business case fails validation", func() {
	//	submittedIntake := testhelpers.NewSystemIntake()
	//	elc1 := testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{})
	//	elc2 := testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{})
	//	businessCase := models.BusinessCase{
	//		SystemIntakeID: submittedIntake.ID,
	//		LifecycleCostLines: models.EstimatedLifecycleCosts{
	//			elc1,
	//			elc2,
	//		},
	//	}
	//	err := BusinessCaseForCreation(&businessCase, &submittedIntake)
	//	s.Error(err)
	//	s.IsType(&apperrors.ValidationError{}, err)
	//	expectedErrMessage := fmt.Sprintf("Could not validate *models.BusinessCase : " +
	//		"{\"LifecycleCostPhase\":\"cannot have multiple costs for the same phase, solution, and year\"," +
	//		"\"SystemIntake\":\"must have already been submitted\"}",
	//	)
	//	s.Equal(expectedErrMessage, err.Error())
	//})
}

func (s AppValidateTestSuite) TestBusinessCaseForUpdate() {
	elc1 := testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{})

	s.Run("golden path", func() {
		businessCase := models.BusinessCase{
			LifecycleCostLines: models.EstimatedLifecycleCosts{elc1},
		}
		err := BusinessCaseForUpdate(&businessCase)
		s.NoError(err)
	})

	s.Run("returns validation error when business case fails validation", func() {
		elc2 := testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{})

		businessCase := models.BusinessCase{
			LifecycleCostLines: models.EstimatedLifecycleCosts{
				elc1,
				elc2,
			},
		}
		err := BusinessCaseForUpdate(&businessCase)
		s.Error(err)
		s.IsType(&apperrors.ValidationError{}, err)
		expectedErrMessage := fmt.Sprintf("Could not validate *models.BusinessCase : " +
			"{\"LifecycleCostPhase\":\"cannot have multiple costs for the same phase, solution, and year\"}",
		)
		s.Equal(expectedErrMessage, err.Error())
	})
}
