package lcidactions

import (
	"testing"
	"time"

	"github.com/guregu/null"
	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/easi-app/pkg/models"
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
