package resolvers

import (
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
	"github.com/stretchr/testify/assert"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func TestFormatLCIDDisplay(t *testing.T) {
	issuedAt := time.Date(2026, time.June, 15, 0, 0, 0, 0, time.UTC)
	lcidType := models.LCIDTypeNewSystem
	recompeteType := models.LCIDTypeRecompete
	shortened := true
	lowIT := true
	notShortened := false
	notLowIT := false
	component := models.SystemIntakeContactComponentOfficeOfInformationTechnologyOit

	tests := []struct {
		name      string
		intake    *models.SystemIntake
		component *models.SystemIntakeContactComponent
		expected  *string
	}{
		{
			name: "full metadata",
			intake: &models.SystemIntake{
				ID:                uuid.New(),
				LifecycleID:       null.StringFrom("123456"),
				LifecycleIssuedAt: &issuedAt,
				LCIDType:          &lcidType,
				LCIDIsShortened:   &shortened,
				LCIDIsLowIT:       &lowIT,
			},
			component: &component,
			expected:  stringPtr("123456 - 2026 - OIT - NEW_SYSTEM - SHORTENED - LOW_IT"),
		},
		{
			name: "partial metadata omits missing values",
			intake: &models.SystemIntake{
				ID:                uuid.New(),
				LifecycleID:       null.StringFrom("654321"),
				LifecycleIssuedAt: &issuedAt,
				LCIDIsShortened:   &shortened,
			},
			expected: stringPtr("654321 - 2026 - SHORTENED"),
		},
		{
			name: "false booleans are omitted",
			intake: &models.SystemIntake{
				ID:                uuid.New(),
				LifecycleID:       null.StringFrom("111111"),
				LifecycleIssuedAt: &issuedAt,
				LCIDType:          &recompeteType,
				LCIDIsShortened:   &notShortened,
				LCIDIsLowIT:       &notLowIT,
			},
			component: &component,
			expected:  stringPtr("111111 - 2026 - OIT - RECOMPETE"),
		},
		{
			name: "missing lcid returns nil",
			intake: &models.SystemIntake{
				ID:                uuid.New(),
				LifecycleIssuedAt: &issuedAt,
				LCIDType:          &lcidType,
			},
			component: &component,
			expected:  nil,
		},
		{
			name: "raw lcid is included when all other metadata is missing",
			intake: &models.SystemIntake{
				ID:          uuid.New(),
				LifecycleID: null.StringFrom("222222"),
			},
			expected: stringPtr("222222"),
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Equal(t, tt.expected, formatLCIDDisplay(tt.intake, tt.component))
		})
	}
}

func TestRawLCIDValueUnchanged(t *testing.T) {
	lcid := "123456"
	intake := &models.SystemIntake{
		LifecycleID: null.StringFrom(lcid),
	}

	assert.Equal(t, &lcid, intake.LifecycleID.Ptr())
}

func stringPtr(value string) *string {
	return &value
}
