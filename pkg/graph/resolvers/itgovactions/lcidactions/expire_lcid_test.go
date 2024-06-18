package lcidactions

import (
	"testing"
	"time"

	"github.com/guregu/null"
	"github.com/stretchr/testify/assert"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func TestIsIntakeValidToExpireLCID(t *testing.T) {
	t.Run("Intake without an LCID issued is invalid", func(t *testing.T) {
		intake := models.SystemIntake{}

		err := IsIntakeValidToExpireLCID(&intake, time.Now())

		assert.Error(t, err)
	})

	t.Run("Intake without an LCID expiration date set is invalid", func(t *testing.T) {
		// set an LCID, but no expiration date
		// this shouldn't happen in practice, but we should still handle it gracefully
		intake := models.SystemIntake{
			LifecycleID: null.StringFrom("123456"),
		}

		err := IsIntakeValidToExpireLCID(&intake, time.Now())

		assert.Error(t, err)
	})

	t.Run("Intake that's expired (expiration date is in the past) is invalid", func(t *testing.T) {
		mockCurrentTime := time.Unix(0, 0)
		mockPastDate := mockCurrentTime.Add(time.Hour * -24 * 2)
		intake := models.SystemIntake{
			LifecycleID:        null.StringFrom("123456"),
			LifecycleExpiresAt: &mockPastDate,
		}

		err := IsIntakeValidToExpireLCID(&intake, mockCurrentTime)

		assert.Error(t, err)
	})

	t.Run("Intake with an expiration date in the future is valid", func(t *testing.T) {
		mockCurrentTime := time.Unix(0, 0)
		mockFutureDate := mockCurrentTime.Add(time.Hour * 24 * 2)
		intake := models.SystemIntake{
			LifecycleID:        null.StringFrom("123456"),
			LifecycleExpiresAt: &mockFutureDate,
		}

		err := IsIntakeValidToExpireLCID(&intake, mockCurrentTime)

		assert.NoError(t, err)
	})
}

func TestGetExpireLCIDAction(t *testing.T) {
	mockCurrentTime := time.Unix(0, 0)
	mockFutureDate := mockCurrentTime.Add(time.Hour * 24 * 2)

	intake := models.SystemIntake{
		LifecycleID:           null.StringFrom("123456"),
		LifecycleExpiresAt:    &mockFutureDate,
		DecisionNextSteps:     models.HTMLPointer("enjoy your new system!"),
		LifecycleScope:        models.HTMLPointer("testing Expire LCID action, nothing else"),
		LifecycleCostBaseline: null.StringFrom("$1"),
	}

	newNextSteps := models.HTML("new next steps")
	userInfo := models.UserInfo{
		DisplayName: "tester",
		Email:       "test@email.email",
		Username:    "TEST",
	}

	action := GetExpireLCIDAction(intake, mockCurrentTime, &newNextSteps, userInfo)

	// all "Previous" fields should match the intake's fields
	// (using EqualValues() is ok for comparing two pointers; the assert library will compare the values they point to)
	assert.EqualValues(t, intake.LifecycleExpiresAt, action.LCIDExpirationChangePreviousDate)
	assert.EqualValues(t, intake.DecisionNextSteps, action.LCIDExpirationChangePreviousNextSteps)
	assert.EqualValues(t, intake.LifecycleScope, action.LCIDExpirationChangePreviousScope)
	assert.EqualValues(t, intake.LifecycleCostBaseline, action.LCIDExpirationChangePreviousCostBaseline)

	// action should show new expiration date
	assert.EqualValues(t, mockCurrentTime, *action.LCIDExpirationChangeNewDate)

	// action should show new next steps
	assert.EqualValues(t, newNextSteps, *action.LCIDExpirationChangeNewNextSteps)

	// action shouldn't show changes in scope or cost baseline
	assert.EqualValues(t, intake.LifecycleScope, action.LCIDExpirationChangeNewScope)
	assert.EqualValues(t, intake.LifecycleCostBaseline, action.LCIDExpirationChangeNewCostBaseline)

	// action should have correct action type
	assert.EqualValues(t, models.ActionTypeEXPIRELCID, action.ActionType)
}
