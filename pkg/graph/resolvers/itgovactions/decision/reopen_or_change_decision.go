package decision

import (
	"fmt"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
)

// IsIntakeValid does a thing
// TODO - change comment
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

// UpdateIntakeDecision does a thing
// TODO - change comment
func UpdateIntakeDecision(intake *models.SystemIntake, newResolution model.SystemIntakeNewResolution) error {
	switch newResolution {
	// if reopening, just set State = Open, preserve existing DecisionState
	case model.SystemIntakeNewResolutionReopened:
		intake.State = models.SystemIntakeStateOPEN

	// if changing decision, set DecisionState = new resolution
	case model.SystemIntakeNewResolutionLcidIssued:
		intake.DecisionState = models.SIDSLcidIssued
	case model.SystemIntakeNewResolutionNotApproved:
		intake.DecisionState = models.SIDSNotApproved
	case model.SystemIntakeNewResolutionNotGovernance:
		intake.DecisionState = models.SIDSNotGovernance

	default:
		return &apperrors.BadRequestError{
			Err: apperrors.NewInvalidEnumError(fmt.Errorf("newResolution is an invalid value of SystemIntakeNewResolution"), newResolution, "SystemIntakeNewResolution"),
		}
	}

	return nil
}
