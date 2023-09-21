package lcidactions

import (
	"testing"
	"time"

	"github.com/guregu/null"
	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/easi-app/pkg/models"
)

func TestGetRetireLCIDAction(t *testing.T) {
	mockCurrentTime := time.Unix(0, 0)
	mockExpirationDate := mockCurrentTime.Add(time.Hour * 24 * 1)

	intake := models.SystemIntake{
		LifecycleID:        null.StringFrom("123456"),
		LifecycleExpiresAt: &mockExpirationDate,
	}

	mockNewRetirementDate := mockCurrentTime.Add(time.Hour * 24 * 2)
	userInfo := models.UserInfo{
		CommonName: "tester",
		Email:      "test@email.email",
		EuaUserID:  "TEST",
	}

	action := GetRetireLCIDAction(intake, mockNewRetirementDate, userInfo)

	// action should show that retirement date wasn't set previously
	assert.Nil(t, action.LCIDRetirementChangePreviousDate)

	// action should show new retirement date
	assert.EqualValues(t, mockNewRetirementDate, *action.LCIDRetirementChangeNewDate)

	// action should have correct action type
	assert.EqualValues(t, models.ActionTypeRETIRELCID, action.ActionType)
}
