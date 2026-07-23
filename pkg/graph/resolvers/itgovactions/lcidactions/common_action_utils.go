package lcidactions

import (
	"time"

	"github.com/guregu/null"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

type baseLCIDActionArgs struct {
	intake   models.SystemIntake
	userInfo models.UserInfo

	expirationDate *time.Time
	nextSteps      *models.HTML
	scope          *models.HTML
	costBaseline   *string
	retirementDate *time.Time

	lcidType        *models.SystemIntakeLCIDType
	lcidComponent   *models.SystemIntakeContactComponent
	lcidIsShortened *bool
	lcidIsLowIT     *bool
}

// getBaseLCIDAction returns an action with basic entries related to LCID operations set. Action type is handled by the calling action
func getBaseLCIDAction(args baseLCIDActionArgs) models.Action {

	// action field values are set based on if the value was set or not. If not set, the new value and the old are the same.
	// this follows the existing paradigm for the legacy extend LCID action
	action := models.Action{
		IntakeID:       &args.intake.ID,
		ActorName:      args.userInfo.DisplayName,
		ActorEmail:     args.userInfo.Email,
		ActorEUAUserID: args.userInfo.Username,
		Step:           &args.intake.Step,

		LCIDExpirationChangeNewDate:      args.intake.LifecycleExpiresAt,
		LCIDExpirationChangePreviousDate: args.intake.LifecycleExpiresAt,

		LCIDExpirationChangeNewScope:      args.intake.LifecycleScope,
		LCIDExpirationChangePreviousScope: args.intake.LifecycleScope,

		LCIDExpirationChangeNewNextSteps:      args.intake.DecisionNextSteps,
		LCIDExpirationChangePreviousNextSteps: args.intake.DecisionNextSteps,

		LCIDExpirationChangeNewCostBaseline:      args.intake.LifecycleCostBaseline,
		LCIDExpirationChangePreviousCostBaseline: args.intake.LifecycleCostBaseline,

		LCIDRetirementChangeNewDate:      args.intake.LifecycleRetiresAt,
		LCIDRetirementChangePreviousDate: args.intake.LifecycleRetiresAt,

		LCIDTypeChangeNewValue:             args.intake.LCIDType,
		LCIDTypeChangePreviousValue:        args.intake.LCIDType,
		LCIDComponentChangeNewValue:        args.intake.LCIDComponent,
		LCIDComponentChangePreviousValue:   args.intake.LCIDComponent,
		LCIDIsShortenedChangeNewValue:      args.intake.LCIDIsShortened,
		LCIDIsShortenedChangePreviousValue: args.intake.LCIDIsShortened,
		LCIDIsLowITChangeNewValue:          args.intake.LCIDIsLowIT,
		LCIDIsLowITChangePreviousValue:     args.intake.LCIDIsLowIT,
	}

	if args.expirationDate != nil {
		action.LCIDExpirationChangeNewDate = args.expirationDate
	}
	if args.scope != nil {
		action.LCIDExpirationChangeNewScope = args.scope
	}
	if args.nextSteps != nil {
		action.LCIDExpirationChangeNewNextSteps = args.nextSteps
	}
	if args.costBaseline != nil {
		action.LCIDExpirationChangeNewCostBaseline = null.StringFromPtr(args.costBaseline)
	}
	if args.retirementDate != nil {
		action.LCIDRetirementChangeNewDate = args.retirementDate
	}

	if args.lcidType != nil {
		action.LCIDTypeChangeNewValue = args.lcidType
	}
	if args.lcidComponent != nil {
		action.LCIDComponentChangeNewValue = args.lcidComponent
	}
	if args.lcidIsShortened != nil {
		action.LCIDIsShortenedChangeNewValue = args.lcidIsShortened
	}
	if args.lcidIsLowIT != nil {
		action.LCIDIsLowITChangeNewValue = args.lcidIsLowIT
	}

	return action
}
