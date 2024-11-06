package lcidactions

import (
	"testing"
	"time"

	"github.com/guregu/null"
	"github.com/stretchr/testify/assert"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func TestIsLCIDValidToRetire(t *testing.T) {
	t.Run("Intake without an LCID issued is invalid", func(t *testing.T) {
		intake := models.SystemIntake{
			LifecycleID: null.StringFromPtr(nil),
		}

		err := IsLCIDValidToRetire(&intake)

		assert.Error(t, err)
	})

	t.Run("Intake with an LCID issued and with a retirement date already set is invalid", func(t *testing.T) {
		mockRetirementDate := time.Unix(0, 0)
		intake := models.SystemIntake{
			LifecycleID:        null.StringFrom("123456"),
			LifecycleRetiresAt: &mockRetirementDate,
		}

		err := IsLCIDValidToRetire(&intake)

		assert.Error(t, err)
	})

	t.Run("Intake with an LCID issued but no retirement date set is valid", func(t *testing.T) {
		intake := models.SystemIntake{
			LifecycleID:        null.StringFrom("234567"),
			LifecycleRetiresAt: nil,
		}

		err := IsLCIDValidToRetire(&intake)

		assert.NoError(t, err)
	})
}

func TestGetRetireLCIDAction(t *testing.T) {
	mockCurrentTime := time.Unix(0, 0)
	mockExpirationDate := mockCurrentTime.Add(time.Hour * 24 * 1)

	intake := models.SystemIntake{
		LifecycleID:        null.StringFrom("123456"),
		LifecycleExpiresAt: &mockExpirationDate,
	}

	mockNewRetirementDate := mockCurrentTime.Add(time.Hour * 24 * 2)
	userInfo := models.UserInfo{
		DisplayName: "tester",
		Email:       "test@email.email",
		Username:    "TEST",
	}

	action := GetRetireLCIDAction(intake, mockNewRetirementDate, userInfo)

	// action should show that retirement date wasn't set previously
	assert.Nil(t, action.LCIDRetirementChangePreviousDate)

	// action should show new retirement date
	assert.EqualValues(t, mockNewRetirementDate, *action.LCIDRetirementChangeNewDate)

	// action should have correct action type
	assert.EqualValues(t, models.ActionTypeRETIRELCID, action.ActionType)
}
