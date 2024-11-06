package lcidactions

import (
	"testing"
	"time"

	"github.com/guregu/null"
	"github.com/stretchr/testify/assert"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func TestGetBaseLCIDAction(t *testing.T) {
	lcid := null.StringFrom("123456")
	oldCostBaseline := null.StringFrom("$3")
	newCostBaseline := "$2"
	expirationDate := time.Now()    //same for both
	newRetirementDate := time.Now() // will be passed into the action, won't be set on intake beforehand
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

	action := getBaseLCIDAction(intake, &expirationDate, &nextSteps, &newScope, &newCostBaseline, userInfo, &newRetirementDate)

	// old cost baseline set in Previous field
	assert.EqualValues(t, oldCostBaseline, action.LCIDExpirationChangePreviousCostBaseline)
	// new cost baseline set in New field
	assert.EqualValues(t, null.StringFrom(newCostBaseline), action.LCIDExpirationChangeNewCostBaseline)

	// same expiration date is set in both Previous and New fields (was unchanged in input)
	assert.EqualValues(t, &expirationDate, action.LCIDExpirationChangePreviousDate)
	assert.EqualValues(t, &expirationDate, action.LCIDExpirationChangeNewDate)

	// new next steps set in New field (wasn't set beforehand)
	assert.EqualValues(t, &nextSteps, action.LCIDExpirationChangeNewNextSteps)

	// new scope set in New field (wasn't set beforehand)
	assert.EqualValues(t, &newScope, action.LCIDExpirationChangeNewScope)

	// new retirement date set in New field (wasn't set beforehand)
	assert.EqualValues(t, &newRetirementDate, action.LCIDRetirementChangeNewDate)
}
