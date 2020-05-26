package appvalidation

import (
	"fmt"

	"github.com/guregu/null"

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

func (s AppValidateTestSuite) TestBusinessCaseForCreation() {
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

func (s AppValidateTestSuite) TestBusinessCaseForSubmit() {
	s.Run("returns validations when submitted", func() {
		existingBusinessCase := models.BusinessCase{}
		existingBusinessCase.Status = models.BusinessCaseStatusREVIEWED
		businessCase := models.BusinessCase{}
		businessCase.Status = models.BusinessCaseStatusSUBMITTED
		expectedError := `Could not validate *models.BusinessCase ` +
			`00000000-0000-0000-0000-000000000000: ` +
			`{"AlternativeAAcquisitionApproach":"is required",` +
			`"AlternativeACons":"is required",` +
			`"AlternativeACostSavings":"is required",` +
			`"AlternativeAPros":"is required",` +
			`"AlternativeASummary":"is required",` +
			`"AlternativeATitle":"is required",` +
			`"AsIsCons":"is required",` +
			`"AsIsCostSavings":"is required",` +
			`"AsIsPros":"is required",` +
			`"AsIsSummary":"is required",` +
			`"AsIsTitle":"is required",` +
			`"BusinessNeed":"is required",` +
			`"BusinessOwner":"is required",` +
			`"CMSBenefit":"is required",` +
			`"EUAUserID":"is required",` +
			`"ID":"is required",` +
			`"PreferredAcquisitionApproach":"is required",` +
			`"PreferredCons":"is required",` +
			`"PreferredCostSavings":"is required",` +
			`"PreferredPros":"is required",` +
			`"PreferredSummary":"is required",` +
			`"PreferredTitle":"is required",` +
			`"PriorityAlignment":"is required",` +
			`"ProjectName":"is required",` +
			`"Requester":"is required",` +
			`"RequesterPhoneNumber":"is required",` +
			`"Status":"Cannot be SUBMITTED",` +
			`"SuccessIndicators":"is required",` +
			`"SystemIntakeID":"is required"}`
		err := BusinessCaseForSubmit(&businessCase, &existingBusinessCase)

		s.IsType(err, &apperrors.ValidationError{})
		s.Equal(expectedError, err.Error())
	})

	s.Run("returns validations when optional alternative", func() {
		existingBusinessCase := testhelpers.NewBusinessCase()
		existingBusinessCase.Status = models.BusinessCaseStatusDRAFT
		businessCase := testhelpers.NewBusinessCase()
		businessCase.Status = models.BusinessCaseStatusSUBMITTED
		businessCase.AlternativeBTitle = null.NewString("B Title", true)
		businessCase.AlternativeBSummary = null.NewString("", false)
		businessCase.AlternativeBPros = null.NewString("", false)
		businessCase.AlternativeBCons = null.NewString("", false)
		businessCase.AlternativeBAcquisitionApproach = null.NewString("", false)
		businessCase.AlternativeBCostSavings = null.NewString("", false)
		expectedError := `Could not validate *models.BusinessCase ` +
			fmt.Sprintf("%s: ", businessCase.ID) +
			`{"AlternativeBAcquisitionApproach":"is required",` +
			`"AlternativeBCons":"is required",` +
			`"AlternativeBCostSavings":"is required",` +
			`"AlternativeBPros":"is required",` +
			`"AlternativeBSummary":"is required"}`

		err := BusinessCaseForSubmit(&businessCase, &existingBusinessCase)

		s.Error(err)
		s.Equal(expectedError, err.Error())
	})
}
