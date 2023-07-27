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
	mockCurrentTime := time.Unix(0, 0)
	// yesterday := mockCurrentTime.Add(time.Hour * -24)
	// tomorrow := mockCurrentTime.Add(time.Hour * 24)

	/*
			type calculateSystemIntakeRequesterStatusTestCase struct {
			testName       string
			intake         models.SystemIntake
			expectedStatus models.SystemIntakeStatusRequester
			errorExpected  bool
		}

		type testCasesForStep struct {
			stepName  string
			testCases []calculateSystemIntakeRequesterStatusTestCase
		}
	*/

	// TODO - rename
	type thisTestCase struct {
		testName     string
		startingStep models.SystemIntakeStep
		newStep      model.SystemIntakeStepToProgressTo
	}

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
	testCases := []thisTestCase{}
	for _, startingStep := range allStartingSteps {
		for _, newStep := range allValidNewSteps {
			testCases = append(testCases, thisTestCase{
				testName:     fmt.Sprintf("Starting from %v, progressing to %v, intake step should be updated", startingStep, newStep),
				startingStep: startingStep,
				newStep:      newStep,
			})
		}
	}

	for _, testCase := range testCases {
		t.Run(testCase.testName, func(t *testing.T) {
			intake := &models.SystemIntake{
				Step: testCase.startingStep,
			}

			modifyIntakeToNewStep(intake, testCase.newStep, nil, mockCurrentTime)

			assert.EqualValues(t, testCase.newStep, intake.Step)
		})
	}

	/*
		t.Run("Progressing to draft business case", func(t *testing.T) {
			// TODO - convert to table-driven test, loop through all other steps

			t.Run("Starting from initial request form - intake step should be updated", func(t *testing.T) {
				intake := &models.SystemIntake{
					Step: models.SystemIntakeStepINITIALFORM,
				}

				modifyIntakeToNewStep(intake, model.SystemIntakeStepToProgressToDraftBusinessCase, nil, mockCurrentTime)

				assert.EqualValues(t, models.SystemIntakeStepDRAFTBIZCASE, intake.Step)
			})
		})
	*/
}
