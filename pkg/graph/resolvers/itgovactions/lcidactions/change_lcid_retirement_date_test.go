package lcidactions

import (
	"testing"
	"time"

	"github.com/guregu/null"
	"github.com/stretchr/testify/assert"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func TestIsLCIDValidToChangeRetirementDate(t *testing.T) {
	t.Run("Intake without an LCID issued is invalid (even if it somehow has a retirement date set)", func(t *testing.T) {
		mockRetirementDate := time.Unix(0, 0)
		intake := models.SystemIntake{
			LifecycleID:        null.StringFromPtr(nil),
			LifecycleRetiresAt: &mockRetirementDate,
		}

		err := IsLCIDValidToChangeRetirementDate(&intake)

		assert.Error(t, err)
	})

	t.Run("Intake with an LCID issued, but with no retirement date set, is invalid", func(t *testing.T) {
		intake := models.SystemIntake{
			LifecycleID:        null.StringFrom("234567"),
			LifecycleRetiresAt: nil,
		}

		err := IsLCIDValidToChangeRetirementDate(&intake)

		assert.Error(t, err)
	})

	t.Run("Intake with an LCID issued and with a retirement date set is valid", func(t *testing.T) {
		mockRetirementDate := time.Unix(0, 0)
		intake := models.SystemIntake{
			LifecycleID:        null.StringFrom("123456"),
			LifecycleRetiresAt: &mockRetirementDate,
		}

		err := IsLCIDValidToChangeRetirementDate(&intake)

		assert.NoError(t, err)
	})
}

func TestGetChangeLCIDRetirementDateAction(t *testing.T) {
	mockCurrentTime := time.Unix(0, 0)
	mockExpirationDate := mockCurrentTime.Add(time.Hour * 24 * 1)

	intake := models.SystemIntake{
		LifecycleID:        null.StringFrom("123456"),
		LifecycleExpiresAt: &mockExpirationDate,
	}

	mockPreviousRetirementDate := mockCurrentTime.Add(time.Hour * 24 * 1)
	intake.LifecycleRetiresAt = &mockPreviousRetirementDate

	mockNewRetirementDate := mockCurrentTime.Add(time.Hour * 24 * 2)
	userInfo := models.UserInfo{
		DisplayName: "tester",
		Email:       "test@email.email",
		Username:    "TEST",
	}

	action := GetChangeLCIDRetirementDateAction(intake, mockNewRetirementDate, userInfo)

	// action should show that retirement date was previously set to the previous date
	assert.EqualValues(t, mockPreviousRetirementDate, *action.LCIDRetirementChangePreviousDate)

	// action should show new retirement date
	assert.EqualValues(t, mockNewRetirementDate, *action.LCIDRetirementChangeNewDate)

	// action should have correct action type
	assert.EqualValues(t, models.ActionTypeCHANGELCIDRETIREMENTDATE, action.ActionType)
}
