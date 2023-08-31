package lcidactions

import (
	"fmt"
	"time"

	"github.com/cmsgov/easi-app/pkg/models"
)

// SetUpdateLCIDAction is a method to set all the relevant data fields for that are a result of an Update LCID action.
func SetUpdateLCIDAction(
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

	// TODO: SW should I only update these values if set? They aren't all required...
	action := models.Action{
		IntakeID:       &intake.ID,
		ActionType:     models.ActionTypeUPDATELCID,
		ActorName:      userInfo.CommonName,
		ActorEmail:     userInfo.Email,
		ActorEUAUserID: userInfo.EuaUserID,
		Step:           &intake.Step,

		LCIDExpirationChangeNewDate:      expirationDate,
		LCIDExpirationChangePreviousDate: intake.LifecycleExpiresAt,

		LCIDExpirationChangeNewScope:      scope,
		LCIDExpirationChangePreviousScope: intake.LifecycleScope,

		LCIDExpirationChangeNewNextSteps:      nextSteps,
		LCIDExpirationChangePreviousNextSteps: intake.DecisionNextSteps,
	}
	return &action, nil

}
