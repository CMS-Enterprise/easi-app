package lcidactions

import (
	"time"

	"github.com/cmsgov/easi-app/pkg/models"
)

// GetExpireLCIDAction is a method to create an action record with all the relevant data fields for an Expire LCID action.
func GetExpireLCIDAction(
	intake models.SystemIntake,
	newExpirationDate time.Time,
	newNextSteps models.HTML,
	userInfo models.UserInfo,
) models.Action {
	// pass in nil for nextSteps and scope because those aren't changed by this action
	action := getBaseLCIDAction(intake, &newExpirationDate, &newNextSteps, nil, nil, userInfo)
	action.ActionType = models.ActionTypeEXPIRELCID

	return action
}
