package lcidactions

import (
	"testing"

	"github.com/guregu/null"
	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/easi-app/pkg/models"
)

func TestIsIssueLCIDValid(t *testing.T) {
	t.Run("Issuing an LCID for an intake without an LCID value already set and with its decision state not set to LCID issued is valid", func(t *testing.T) {
		intake := models.SystemIntake{}

		err := IsIssueLCIDValid(&intake)

		assert.NoError(t, err)
	})

	t.Run("Issuing an LCID for an intake with an LCID value already set is invalid, even if its decision state isn't set to LCID issued", func(t *testing.T) {
		intake := models.SystemIntake{
			LifecycleID: null.StringFrom("123456"),
		}

		err := IsIssueLCIDValid(&intake)

		assert.Error(t, err)
	})

	t.Run("Issuing an LCID for an intake with its decision state set to LCID issued is invalid, even if the intake doesn't have an LCID value already set", func(t *testing.T) {
		intake := models.SystemIntake{
			DecisionState: models.SIDSLcidIssued,
		}

		err := IsIssueLCIDValid(&intake)

		assert.Error(t, err)
	})

	t.Run("Issuing an LCID for an intake with an LCID value already set and with its decision state set to LCID issued is invalid", func(t *testing.T) {
		intake := models.SystemIntake{
			LifecycleID:   null.StringFrom("123456"),
			DecisionState: models.SIDSLcidIssued,
		}

		err := IsIssueLCIDValid(&intake)

		assert.Error(t, err)
	})
}
