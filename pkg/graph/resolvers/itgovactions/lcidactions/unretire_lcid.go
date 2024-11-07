package lcidactions

import (
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// GetUnretireLCIDAction is a method to create an action record with all the relevant data fields for an Unretire LCID action.
func GetUnretireLCIDAction(
	intake models.SystemIntake,
	userInfo models.UserInfo,
) models.Action {
	// pass in nil for most parameters - only change is to set the retirement date to nil
	action := getBaseLCIDAction(intake, nil, nil, nil, nil, userInfo, nil)
	action.ActionType = models.ActionTypeUNRETIRELCID

	return action
}
