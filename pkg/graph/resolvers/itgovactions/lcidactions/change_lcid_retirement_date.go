package lcidactions

import (
	"time"

	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// IsLCIDValidToChangeRetirementDate checks if an intake is valid to have its retirement date changed
// just need to check intake; whether the new retirement date is in the past or the future doesn't matter, both are valid
func IsLCIDValidToChangeRetirementDate(intake *models.SystemIntake) error {
	if intake.LifecycleID.ValueOrZero() == "" {
		return &apperrors.BadRequestError{
			Err: &apperrors.InvalidActionError{
				ActionType: models.ActionTypeCHANGELCIDRETIREMENTDATE,
				Message:    "Intake doesn't have an LCID to retire",
			},
		}
	}

	if intake.LifecycleRetiresAt == nil {
		return &apperrors.BadRequestError{
			Err: &apperrors.InvalidActionError{
				ActionType: models.ActionTypeCHANGELCIDRETIREMENTDATE,
				Message:    "Intake's LCID doesn't have a retirement date set",
			},
		}
	}

	// don't need to check whether current retirement date is in the past or future; changing it is valid in both cases

	return nil
}

// GetChangeLCIDRetirementDateAction is a method to create an action record with all the relevant data fields for a Change LCID Retirement Date action.
func GetChangeLCIDRetirementDateAction(
	intake models.SystemIntake,
	newRetirementDate time.Time,
	userInfo models.UserInfo,
) models.Action {
	// pass in nil for most parameters - only change is to the retirement date
	action := getBaseLCIDAction(intake, nil, nil, nil, nil, userInfo, &newRetirementDate)
	action.ActionType = models.ActionTypeCHANGELCIDRETIREMENTDATE

	return action
}
