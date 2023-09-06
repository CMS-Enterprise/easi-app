package lcidactions

import (
	"fmt"
	"time"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// GetUpdateLCIDAction is a method to set all the relevant data fields for that are a result of an Update LCID action.
func GetUpdateLCIDAction(
	intake *models.SystemIntake,
	expirationDate *time.Time,
	nextSteps *models.HTML,
	scope *models.HTML,
	costBaseline *string,
	userInfo models.UserInfo,
) (*models.Action, error) {

	if intake == nil {
		return nil, fmt.Errorf("reference to the system intake is nil")
	}

	action := models.Action{
		IntakeID:       &intake.ID,
		ActionType:     models.ActionTypeUPDATELCID,
		ActorName:      userInfo.CommonName,
		ActorEmail:     userInfo.Email,
		ActorEUAUserID: userInfo.EuaUserID,
		Step:           &intake.Step,

		LCIDExpirationChangeNewDate:      intake.LifecycleExpiresAt,
		LCIDExpirationChangePreviousDate: intake.LifecycleExpiresAt,

		LCIDExpirationChangeNewScope:      intake.LifecycleScope,
		LCIDExpirationChangePreviousScope: intake.LifecycleScope,

		LCIDExpirationChangeNewNextSteps:      intake.DecisionNextSteps,
		LCIDExpirationChangePreviousNextSteps: intake.DecisionNextSteps,
	}
	//Action is set based on if the value was set or not. If not set, the new value and the old are the same
	if expirationDate != nil {
		action.LCIDExpirationChangeNewDate = expirationDate
	}
	if scope != nil {
		action.LCIDExpirationChangeNewScope = scope
	}
	if nextSteps != nil {
		action.LCIDExpirationChangeNewNextSteps = nextSteps
	}
	return &action, nil

}

// IsLCIDValidToUpdate checks if you can update the LCID for an intake, if not, it will return an error
// An LCID must have already been issued in order to be updateable
func IsLCIDValidToUpdate(intake *models.SystemIntake) error {
	if !intake.LifecycleID.Valid {
		return &apperrors.BadRequestError{
			Err: &apperrors.InvalidActionError{
				ActionType: models.ActionTypeUPDATELCID,
				Message:    "an LCID has not been issued for this intake, an LCID must be issued before it can be updated",
			},
		}
	}
	return nil
}
