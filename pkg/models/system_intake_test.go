package models

import (
	"testing"
	"time"

	"github.com/guregu/null"
	"github.com/stretchr/testify/assert"
)

func TestLCIDStatus(t *testing.T) {
	mockCurrentTime := time.Unix(0, 0)
	yesterday := mockCurrentTime.Add(time.Hour * -24)
	tomorrow := mockCurrentTime.Add(time.Hour * 24)

	t.Run("LCID status is nil if no LCID exists", func(t *testing.T) {
		intake := &SystemIntake{
			LifecycleID: null.StringFromPtr(nil),
		}

		lcidStatus := intake.LCIDStatus(mockCurrentTime)

		assert.Nil(t, lcidStatus)
	})

	t.Run("LCID status is ISSUED if LCID exists (but hasn't been retired) and expiration date has *not* been reached", func(t *testing.T) {
		intake := &SystemIntake{
			LifecycleID:        null.StringFrom("123456"),
			LifecycleExpiresAt: &tomorrow,
			LifecycleRetiresAt: nil,
		}

		lcidStatus := intake.LCIDStatus(mockCurrentTime)

		assert.NotNil(t, lcidStatus)
		assert.EqualValues(t, SystemIntakeLCIDStatusIssued, *lcidStatus)
	})

	t.Run("LCID status is EXPIRED if LCID exists (but hasn't been retired) and expiration date *has* been reached", func(t *testing.T) {
		intake := &SystemIntake{
			LifecycleID:        null.StringFrom("234567"),
			LifecycleExpiresAt: &yesterday,
			LifecycleRetiresAt: nil,
		}

		lcidStatus := intake.LCIDStatus(mockCurrentTime)

		assert.NotNil(t, lcidStatus)
		assert.EqualValues(t, SystemIntakeLCIDStatusExpired, *lcidStatus)
	})

	t.Run("LCID status is RETIRED if LCID exists and has been retired and the expiration date hasn't been reached", func(t *testing.T) {
		intake := &SystemIntake{
			LifecycleID:        null.StringFrom("345678"),
			LifecycleExpiresAt: &tomorrow,
			LifecycleRetiresAt: &yesterday,
		}

		lcidStatus := intake.LCIDStatus(mockCurrentTime)

		assert.NotNil(t, lcidStatus)
		assert.EqualValues(t, SystemIntakeLCIDStatusRetired, *lcidStatus)
	})

	t.Run("LCID status is RETIRED if LCID exists and has been retired, even if expiration date has been reached", func(t *testing.T) {
		intake := &SystemIntake{
			LifecycleID:        null.StringFrom("456789"),
			LifecycleExpiresAt: &yesterday,
			LifecycleRetiresAt: &yesterday,
		}

		lcidStatus := intake.LCIDStatus(mockCurrentTime)

		assert.NotNil(t, lcidStatus)
		assert.EqualValues(t, SystemIntakeLCIDStatusRetired, *lcidStatus)
	})
}
