package newstep

import (
	"fmt"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
)

func TestUpdateIntake(t *testing.T) {
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

					err := updateIntake(intake, newStep, nil, mockCurrentTime)

					assert.NoError(t, err)
					assert.EqualValues(t, newStep, intake.Step)
				})
			}
		}
	})

	t.Run("Updating dates of GRT and GRB meetings", func(t *testing.T) {
		mockCurrentTime := time.Unix(0, 0)
		twoDaysAgo := mockCurrentTime.Add(time.Hour * -48)
		yesterday := mockCurrentTime.Add(time.Hour * -24)
		tomorrow := mockCurrentTime.Add(time.Hour * 24)
		inTwoDays := mockCurrentTime.Add(time.Hour * 48)

		t.Run("Progressing to GRT meeting", func(t *testing.T) {
			t.Run("No date was scheduled for the meeting before this action", func(t *testing.T) {
				t.Run("Should *not* update GRT date if no date was previously scheduled and no new date is provided", func(t *testing.T) {
					intake := &models.SystemIntake{
						Step:    models.SystemIntakeStepINITIALFORM,
						GRTDate: nil,
					}

					err := updateIntake(intake, model.SystemIntakeStepToProgressToGrtMeeting, nil, mockCurrentTime)

					assert.NoError(t, err)
					assert.Nil(t, intake.GRTDate)
				})

				// frontend will warn in this situation, but it's valid; see item 3 in https://cmsgov.slack.com/archives/CNU2B59UH/p1690383278796169?thread_ts=1690292116.615049&cid=CNU2B59UH
				t.Run("*Should* update GRT date if no date was previously scheduled and a new date in the past is provided", func(t *testing.T) {
					newDate := &yesterday
					intake := &models.SystemIntake{
						Step:    models.SystemIntakeStepINITIALFORM,
						GRTDate: nil,
					}

					err := updateIntake(intake, model.SystemIntakeStepToProgressToGrtMeeting, newDate, mockCurrentTime)

					assert.NoError(t, err)
					assert.EqualValues(t, newDate, intake.GRTDate)
				})

				t.Run("*Should* update GRT date if no date was previously scheduled and a new date in the future is provided", func(t *testing.T) {
					newDate := &tomorrow
					intake := &models.SystemIntake{
						Step:    models.SystemIntakeStepINITIALFORM,
						GRTDate: nil,
					}

					err := updateIntake(intake, model.SystemIntakeStepToProgressToGrtMeeting, newDate, mockCurrentTime)

					assert.NoError(t, err)
					assert.EqualValues(t, newDate, intake.GRTDate)
				})
			})

			t.Run("Meeting was scheduled before this action for a date in the past", func(t *testing.T) {
				t.Run("Should *clear* GRT date if the previously scheduled date is in the past and no new date is provided", func(t *testing.T) {
					previousDate := &twoDaysAgo
					intake := &models.SystemIntake{
						Step:    models.SystemIntakeStepINITIALFORM,
						GRTDate: previousDate,
					}

					err := updateIntake(intake, model.SystemIntakeStepToProgressToGrtMeeting, nil, mockCurrentTime)

					assert.NoError(t, err)
					assert.Nil(t, intake.GRTDate)
				})

				// frontend will warn in this situation, but it's valid; see item 3 in https://cmsgov.slack.com/archives/CNU2B59UH/p1690383278796169?thread_ts=1690292116.615049&cid=CNU2B59UH
				t.Run("*Should* update GRT date if the previously scheduled date is in the past and a new date in the past is provided", func(t *testing.T) {
					previousDate := &twoDaysAgo
					newDate := &yesterday
					intake := &models.SystemIntake{
						Step:    models.SystemIntakeStepINITIALFORM,
						GRTDate: previousDate,
					}

					err := updateIntake(intake, model.SystemIntakeStepToProgressToGrtMeeting, newDate, mockCurrentTime)

					assert.NoError(t, err)
					assert.EqualValues(t, newDate, intake.GRTDate)
				})

				t.Run("*Should* update GRT date if the previously scheduled date is in the past and a new date in the future is provided", func(t *testing.T) {
					previousDate := &twoDaysAgo
					newDate := &tomorrow
					intake := &models.SystemIntake{
						Step:    models.SystemIntakeStepINITIALFORM,
						GRTDate: previousDate,
					}

					err := updateIntake(intake, model.SystemIntakeStepToProgressToGrtMeeting, newDate, mockCurrentTime)

					assert.NoError(t, err)
					assert.EqualValues(t, newDate, intake.GRTDate)
				})
			})

			t.Run("Meeting was scheduled before this action for a date in the future", func(t *testing.T) {
				t.Run("Should *not* update GRT date if the previously scheduled date is in the future and no new date is provided", func(t *testing.T) {
					previousDate := &tomorrow
					intake := &models.SystemIntake{
						Step:    models.SystemIntakeStepINITIALFORM,
						GRTDate: previousDate,
					}

					err := updateIntake(intake, model.SystemIntakeStepToProgressToGrtMeeting, nil, mockCurrentTime)

					assert.NoError(t, err)
					assert.EqualValues(t, previousDate, intake.GRTDate)
				})

				// frontend will warn in this situation, but it's valid; see item 3 in https://cmsgov.slack.com/archives/CNU2B59UH/p1690383278796169?thread_ts=1690292116.615049&cid=CNU2B59UH
				t.Run("*Should* update GRT date if the previously scheduled date is in the future and a new date in the past is provided", func(t *testing.T) {
					previousDate := &tomorrow
					newDate := &yesterday
					intake := &models.SystemIntake{
						Step:    models.SystemIntakeStepINITIALFORM,
						GRTDate: previousDate,
					}

					err := updateIntake(intake, model.SystemIntakeStepToProgressToGrtMeeting, newDate, mockCurrentTime)

					assert.NoError(t, err)
					assert.EqualValues(t, newDate, intake.GRTDate)
				})

				t.Run("*Should* update GRT date if the previously scheduled date is in the future and a new date in the future is provided", func(t *testing.T) {
					previousDate := &tomorrow
					newDate := &inTwoDays
					intake := &models.SystemIntake{
						Step:    models.SystemIntakeStepINITIALFORM,
						GRTDate: previousDate,
					}

					err := updateIntake(intake, model.SystemIntakeStepToProgressToGrtMeeting, newDate, mockCurrentTime)

					assert.NoError(t, err)
					assert.EqualValues(t, newDate, intake.GRTDate)
				})
			})
		})

		t.Run("Progressing to GRB meeting", func(t *testing.T) {
			t.Run("No date was scheduled for the meeting before this action", func(t *testing.T) {
				t.Run("Should *not* update GRB date if no date was previously scheduled and no new date is provided", func(t *testing.T) {
					intake := &models.SystemIntake{
						Step:    models.SystemIntakeStepINITIALFORM,
						GRBDate: nil,
					}

					err := updateIntake(intake, model.SystemIntakeStepToProgressToGrbMeeting, nil, mockCurrentTime)

					assert.NoError(t, err)
					assert.Nil(t, intake.GRBDate)
				})

				// frontend will warn in this situation, but it's valid; see item 3 in https://cmsgov.slack.com/archives/CNU2B59UH/p1690383278796169?thread_ts=1690292116.615049&cid=CNU2B59UH
				t.Run("*Should* update GRB date if no date was previously scheduled and a new date in the past is provided", func(t *testing.T) {
					newDate := &yesterday
					intake := &models.SystemIntake{
						Step:    models.SystemIntakeStepINITIALFORM,
						GRBDate: nil,
					}

					err := updateIntake(intake, model.SystemIntakeStepToProgressToGrbMeeting, newDate, mockCurrentTime)

					assert.NoError(t, err)
					assert.EqualValues(t, newDate, intake.GRBDate)
				})

				t.Run("*Should* update GRB date if no date was previously scheduled and a new date in the future is provided", func(t *testing.T) {
					newDate := &tomorrow
					intake := &models.SystemIntake{
						Step:    models.SystemIntakeStepINITIALFORM,
						GRBDate: nil,
					}

					err := updateIntake(intake, model.SystemIntakeStepToProgressToGrbMeeting, newDate, mockCurrentTime)

					assert.NoError(t, err)
					assert.EqualValues(t, newDate, intake.GRBDate)
				})
			})

			t.Run("Meeting was scheduled before this action for a date in the past", func(t *testing.T) {
				t.Run("Should *clear* GRB date if the previously scheduled date is in the past and no new date is provided", func(t *testing.T) {
					previousDate := &twoDaysAgo
					intake := &models.SystemIntake{
						Step:    models.SystemIntakeStepINITIALFORM,
						GRBDate: previousDate,
					}

					err := updateIntake(intake, model.SystemIntakeStepToProgressToGrbMeeting, nil, mockCurrentTime)

					assert.NoError(t, err)
					assert.Nil(t, intake.GRBDate)
				})

				// frontend will warn in this situation, but it's valid; see item 3 in https://cmsgov.slack.com/archives/CNU2B59UH/p1690383278796169?thread_ts=1690292116.615049&cid=CNU2B59UH
				t.Run("*Should* update GRB date if the previously scheduled date is in the past and a new date in the past is provided", func(t *testing.T) {
					previousDate := &twoDaysAgo
					newDate := &yesterday
					intake := &models.SystemIntake{
						Step:    models.SystemIntakeStepINITIALFORM,
						GRBDate: previousDate,
					}

					err := updateIntake(intake, model.SystemIntakeStepToProgressToGrbMeeting, newDate, mockCurrentTime)

					assert.NoError(t, err)
					assert.EqualValues(t, newDate, intake.GRBDate)
				})

				t.Run("*Should* update GRB date if the previously scheduled date is in the past and a new date in the future is provided", func(t *testing.T) {
					previousDate := &twoDaysAgo
					newDate := &tomorrow
					intake := &models.SystemIntake{
						Step:    models.SystemIntakeStepINITIALFORM,
						GRBDate: previousDate,
					}

					err := updateIntake(intake, model.SystemIntakeStepToProgressToGrbMeeting, newDate, mockCurrentTime)

					assert.NoError(t, err)
					assert.EqualValues(t, newDate, intake.GRBDate)
				})
			})

			t.Run("Meeting was scheduled before this action for a date in the future", func(t *testing.T) {
				t.Run("Should *not* update GRB date if the previously scheduled date is in the future and no new date is provided", func(t *testing.T) {
					previousDate := &tomorrow
					intake := &models.SystemIntake{
						Step:    models.SystemIntakeStepINITIALFORM,
						GRBDate: previousDate,
					}

					err := updateIntake(intake, model.SystemIntakeStepToProgressToGrbMeeting, nil, mockCurrentTime)

					assert.NoError(t, err)
					assert.EqualValues(t, previousDate, intake.GRBDate)
				})

				// frontend will warn in this situation, but it's valid; see item 3 in https://cmsgov.slack.com/archives/CNU2B59UH/p1690383278796169?thread_ts=1690292116.615049&cid=CNU2B59UH
				t.Run("*Should* update GRB date if the previously scheduled date is in the future and a new date in the past is provided", func(t *testing.T) {
					previousDate := &tomorrow
					newDate := &yesterday
					intake := &models.SystemIntake{
						Step:    models.SystemIntakeStepINITIALFORM,
						GRBDate: previousDate,
					}

					err := updateIntake(intake, model.SystemIntakeStepToProgressToGrbMeeting, newDate, mockCurrentTime)

					assert.NoError(t, err)
					assert.EqualValues(t, newDate, intake.GRBDate)
				})

				t.Run("*Should* update GRB date if the previously scheduled date is in the future and a new date in the future is provided", func(t *testing.T) {
					previousDate := &tomorrow
					newDate := &inTwoDays
					intake := &models.SystemIntake{
						Step:    models.SystemIntakeStepINITIALFORM,
						GRBDate: previousDate,
					}

					err := updateIntake(intake, model.SystemIntakeStepToProgressToGrbMeeting, newDate, mockCurrentTime)

					assert.NoError(t, err)
					assert.EqualValues(t, newDate, intake.GRBDate)
				})
			})
		})
	})
}
