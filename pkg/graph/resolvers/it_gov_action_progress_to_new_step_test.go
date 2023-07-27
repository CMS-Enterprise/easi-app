package resolvers

import (
	"fmt"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
)

func TestModifyIntakeToNewStep(t *testing.T) {
	t.Run("modifying intake to new step should update intake step", func(t *testing.T) {
		mockCurrentTime := time.Unix(0, 0)

		allStartingSteps := []models.SystemIntakeStep{
			models.SystemIntakeStepINITIALFORM,
			models.SystemIntakeStepDRAFTBIZCASE,
			models.SystemIntakeStepGRTMEETING,
			models.SystemIntakeStepFINALBIZCASE,
			models.SystemIntakeStepGRBMEETING,
			models.SystemIntakeStepDECISION,
		}
		allValidNewSteps := []model.SystemIntakeStepToProgressTo{
			model.SystemIntakeStepToProgressToDraftBusinessCase,
			model.SystemIntakeStepToProgressToGrtMeeting,
			model.SystemIntakeStepToProgressToFinalBusinessCase,
			model.SystemIntakeStepToProgressToGrbMeeting,
		}
		for _, startingStep := range allStartingSteps {
			for _, newStep := range allValidNewSteps {
				t.Run(fmt.Sprintf("Starting from %v, progressing to %v, intake step should be updated", startingStep, newStep), func(t *testing.T) {
					intake := &models.SystemIntake{
						Step: startingStep,
					}

					modifyIntakeToNewStep(intake, newStep, nil, mockCurrentTime)

					assert.EqualValues(t, newStep, intake.Step)
				})
			}
		}
	})
}
