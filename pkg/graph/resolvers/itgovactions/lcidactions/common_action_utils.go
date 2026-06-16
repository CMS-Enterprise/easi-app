package lcidactions

import (
	"time"

	"github.com/guregu/null"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

// getBaseLCIDAction returns an action with basic entries related to LCID operations set. Action type is handled by the calling action
func getBaseLCIDAction(
	intake models.SystemIntake,
	expirationDate *time.Time,
	nextSteps *models.HTML,
	scope *models.HTML,
	costBaseline *string,
	userInfo models.UserInfo,
	retirementDate *time.Time,
	includeLCIDMetadata bool,
	lcidType *models.SystemIntakeLCIDType,
	lcidIsPilot *bool,
	lcidIsLowIT *bool,
) models.Action {

	// action field values are set based on if the value was set or not. If not set, the new value and the old are the same.
	// this follows the existing paradigm for the legacy extend LCID action
	action := models.Action{
		IntakeID:       &intake.ID,
		ActorName:      userInfo.DisplayName,
		ActorEmail:     userInfo.Email,
		ActorEUAUserID: userInfo.Username,
		Step:           &intake.Step,

		LCIDExpirationChangeNewDate:      intake.LifecycleExpiresAt,
		LCIDExpirationChangePreviousDate: intake.LifecycleExpiresAt,

		LCIDExpirationChangeNewScope:      intake.LifecycleScope,
		LCIDExpirationChangePreviousScope: intake.LifecycleScope,

		LCIDExpirationChangeNewNextSteps:      intake.DecisionNextSteps,
		LCIDExpirationChangePreviousNextSteps: intake.DecisionNextSteps,

		LCIDExpirationChangeNewCostBaseline:      intake.LifecycleCostBaseline,
		LCIDExpirationChangePreviousCostBaseline: intake.LifecycleCostBaseline,

		LCIDRetirementChangeNewDate:      intake.LifecycleRetiresAt,
		LCIDRetirementChangePreviousDate: intake.LifecycleRetiresAt,
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
	if retirementDate != nil {
		action.LCIDRetirementChangeNewDate = retirementDate
	}
	if !includeLCIDMetadata {
		return action
	}

	action.LCIDTypeChangeNewValue = intake.LCIDType
	action.LCIDTypeChangePreviousValue = intake.LCIDType
	action.LCIDIsPilotChangeNewValue = intake.LCIDIsPilot
	action.LCIDIsPilotChangePreviousValue = intake.LCIDIsPilot
	action.LCIDIsLowITChangeNewValue = intake.LCIDIsLowIT
	action.LCIDIsLowITChangePreviousValue = intake.LCIDIsLowIT

	if lcidType != nil {
		action.LCIDTypeChangeNewValue = lcidType
	}
	if lcidIsPilot != nil {
		action.LCIDIsPilotChangeNewValue = lcidIsPilot
	}
	if lcidIsLowIT != nil {
		action.LCIDIsLowITChangeNewValue = lcidIsLowIT
	}

	return action
}
