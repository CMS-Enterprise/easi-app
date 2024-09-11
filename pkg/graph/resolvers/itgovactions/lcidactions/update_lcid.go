package lcidactions

import (
	"time"

	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// GetUpdateLCIDAction is a method to set all the relevant data fields for that are a result of an Update LCID action.
func GetUpdateLCIDAction(
	intake models.SystemIntake,
	expirationDate *time.Time,
	nextSteps *models.HTML,
	scope *models.HTML,
	costBaseline *string,
	userInfo models.UserInfo,
) models.Action {

	action := getBaseLCIDAction(intake, expirationDate, nextSteps, scope, costBaseline, userInfo, nil)
	action.ActionType = models.ActionTypeUPDATELCID

	return action

}

// IsLCIDValidToUpdate checks if you can update the LCID for an intake, if not, it will return an error
// An LCID must have already been issued in order to be updateable
func IsLCIDValidToUpdate(intake *models.SystemIntake) error {
	if intake.LifecycleID.ValueOrZero() == "" {
		return &apperrors.BadRequestError{
			Err: &apperrors.InvalidActionError{
				ActionType: models.ActionTypeUPDATELCID,
				Message:    "an LCID has not been issued for this intake, an LCID must be issued before it can be updated",
			},
		}
	}
	return nil
}
