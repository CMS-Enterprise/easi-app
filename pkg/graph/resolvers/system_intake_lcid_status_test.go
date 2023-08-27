package resolvers

import (
	"testing"
	"time"

	"github.com/guregu/null"
	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
)

// TODO - make this more table-driven?
func TestCalculateSystemIntakeLCIDStatus(t *testing.T) {
	mockCurrentTime := time.Unix(0, 0)
	yesterday := mockCurrentTime.Add(time.Hour * -24)
	tomorrow := mockCurrentTime.Add(time.Hour * 24)

	t.Run("LCID status is nil if no LCID exists", func(t *testing.T) {
		intake := &models.SystemIntake{
			LifecycleID: null.StringFromPtr(nil),
		}

		lcidStatus := CalculateSystemIntakeLCIDStatus(intake, mockCurrentTime)

		assert.Nil(t, lcidStatus)
	})

	t.Run("LCID status is ISSUED if LCID exists (but hasn't been retired) and expiration date has *not* been reached", func(t *testing.T) {
		intake := &models.SystemIntake{
			LifecycleID:        null.StringFrom("123456"),
			LifecycleExpiresAt: &tomorrow,
			IsLCIDRetired:      false,
		}

		lcidStatus := CalculateSystemIntakeLCIDStatus(intake, mockCurrentTime)

		assert.NotNil(t, lcidStatus)
		assert.EqualValues(t, model.SystemIntakeLCIDStatusIssued, *lcidStatus)
	})

	t.Run("LCID status is EXPIRED if LCID exists (but hasn't been retired) and expiration date *has* been reached", func(t *testing.T) {
		intake := &models.SystemIntake{
			LifecycleID:        null.StringFrom("234567"),
			LifecycleExpiresAt: &yesterday,
			IsLCIDRetired:      false,
		}

		lcidStatus := CalculateSystemIntakeLCIDStatus(intake, mockCurrentTime)

		assert.NotNil(t, lcidStatus)
		assert.EqualValues(t, model.SystemIntakeLCIDStatusExpired, *lcidStatus)
	})

	t.Run("LCID status is RETIRED if LCID exists and has been retired and the expiration date hasn't been reached", func(t *testing.T) {
		intake := &models.SystemIntake{
			LifecycleID:        null.StringFrom("345678"),
			LifecycleExpiresAt: &tomorrow,
			IsLCIDRetired:      true,
		}

		lcidStatus := CalculateSystemIntakeLCIDStatus(intake, mockCurrentTime)

		assert.NotNil(t, lcidStatus)
		assert.EqualValues(t, model.SystemIntakeLCIDStatusRetired, *lcidStatus)
	})

	t.Run("LCID status is RETIRED if LCID exists and has been retired, even if expiration date has been reached", func(t *testing.T) {
		intake := &models.SystemIntake{
			LifecycleID:        null.StringFrom("456789"),
			LifecycleExpiresAt: &yesterday,
			IsLCIDRetired:      true,
		}

		lcidStatus := CalculateSystemIntakeLCIDStatus(intake, mockCurrentTime)

		assert.NotNil(t, lcidStatus)
		assert.EqualValues(t, model.SystemIntakeLCIDStatusRetired, *lcidStatus)
	})
}
