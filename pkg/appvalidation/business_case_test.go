package appvalidation

import (
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/testhelpers"
)

func (s *AppValidateTestSuite) TestCheckUniqLifecycleCosts() {
	s.Run("returns empty strings when the lifecycle costs are valid", func() {
		preferred := models.LifecycleCostSolutionPREFERRED
		elc1 := testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{
			Solution: &preferred,
		})

		costs := models.EstimatedLifecycleCosts{
			elc1,
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

func (s *AppValidateTestSuite) TestCheckSystemIntakeSubmitted() {
	s.Run("returns empty strings when intake is not in initial form step", func() {
		submittedIntake := testhelpers.NewSystemIntake()
		submittedIntake.Step = models.SystemIntakeStepDRAFTBIZCASE
		k, _ := checkSystemIntakeSubmitted(&submittedIntake)
		s.Equal("", k)
	})

	s.Run("returns strings when intake is in initial form step", func() {
		submittedIntake := testhelpers.NewSystemIntake()
		submittedIntake.Step = models.SystemIntakeStepINITIALFORM
		k, v := checkSystemIntakeSubmitted(&submittedIntake)
		s.Equal("SystemIntake", k)
		s.Equal("must have already been submitted", v)
	})

	s.Run("returns false when the lifecycle costs are invalid", func() {
		draftIntake := testhelpers.NewSystemIntake()
		k, v := checkSystemIntakeSubmitted(&draftIntake)
		s.Equal("SystemIntake", k)
		s.Equal("must have already been submitted", v)
	})
}

func (s *AppValidateTestSuite) TestBusinessCaseForCreation() {
	s.Run("golden path", func() {
		submittedIntake := testhelpers.NewSystemIntake()
		now := time.Now()
		submittedIntake.SubmittedAt = &now
		submittedIntake.RequestFormState = models.SIRFSSubmitted
		submittedIntake.Step = models.SystemIntakeStepDRAFTBIZCASE

		businessCase := models.BusinessCaseWithCosts{
			BusinessCase: models.BusinessCase{
				SystemIntakeID: submittedIntake.ID,
			},
			LifecycleCostLines: nil,
		}
		err := BusinessCaseForCreation(&businessCase, &submittedIntake)
		s.NoError(err)
	})

	s.Run("returns validation error when Business Case fails validation", func() {
		intake := testhelpers.NewSystemIntake()
		businessCase := models.BusinessCaseWithCosts{
			BusinessCase: models.BusinessCase{
				SystemIntakeID: intake.ID,
			},
		}
		err := BusinessCaseForCreation(&businessCase, &intake)
		s.Error(err)
		s.IsType(&apperrors.ValidationError{}, err)
		expectedErrMessage := fmt.Sprintf("Could not validate *models.BusinessCaseWithCosts : " +
			"{\"SystemIntake\":\"must have already been submitted\"}",
		)
		s.Equal(expectedErrMessage, err.Error())
	})

	// Uncomment below when UI has changed for unique lifecycle costs by
	// replacing the previous test with this one.
	//s.Run("returns validation error when Business Case fails validation", func() {
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

func (s *AppValidateTestSuite) TestBusinessCaseForUpdate() {
	elc1 := testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{})

	s.Run("golden path", func() {
		businessCase := models.BusinessCaseWithCosts{
			LifecycleCostLines: models.EstimatedLifecycleCosts{elc1},
		}
		err := BusinessCaseForUpdate(&businessCase)
		s.NoError(err)
	})

	s.Run("returns validation error when Business Case fails validation", func() {
		elc2 := testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{})
		id := uuid.New()

		businessCase := models.BusinessCaseWithCosts{
			BusinessCase: models.BusinessCase{
				ID: id,
			},
			LifecycleCostLines: models.EstimatedLifecycleCosts{
				elc1,
				elc2,
			},
		}
		err := BusinessCaseForUpdate(&businessCase)
		s.Error(err)
		s.IsType(&apperrors.ValidationError{}, err)
		expectedErrMessage := fmt.Sprintf(`Could not validate *models.BusinessCaseWithCosts %s: {"LifecycleCostPhase":"cannot have multiple costs for the same phase, solution, and year"}`, id.String())
		s.Equal(expectedErrMessage, err.Error())
	})
}

func (s *AppValidateTestSuite) TestValidateAllRequiredLifecycleCosts() {
	intake := testhelpers.NewSystemIntake()
	businessCase := testhelpers.NewBusinessCase(intake.ID)
	dev := models.LifecycleCostPhaseDEVELOPMENT
	cost := int64(300)

	s.Run("golden path", func() {
		businessCase.LifecycleCostLines = testhelpers.NewValidLifecycleCosts(&businessCase.ID)
		result := validateAllRequiredLifecycleCosts(&businessCase)
		s.Equal(0, len(result))
	})

	s.Run("returns validations when there are missing years", func() {
		businessCase.LifecycleCostLines = models.EstimatedLifecycleCosts{}
		result := validateAllRequiredLifecycleCosts(&businessCase)
		s.Equal("years 1, 2, 3, 4, 5 are required", result["preferredSolution"])
		s.Equal("years 1, 2, 3, 4, 5 are required", result["alternativeASolution"])
		s.Equal("years 1, 2, 3, 4, 5 are required", result["alternativeBSolution"])
		s.Equal(3, len(result))
	})

	s.Run("returns validations only for the years that are missing", func() {
		businessCase.LifecycleCostLines = models.EstimatedLifecycleCosts{
			models.EstimatedLifecycleCost{
				Solution: models.LifecycleCostSolutionPREFERRED,
				Phase:    &dev,
				Year:     models.LifecycleCostYear1,
				Cost:     &cost,
			},
			models.EstimatedLifecycleCost{
				Solution: models.LifecycleCostSolutionPREFERRED,
				Phase:    &dev,
				Year:     models.LifecycleCostYear2,
				Cost:     &cost,
			},
			models.EstimatedLifecycleCost{
				Solution: models.LifecycleCostSolutionPREFERRED,
				Phase:    &dev,
				Year:     models.LifecycleCostYear3,
				Cost:     &cost,
			},
			models.EstimatedLifecycleCost{
				Solution: models.LifecycleCostSolutionPREFERRED,
				Phase:    &dev,
				Year:     models.LifecycleCostYear4,
				Cost:     &cost,
			},
		}
		result := validateAllRequiredLifecycleCosts(&businessCase)
		s.Equal("year 5 is required", result["preferredSolution"])
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
		s.Equal("years 1, 2, 3, 4, 5 are required", result["preferredSolution"])
		s.Equal("years 1, 2, 3, 4, 5 are required", result["alternativeASolution"])
		s.Equal("years 1, 2, 3, 4, 5 are required", result["alternativeBSolution"])
		s.Equal("requires a cost", result[string(models.LifecycleCostSolutionPREFERRED)+string(models.LifecycleCostYear1)+string(dev)])
		s.Equal(4, len(result))
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
		s.Equal("years 1, 2, 3, 4, 5 are required", result["preferredSolution"])
		s.Equal("years 1, 2, 3, 4, 5 are required", result["alternativeASolution"])
		s.Equal("years 1, 2, 3, 4, 5 are required", result["alternativeBSolution"])
		s.Equal("requires a phase", result[string(models.LifecycleCostSolutionPREFERRED)+string(models.LifecycleCostYear1)])
		s.Equal(4, len(result))
	})

	s.Run("when alt b costs exist but alt b is not required", func() {
		altB := models.LifecycleCostSolutionB
		businessCase := models.BusinessCaseWithCosts{
			BusinessCase: models.BusinessCase{},
			LifecycleCostLines: models.EstimatedLifecycleCosts{
				testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{Solution: &altB}),
			},
		}
		result := validateAllRequiredLifecycleCosts(&businessCase)
		s.Equal("is required to be empty", result["alternativeBSolution"])
	})
}

func (s *AppValidateTestSuite) TestBusinessCaseForSubmit() {
	s.Run("golden path", func() {
		businessCase := testhelpers.NewBusinessCase(uuid.New())
		businessCase.Status = models.BusinessCaseStatusOPEN
		businessCase.LifecycleCostLines = testhelpers.NewValidLifecycleCosts(&businessCase.ID)
		err := BusinessCaseForSubmit(&businessCase)
		s.NoError(err)
	})

	s.Run("returns validations when submitted", func() {
		businessCase := models.BusinessCaseWithCosts{
			BusinessCase: models.BusinessCase{},
		}
		cost := int64(300)
		businessCase.LifecycleCostLines = models.EstimatedLifecycleCosts{
			models.EstimatedLifecycleCost{
				Solution: models.LifecycleCostSolutionPREFERRED,
				Phase:    nil,
				Year:     models.LifecycleCostYear1,
				Cost:     &cost,
			},
		}
		expectedError := `Could not validate *models.BusinessCaseWithCosts ` +
			`00000000-0000-0000-0000-000000000000: ` +
			`{"BusinessNeed":"is required",` +
			`"BusinessOwner":"is required",` +
			`"CMSBenefit":"is required",` +
			`"CurrentSolutionSummary":"is required",` +
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
			`"Status":"must be OPEN",` +
			`"SuccessIndicators":"is required",` +
			`"SystemIntakeID":"is required",` +
			`"preferredSolution":"years 1, 2, 3, 4, 5 are required"}`
		err := BusinessCaseForSubmit(&businessCase)

		s.IsType(err, &apperrors.ValidationError{})
		s.Equal(expectedError, err.Error())
	})

	s.Run("returns validations when optional alternative", func() {
		businessCase := testhelpers.NewBusinessCase(uuid.New())
		businessCase.Status = models.BusinessCaseStatusOPEN
		businessCase.LifecycleCostLines = testhelpers.NewValidLifecycleCosts(&businessCase.ID)
		businessCase.AlternativeBTitle = null.NewString("B Title", true)
		businessCase.AlternativeBSummary = null.NewString("", false)
		businessCase.AlternativeBHostingType = null.NewString("", false)
		businessCase.AlternativeBHasUI = null.NewString("", false)
		businessCase.AlternativeBPros = null.NewString("", false)
		businessCase.AlternativeBCons = null.NewString("", false)
		businessCase.AlternativeBAcquisitionApproach = null.NewString("", false)
		businessCase.AlternativeBCostSavings = null.NewString("", false)
		expectedError := `Could not validate *models.BusinessCaseWithCosts ` +
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
