package lcidactions

import (
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// GetUnretireLCIDAction is a method to create an action record with all the relevant data fields for an Unretire LCID action.
func GetUnretireLCIDAction(
	intake models.SystemIntake,
	userInfo models.UserInfo,
) models.Action {
	action := getBaseLCIDAction(baseLCIDActionArgs{
		intake:   intake,
		userInfo: userInfo,
	})
	action.ActionType = models.ActionTypeUNRETIRELCID

	return action
}
