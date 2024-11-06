package lcidactions

import (
	"testing"
	"time"

	"github.com/guregu/null"
	"github.com/stretchr/testify/assert"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func TestGetConfirmLCIDAction(t *testing.T) {

	lcid := null.StringFrom("123456")
	oldCostBaseline := null.StringFrom("$3")
	newCostBaseline := "$2"
	expirationDate := time.Now() //same for both
	nextSteps := models.HTML("<strong> My Next Steps! </strong>")
	newScope := models.HTML("Scope Scope Scope")
	userInfo := models.UserInfo{
		DisplayName: "tester",
		Email:       "test@email.email",
		Username:    "TEST",
	}
	intake := models.SystemIntake{
		LifecycleID:           lcid,
		LifecycleCostBaseline: oldCostBaseline,
		LifecycleExpiresAt:    &expirationDate,
	}
	action := GetConfirmLCIDAction(intake, expirationDate, nextSteps, newScope, &newCostBaseline, userInfo)
	assert.EqualValues(t, oldCostBaseline, action.LCIDExpirationChangePreviousCostBaseline)
	assert.EqualValues(t, null.StringFrom(newCostBaseline), action.LCIDExpirationChangeNewCostBaseline)

	assert.EqualValues(t, &expirationDate, action.LCIDExpirationChangeNewDate)
	assert.EqualValues(t, &expirationDate, action.LCIDExpirationChangePreviousDate)

	assert.EqualValues(t, &nextSteps, action.LCIDExpirationChangeNewNextSteps)
	assert.EqualValues(t, &newScope, action.LCIDExpirationChangeNewScope)

	assert.EqualValues(t, models.ActionTypeCONFIRMLCID, action.ActionType)
}
func TestIsLCIDValidToConfirm(t *testing.T) {
	intakeWithoutLCID := models.SystemIntake{}

	err := IsLCIDValidToConfirm(&intakeWithoutLCID)
	assert.Error(t, err)

	intakeWithLCID := models.SystemIntake{
		LifecycleID: null.StringFrom("123456"),
	}

	err2 := IsLCIDValidToConfirm(&intakeWithLCID)
	assert.NoError(t, err2)

}
