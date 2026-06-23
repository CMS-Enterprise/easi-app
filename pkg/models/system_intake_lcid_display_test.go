package models

import (
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
	"github.com/stretchr/testify/assert"
)

func TestSystemIntakeLcidDisplay(t *testing.T) {
	issuedAt := time.Date(2026, time.June, 15, 0, 0, 0, 0, time.UTC)
	lcidType := LCIDTypeNewSystem
	recompeteType := LCIDTypeRecompete
	shortened := true
	lowIT := true
	notShortened := false
	notLowIT := false
	component := SystemIntakeContactComponentOfficeOfInformationTechnologyOit

	tests := []struct {
		name     string
		intake   *SystemIntake
		expected *string
	}{
		{
			name: "full metadata",
			intake: &SystemIntake{
				ID:                uuid.New(),
				LifecycleID:       null.StringFrom("123456"),
				LifecycleIssuedAt: &issuedAt,
				LCIDType:          &lcidType,
				LCIDComponent:     &component,
				LCIDIsShortened:   &shortened,
				LCIDIsLowIT:       &lowIT,
			},
			expected: stringPtr("123456-OIT-NEW-S-L"),
		},
		{
			name: "partial metadata omits missing values",
			intake: &SystemIntake{
				ID:                uuid.New(),
				LifecycleID:       null.StringFrom("654321"),
				LifecycleIssuedAt: &issuedAt,
				LCIDIsShortened:   &shortened,
			},
			expected: stringPtr("654321-S"),
		},
		{
			name: "missing saved component omits component",
			intake: &SystemIntake{
				ID:                uuid.New(),
				LifecycleID:       null.StringFrom("333333"),
				LifecycleIssuedAt: &issuedAt,
				LCIDType:          &lcidType,
			},
			expected: stringPtr("333333-NEW"),
		},
		{
			name: "false booleans are omitted",
			intake: &SystemIntake{
				ID:                uuid.New(),
				LifecycleID:       null.StringFrom("111111"),
				LifecycleIssuedAt: &issuedAt,
				LCIDType:          &recompeteType,
				LCIDComponent:     &component,
				LCIDIsShortened:   &notShortened,
				LCIDIsLowIT:       &notLowIT,
			},
			expected: stringPtr("111111-OIT-RC"),
		},
		{
			name: "missing lcid returns nil",
			intake: &SystemIntake{
				ID:                uuid.New(),
				LifecycleIssuedAt: &issuedAt,
				LCIDType:          &lcidType,
			},
			expected: nil,
		},
		{
			name: "raw lcid is included when all other metadata is missing",
			intake: &SystemIntake{
				ID:          uuid.New(),
				LifecycleID: null.StringFrom("222222"),
			},
			expected: stringPtr("222222"),
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Equal(t, tt.expected, tt.intake.LcidDisplay())
		})
	}
}

func TestSystemIntakeRawLCIDValueUnchanged(t *testing.T) {
	lcid := "123456"
	intake := &SystemIntake{
		LifecycleID: null.StringFrom(lcid),
	}

	assert.Equal(t, &lcid, intake.LifecycleID.Ptr())
}

func stringPtr(value string) *string {
	return &value
}
