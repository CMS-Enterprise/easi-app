package models

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestSystemIntakeContactComponentLCIDDisplayLabel(t *testing.T) {
	tests := []struct {
		name      string
		component *SystemIntakeContactComponent
		expected  string
	}{
		{
			name:      "known component returns acronym",
			component: systemIntakeContactComponentPtr(SystemIntakeContactComponentOfficeOfInformationTechnologyOit),
			expected:  "OIT",
		},
		{
			name:      "other returns OTHER",
			component: systemIntakeContactComponentPtr(SystemIntakeContactComponentOther),
			expected:  "OTHER",
		},
		{
			name:      "nil returns empty string",
			component: nil,
			expected:  "",
		},
		{
			name:      "placeholder returns empty string",
			component: systemIntakeContactComponentPtr(SystemIntakeContactComponentPLACEHOLDER),
			expected:  "",
		},
		{
			name:      "legacy component returns empty string",
			component: systemIntakeContactComponentPtr(SystemIntakeContactComponentConsortiumForMedicaidAndChildrensHealth),
			expected:  "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Equal(t, tt.expected, tt.component.LCIDDisplayLabel())
		})
	}
}

func systemIntakeContactComponentPtr(component SystemIntakeContactComponent) *SystemIntakeContactComponent {
	return &component
}
