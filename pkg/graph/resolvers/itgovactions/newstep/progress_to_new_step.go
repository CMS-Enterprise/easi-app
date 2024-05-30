package newstep

import (
	"fmt"
	"time"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
)

// IsIntakeValid checks if in an intake and a new step from a Progress to New Step action are valid
// the frontend shouldn't allow users to take any invalid actions, but we validate server-side to make sure
func IsIntakeValid(intake *models.SystemIntake, newStep model.SystemIntakeStepToProgressTo) error {
	if intake.State == models.SystemIntakeStateClosed {
		return &apperrors.BadRequestError{
			Err: &apperrors.InvalidActionError{
				ActionType: models.ActionTypePROGRESSTONEWSTEP,
				Message:    "Can't take Progress to New Step action on closed intakes",
			},
		}
	}

	if intake.Step == models.SystemIntakeStepINITIALFORM && intake.RequestFormState == models.SIRFSNotStarted {
		return &apperrors.BadRequestError{
			Err: &apperrors.InvalidActionError{
				ActionType: models.ActionTypePROGRESSTONEWSTEP,
				Message:    "Can't take Progress to New Step action on intakes that haven't started the Request Form",
			},
		}
	}

	if string(intake.Step) == string(newStep) {
		return &apperrors.BadRequestError{
			Err: &apperrors.InvalidActionError{
				ActionType: models.ActionTypePROGRESSTONEWSTEP,
				Message:    fmt.Sprintf("Progress to New Step needs to change intake to a different step, intake is already at %v", newStep),
			},
		}
	}

	return nil
}

// UpdateIntake updates an intake based on a previously validated Progress to New Step action
func UpdateIntake(intake *models.SystemIntake, newStep model.SystemIntakeStepToProgressTo, newMeetingDate *time.Time, currentTime time.Time) error {
	intake.UpdatedAt = &currentTime

	switch newStep {
	case model.SystemIntakeStepToProgressToDraftBusinessCase:
		intake.Step = models.SystemIntakeStepDRAFTBIZCASE
		return nil

	case model.SystemIntakeStepToProgressToGrtMeeting:
		intake.Step = models.SystemIntakeStepGRTMEETING

		if newMeetingDate != nil {
			intake.GRTDate = newMeetingDate
		} else if intake.GRTDate != nil && intake.GRTDate.Before(currentTime) {
			intake.GRTDate = nil // if previously scheduled date has happened, and we don't have a new meeting date, clear the previous date
		}

		return nil

	case model.SystemIntakeStepToProgressToFinalBusinessCase:
		intake.Step = models.SystemIntakeStepFINALBIZCASE
		return nil

	case model.SystemIntakeStepToProgressToGrbMeeting:
		intake.Step = models.SystemIntakeStepGRBMEETING

		if newMeetingDate != nil {
			intake.GRBDate = newMeetingDate
		} else if intake.GRBDate != nil && intake.GRBDate.Before(currentTime) {
			intake.GRBDate = nil // if previously scheduled date has happened, and we don't have a new meeting date, clear the previous date
		}

		return nil

	default:
		return &apperrors.BadRequestError{
			Err: apperrors.NewInvalidEnumError(fmt.Errorf("newStep is an invalid value of SystemIntakeStepToProgressTo"), newStep, "SystemIntakeStepToProgressTo"),
		}
	}
}
