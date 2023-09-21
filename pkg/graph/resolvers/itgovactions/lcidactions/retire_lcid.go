package lcidactions

import (
	"time"

	"github.com/cmsgov/easi-app/pkg/models"
)

// GetRetireLCIDAction is a method to create an action record with all the relevant data fields for a Retire LCID action.
func GetRetireLCIDAction(
	intake models.SystemIntake,
	newRetirementDate time.Time,
	userInfo models.UserInfo,
) models.Action {
	// pass in nil for most parameters - only change is to the retirement date
	action := getBaseLCIDAction(intake, nil, nil, nil, nil, userInfo, &newRetirementDate)
	action.ActionType = models.ActionTypeRETIRELCID

	return action
}
