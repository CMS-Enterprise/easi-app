package storage

import (
	"fmt"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *StoreTestSuite) TestValidateSourceActionTargetFormForProgressToNewStepAction() {
	sourceAction := models.GovernanceRequestFeedbackSourceActionProgressToNewStep

	s.Run("Progressing to a new step + 'no target specified' should be valid", func() {
		feedback := models.GovernanceRequestFeedback{
			SourceAction: sourceAction,
			TargetForm:   models.GovernanceRequestFeedbackTargetNoTargetProvided,
		}
		s.True(validateSourceActionTargetFormCombination(feedback))
	})

	invalidFormsForProgressToNewStep := []models.GovernanceRequestFeedbackTargetForm{
		models.GovernanceRequestFeedbackTargetIntakeRequest,
		models.GovernanceRequestFeedbackTargetDraftBusinessCase,
		models.GovernanceRequestFeedbackTargetFinalBusinessCase,
	}

	for _, invalidForm := range invalidFormsForProgressToNewStep {
		testName := fmt.Sprintf("Progressing to a new step and targeting %v should be invalid", invalidForm)
		s.Run(testName, func() {
			feedback := models.GovernanceRequestFeedback{
				SourceAction: sourceAction,
				TargetForm:   invalidForm,
			}
			s.False(validateSourceActionTargetFormCombination(feedback))
		})
	}
}

func (s *StoreTestSuite) TestValidateSourceActionTargetFormForRequestEditsAction() {
	sourceAction := models.GovernanceRequestFeedbackSourceActionRequestEdits

	validFormsForRequestEdits := []models.GovernanceRequestFeedbackTargetForm{
		models.GovernanceRequestFeedbackTargetIntakeRequest,
		models.GovernanceRequestFeedbackTargetDraftBusinessCase,
		models.GovernanceRequestFeedbackTargetFinalBusinessCase,
	}

	for _, validForm := range validFormsForRequestEdits {
		testName := fmt.Sprintf("Requesting edits for the %v form should be valid", validForm)
		s.Run(testName, func() {
			feedback := models.GovernanceRequestFeedback{
				SourceAction: sourceAction,
				TargetForm:   validForm,
			}
			s.True(validateSourceActionTargetFormCombination(feedback))
		})
	}

	s.Run("Requesting edits without specifying a target should be invalid", func() {
		feedback := models.GovernanceRequestFeedback{
			SourceAction: sourceAction,
			TargetForm:   models.GovernanceRequestFeedbackTargetNoTargetProvided,
		}
		s.False(validateSourceActionTargetFormCombination(feedback))
	})
}
