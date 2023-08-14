package decision

import (
	"fmt"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
)

// IsIntakeValid checks in an intake and a new resolution from a Change Decision/Reopen Request action are valid
// the frontend shouldn't allow users to take any invalid actions, but we validate server-side to make sure
// TODO - will there be any other fields from input that're checked, that should be referenced here?
func IsIntakeValid(intake *models.SystemIntake, newResolution model.SystemIntakeNewResolution) error {
	if intake.State != models.SystemIntakeStateCLOSED {
		return &apperrors.BadRequestError{
			Err: &apperrors.InvalidActionError{
				ActionType: models.ActionTypeREOPENORCHANGEDECISION,
				Message:    "Can't take Reopen or Change Decision action on intakes that aren't closed",
			},
		}
	}

	// specific checks for changing decision (not reopening)
	if newResolution != model.SystemIntakeNewResolutionReopened {
		// TODO - if there aren't any other specific checks for changing decision (or specifically for reopening), combine if checks?
		if string(newResolution) == string(intake.DecisionState) {
			return &apperrors.BadRequestError{
				Err: &apperrors.InvalidActionError{
					ActionType: models.ActionTypeREOPENORCHANGEDECISION,
					Message:    fmt.Sprintf("Changing decision on an intake needs to change intake to a different decision, intake already has decision %v", newResolution),
				},
			}
		}
	}

	return nil
}

// UpdateIntake updates an intake based on a previously validated Change Decision/Reopen Request action
func UpdateIntake(intake *models.SystemIntake, newResolution model.SystemIntakeNewResolution) error {
	// TODO - depending on how complex/verbose logic gets, potentially extract code from switch cases into private functions

	switch newResolution {
	// if reopening, just set State = Open, preserve existing DecisionState
	case model.SystemIntakeNewResolutionReopened:
		// TODO - any other fields to update?
		intake.State = models.SystemIntakeStateOPEN

	// if changing decision, set DecisionState = new resolution
	case model.SystemIntakeNewResolutionLcidIssued:
		// TODO - update LCID fields
		// TODO - may need to reference logic in pkg/services/system_intake.go, in NewUpdateLifecycleFields()
		intake.DecisionState = models.SIDSLcidIssued
	case model.SystemIntakeNewResolutionNotApproved:
		// TODO - update .RejectionReason, .DecisionNextSteps
		// TODO - any other fields to update?
		intake.DecisionState = models.SIDSNotApproved
	case model.SystemIntakeNewResolutionNotGovernance:
		// TODO - any other fields to update?
		intake.DecisionState = models.SIDSNotGovernance

	default:
		return &apperrors.BadRequestError{
			Err: apperrors.NewInvalidEnumError(fmt.Errorf("newResolution is an invalid value of SystemIntakeNewResolution"), newResolution, "SystemIntakeNewResolution"),
		}
	}

	return nil
}
