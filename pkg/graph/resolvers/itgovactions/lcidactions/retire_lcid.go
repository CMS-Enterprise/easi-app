package lcidactions

import (
	"time"

	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// IsLCIDValidToRetire checks if an intake is valid to have a retirement date issued for its LCID
// just need to check intake; whether the retirement date is in the past or the future doesn't matter, both are valid
func IsLCIDValidToRetire(intake *models.SystemIntake) error {
	if intake.LifecycleID.ValueOrZero() == "" {
		return &apperrors.BadRequestError{
			Err: &apperrors.InvalidActionError{
				ActionType: models.ActionTypeRETIRELCID,
				Message:    "Intake doesn't have an LCID to retire",
			},
		}
	}

	if intake.LifecycleRetiresAt != nil {
		return &apperrors.BadRequestError{
			Err: &apperrors.InvalidActionError{
				ActionType: models.ActionTypeRETIRELCID,
				Message:    "Intake's LCID already has a retirement date set",
			},
		}
	}

	return nil
}

// GetRetireLCIDAction is a method to create an action record with all the relevant data fields for a Retire LCID action.
func GetRetireLCIDAction(
	intake models.SystemIntake,
	newRetirementDate time.Time,
	userInfo models.UserInfo,
) models.Action {
	// pass in nil for most parameters - only change is to the retirement date
	action := getBaseLCIDAction(intake, nil, nil, nil, nil, userInfo, &newRetirementDate)
	action.ActionType = models.ActionTypeRETIRELCID

	return action
}
