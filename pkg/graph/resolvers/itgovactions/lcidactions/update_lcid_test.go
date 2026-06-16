package lcidactions

import (
	"testing"
	"time"

	"github.com/guregu/null"
	"github.com/stretchr/testify/assert"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func TestGetUpdateLCIDAction(t *testing.T) {
	lcid := null.StringFrom("123456")
	oldCostBaseline := null.StringFrom("$3")
	newCostBaseline := "$2"
	expirationDate := time.Now() //same for both
	nextSteps := models.HTML("<strong> My Next Steps! </strong>")
	newScope := models.HTML("Scope Scope Scope")
	previousLCIDType := models.LCIDTypeNewSystem
	previousIsPilot := false
	previousIsLowIT := true
	newLCIDType := models.LCIDTypeRecompete
	newIsPilot := true
	userInfo := models.UserInfo{
		DisplayName: "tester",
		Email:       "test@email.email",
		Username:    "TEST",
	}
	intake := models.SystemIntake{
		LifecycleID:           lcid,
		LifecycleCostBaseline: oldCostBaseline,
		LifecycleExpiresAt:    &expirationDate,
		LCIDType:              &previousLCIDType,
		LCIDIsPilot:           &previousIsPilot,
		LCIDIsLowIT:           &previousIsLowIT,
	}
	action := GetUpdateLCIDAction(intake, &expirationDate, &nextSteps, &newScope, &newCostBaseline, &newLCIDType, &newIsPilot, nil, userInfo)
	assert.EqualValues(t, oldCostBaseline, action.LCIDExpirationChangePreviousCostBaseline)
	assert.EqualValues(t, null.StringFrom(newCostBaseline), action.LCIDExpirationChangeNewCostBaseline)

	assert.EqualValues(t, &expirationDate, action.LCIDExpirationChangeNewDate)
	assert.EqualValues(t, &expirationDate, action.LCIDExpirationChangePreviousDate)

	assert.EqualValues(t, &nextSteps, action.LCIDExpirationChangeNewNextSteps)
	assert.EqualValues(t, &newScope, action.LCIDExpirationChangeNewScope)

	assert.EqualValues(t, models.ActionTypeUPDATELCID, action.ActionType)
	assert.EqualValues(t, &previousLCIDType, action.LCIDTypeChangePreviousValue)
	assert.EqualValues(t, &newLCIDType, action.LCIDTypeChangeNewValue)
	assert.EqualValues(t, &previousIsPilot, action.LCIDIsPilotChangePreviousValue)
	assert.EqualValues(t, &newIsPilot, action.LCIDIsPilotChangeNewValue)
	assert.EqualValues(t, &previousIsLowIT, action.LCIDIsLowITChangePreviousValue)
	assert.EqualValues(t, &previousIsLowIT, action.LCIDIsLowITChangeNewValue)

}

func TestIsLCIDValidToUpdate(t *testing.T) {
	intakeWithoutLCID := models.SystemIntake{}

	err := IsLCIDValidToUpdate(&intakeWithoutLCID)
	assert.Error(t, err)

	intakeWithLCID := models.SystemIntake{
		LifecycleID: null.StringFrom("123456"),
	}

	err2 := IsLCIDValidToUpdate(&intakeWithLCID)
	assert.NoError(t, err2)
}
