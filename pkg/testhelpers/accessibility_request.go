package testhelpers

import (
	"github.com/cmsgov/easi-app/pkg/models"

	"github.com/google/uuid"
)

// NewAccessibilityRequest generates an test date to use in tests
func NewAccessibilityRequest(intakeID uuid.UUID) models.AccessibilityRequest {
	return models.AccessibilityRequest{
		IntakeID:  intakeID,
		Name:      "My Accessibility Request",
		EUAUserID: RandomEUAID(),
	}
}

// NewAccessibilityRequestForUser generates an test date to use in tests
func NewAccessibilityRequestForUser(intakeID uuid.UUID, euaID string) models.AccessibilityRequest {
	return models.AccessibilityRequest{
		IntakeID:  intakeID,
		Name:      "My Accessibility Request",
		EUAUserID: euaID,
	}
}
