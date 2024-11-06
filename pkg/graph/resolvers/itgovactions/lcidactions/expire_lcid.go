package lcidactions

import (
	"time"

	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// IsIntakeValidToExpireLCID checks if an intake is valid to have its LCID manually expired
func IsIntakeValidToExpireLCID(intake *models.SystemIntake, currentTime time.Time) error {
	// check that intake has an LCID
	if intake.LifecycleID.ValueOrZero() == "" {
		return &apperrors.BadRequestError{
			Err: &apperrors.InvalidActionError{
				ActionType: models.ActionTypeEXPIRELCID,
				Message:    "Intake doesn't have an LCID to expire",
			},
		}
	}

	// this should never happen in practice; setting .LifecycleExpiresAt is always required when issuing an LCID
	// but we should still handle this case gracefully to avoid panicking when calling intake.LifecycleExpiresAt.Before()
	if intake.LifecycleExpiresAt == nil {
		return &apperrors.BadRequestError{
			Err: &apperrors.InvalidActionError{
				ActionType: models.ActionTypeEXPIRELCID,
				Message:    "Intake has an LCID issued without an expiration date",
			},
		}
	}

	// check that intake hasn't already expired
	if intake.LifecycleExpiresAt.Before(currentTime) {
		return &apperrors.BadRequestError{
			Err: &apperrors.InvalidActionError{
				ActionType: models.ActionTypeEXPIRELCID,
				Message:    "Intake's LCID has already expired",
			},
		}
	}

	return nil
}

// GetExpireLCIDAction is a method to create an action record with all the relevant data fields for an Expire LCID action.
func GetExpireLCIDAction(
	intake models.SystemIntake,
	newExpirationDate time.Time,
	newNextSteps *models.HTML,
	userInfo models.UserInfo,
) models.Action {
	// pass in nil for scope and cost baseline because those aren't changed by this action
	action := getBaseLCIDAction(intake, &newExpirationDate, newNextSteps, nil, nil, userInfo, nil)
	action.ActionType = models.ActionTypeEXPIRELCID

	return action
}
