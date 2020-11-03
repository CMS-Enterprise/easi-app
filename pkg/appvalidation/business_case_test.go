package appvalidation

import (
	"fmt"
	"time"

	"github.com/google/uuid"
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
		submittedIntake.Status = models.SystemIntakeStatusINTAKESUBMITTED
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
		submittedIntake.Status = models.SystemIntakeStatusINTAKESUBMITTED
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
		id := uuid.New()

		businessCase := models.BusinessCase{
			ID: id,
			LifecycleCostLines: models.EstimatedLifecycleCosts{
				elc1,
				elc2,
			},
		}
		err := BusinessCaseForUpdate(&businessCase)
		s.Error(err)
		s.IsType(&apperrors.ValidationError{}, err)
		expectedErrMessage := fmt.Sprintf("Could not validate *models.BusinessCase " + id.String() +
			": {\"LifecycleCostPhase\":\"cannot have multiple costs for the same phase, solution, and year\"}",
		)
		s.Equal(expectedErrMessage, err.Error())
	})
}

func (s AppValidateTestSuite) TestValidateAllRequiredLifecycleCosts() {
	businessCase := testhelpers.NewBusinessCase()
	dev := models.LifecycleCostPhaseDEVELOPMENT
	cost := 300

	s.Run("golden path", func() {
		businessCase.LifecycleCostLines = testhelpers.NewValidLifecycleCosts(&businessCase.ID)
		result := validateAllRequiredLifecycleCosts(&businessCase)
		s.Equal(0, len(result))
	})

	s.Run("returns validations when there are missing years", func() {
		businessCase.LifecycleCostLines = models.EstimatedLifecycleCosts{}
		result := validateAllRequiredLifecycleCosts(&businessCase)
		s.Equal("years 1, 2, 3, 4, 5 are required", result["asIsSolution"])
		s.Equal("years 1, 2, 3, 4, 5 are required", result["preferredSolution"])
		s.Equal("years 1, 2, 3, 4, 5 are required", result["alternativeASolution"])
		s.Equal("years 1, 2, 3, 4, 5 are required", result["alternativeBSolution"])
		s.Equal(4, len(result))
	})

	s.Run("returns validations only for the years that are missing", func() {
		businessCase.LifecycleCostLines = models.EstimatedLifecycleCosts{
			models.EstimatedLifecycleCost{
				Solution: models.LifecycleCostSolutionASIS,
				Phase:    &dev,
				Year:     models.LifecycleCostYear1,
				Cost:     &cost,
			},
			models.EstimatedLifecycleCost{
				Solution: models.LifecycleCostSolutionASIS,
				Phase:    &dev,
				Year:     models.LifecycleCostYear2,
				Cost:     &cost,
			},
			models.EstimatedLifecycleCost{
				Solution: models.LifecycleCostSolutionASIS,
				Phase:    &dev,
				Year:     models.LifecycleCostYear3,
				Cost:     &cost,
			},
			models.EstimatedLifecycleCost{
				Solution: models.LifecycleCostSolutionASIS,
				Phase:    &dev,
				Year:     models.LifecycleCostYear4,
				Cost:     &cost,
			},
		}
		result := validateAllRequiredLifecycleCosts(&businessCase)
		s.Equal("year 5 is required", result["asIsSolution"])
	})

	s.Run("when a cost is missing", func() {
		businessCase.LifecycleCostLines = models.EstimatedLifecycleCosts{
			models.EstimatedLifecycleCost{
				Solution: models.LifecycleCostSolutionPREFERRED,
				Phase:    &dev,
				Year:     models.LifecycleCostYear1,
				Cost:     nil,
			},
		}
		result := validateAllRequiredLifecycleCosts(&businessCase)
		s.Equal("years 1, 2, 3, 4, 5 are required", result["asIsSolution"])
		s.Equal("years 1, 2, 3, 4, 5 are required", result["preferredSolution"])
		s.Equal("years 1, 2, 3, 4, 5 are required", result["alternativeASolution"])
		s.Equal("years 1, 2, 3, 4, 5 are required", result["alternativeBSolution"])
		s.Equal("requires a cost", result[string(models.LifecycleCostSolutionPREFERRED)+string(models.LifecycleCostYear1)+string(dev)])
		s.Equal(5, len(result))
	})

	s.Run("when a phase is missing", func() {
		businessCase.LifecycleCostLines = models.EstimatedLifecycleCosts{
			models.EstimatedLifecycleCost{
				Solution: models.LifecycleCostSolutionPREFERRED,
				Phase:    nil,
				Year:     models.LifecycleCostYear1,
				Cost:     &cost,
			},
		}
		result := validateAllRequiredLifecycleCosts(&businessCase)
		s.Equal("years 1, 2, 3, 4, 5 are required", result["asIsSolution"])
		s.Equal("years 1, 2, 3, 4, 5 are required", result["preferredSolution"])
		s.Equal("years 1, 2, 3, 4, 5 are required", result["alternativeASolution"])
		s.Equal("years 1, 2, 3, 4, 5 are required", result["alternativeBSolution"])
		s.Equal("requires a phase", result[string(models.LifecycleCostSolutionPREFERRED)+string(models.LifecycleCostYear1)])
		s.Equal(5, len(result))
	})

	s.Run("when alt b costs exist but alt b is not required", func() {
		altB := models.LifecycleCostSolutionB
		businessCase := models.BusinessCase{
			LifecycleCostLines: models.EstimatedLifecycleCosts{
				testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{Solution: &altB}),
			},
		}
		result := validateAllRequiredLifecycleCosts(&businessCase)
		s.Equal("is required to be empty", result["alternativeBSolution"])
	})
}

func (s AppValidateTestSuite) TestBusinessCaseForSubmit() {
	s.Run("golden path", func() {
		businessCase := testhelpers.NewBusinessCase()
		businessCase.LifecycleCostLines = testhelpers.NewValidLifecycleCosts(&businessCase.ID)
		submittedTime := time.Now()
		businessCase.LastSubmittedAt = &submittedTime
		err := BusinessCaseForSubmit(&businessCase)
		s.NoError(err)
	})

	s.Run("returns validations when submitted", func() {
		businessCase := models.BusinessCase{}
		businessCase.Status = models.BusinessCaseStatusSUBMITTED
		cost := 300
		businessCase.LifecycleCostLines = models.EstimatedLifecycleCosts{
			models.EstimatedLifecycleCost{
				Solution: models.LifecycleCostSolutionPREFERRED,
				Phase:    nil,
				Year:     models.LifecycleCostYear1,
				Cost:     &cost,
			},
		}
		expectedError := `Could not validate *models.BusinessCase ` +
			`00000000-0000-0000-0000-000000000000: ` +
			`{"AlternativeAAcquisitionApproach":"is required",` +
			`"AlternativeACons":"is required",` +
			`"AlternativeACostSavings":"is required",` +
			`"AlternativeAHasUI":"is required",` +
			`"AlternativeAHostingType":"is required",` +
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
			`"Preferred1":"requires a phase",` +
			`"PreferredAcquisitionApproach":"is required",` +
			`"PreferredCons":"is required",` +
			`"PreferredCostSavings":"is required",` +
			`"PreferredHasUI":"is required",` +
			`"PreferredHostingType":"is required",` +
			`"PreferredPros":"is required",` +
			`"PreferredSummary":"is required",` +
			`"PreferredTitle":"is required",` +
			`"PriorityAlignment":"is required",` +
			`"ProjectName":"is required",` +
			`"Requester":"is required",` +
			`"RequesterPhoneNumber":"is required",` +
			`"Status":"cannot be SUBMITTED",` +
			`"SuccessIndicators":"is required",` +
			`"SystemIntakeID":"is required",` +
			`"alternativeASolution":"years 1, 2, 3, 4, 5 are required",` +
			`"asIsSolution":"years 1, 2, 3, 4, 5 are required",` +
			`"preferredSolution":"years 1, 2, 3, 4, 5 are required"}`
		err := BusinessCaseForSubmit(&businessCase)

		s.IsType(err, &apperrors.ValidationError{})
		s.Equal(expectedError, err.Error())
	})

	s.Run("returns validations when optional alternative", func() {
		existingBusinessCase := testhelpers.NewBusinessCase()
		existingBusinessCase.Status = models.BusinessCaseStatusDRAFT
		businessCase := testhelpers.NewBusinessCase()
		businessCase.Status = models.BusinessCaseStatusSUBMITTED
		businessCase.LifecycleCostLines = testhelpers.NewValidLifecycleCosts(&businessCase.ID)
		submittedAt := time.Now()
		businessCase.LastSubmittedAt = &submittedAt
		businessCase.AlternativeBTitle = null.NewString("B Title", true)
		businessCase.AlternativeBSummary = null.NewString("", false)
		businessCase.AlternativeBHostingType = null.NewString("", false)
		businessCase.AlternativeBHasUI = null.NewString("", false)
		businessCase.AlternativeBPros = null.NewString("", false)
		businessCase.AlternativeBCons = null.NewString("", false)
		businessCase.AlternativeBAcquisitionApproach = null.NewString("", false)
		businessCase.AlternativeBCostSavings = null.NewString("", false)
		expectedError := `Could not validate *models.BusinessCase ` +
			fmt.Sprintf("%s: ", businessCase.ID) +
			`{"AlternativeBAcquisitionApproach":"is required",` +
			`"AlternativeBCons":"is required",` +
			`"AlternativeBCostSavings":"is required",` +
			`"AlternativeBHasUI":"is required",` +
			`"AlternativeBHostingType":"is required",` +
			`"AlternativeBPros":"is required",` +
			`"AlternativeBSummary":"is required"}`

		err := BusinessCaseForSubmit(&businessCase)

		s.Error(err)
		s.Equal(expectedError, err.Error())
	})
}
