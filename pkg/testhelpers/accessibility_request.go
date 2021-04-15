package testhelpers

import (
	"github.com/cmsgov/easi-app/pkg/models"

	"github.com/google/uuid"
)

// NewAccessibilityRequest generates an test date to use in tests
func NewAccessibilityRequest(intakeID uuid.UUID) models.AccessibilityRequest {
	return models.AccessibilityRequest{
		IntakeID: intakeID,
		Name:     "My Accessibility Request",
	}
}
