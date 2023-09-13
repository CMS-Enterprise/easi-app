package lcidactions

import (
	"time"

	"github.com/guregu/null"

	"github.com/cmsgov/easi-app/pkg/models"
)

// getBaseLCIDAction returns an action with basic entries related to LCID operations set. Action type is handled by the calling action
func getBaseLCIDAction(intake models.SystemIntake,
	expirationDate *time.Time,
	nextSteps *models.HTML,
	scope *models.HTML,
	costBaseline *string,
	userInfo models.UserInfo,
) models.Action {

	// action field values are set based on if the value was set or not. If not set, the new value and the old are the same.
	// this follows the existing paradigm for the legacy extend LCID action
	action := models.Action{
		IntakeID:       &intake.ID,
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

		LCIDExpirationChangeNewCostBaseline:      intake.LifecycleCostBaseline,
		LCIDExpirationChangePreviousCostBaseline: intake.LifecycleCostBaseline,
	}

	if expirationDate != nil {
		action.LCIDExpirationChangeNewDate = expirationDate
	}
	if scope != nil {
		action.LCIDExpirationChangeNewScope = scope
	}
	if nextSteps != nil {
		action.LCIDExpirationChangeNewNextSteps = nextSteps
	}
	if costBaseline != nil {
		action.LCIDExpirationChangeNewCostBaseline = null.StringFromPtr(costBaseline)
	}
	return action
}
