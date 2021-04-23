package testhelpers

import (
	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
)

// NewAccessibilityRequestDocument generates a document to use in tests
func NewAccessibilityRequestDocument(requestID uuid.UUID) *models.AccessibilityRequestDocument {
	return &models.AccessibilityRequestDocument{
		RequestID:          requestID,
		CommonDocumentType: models.AccessibilityRequestDocumentCommonTypeAwardedVpat,
	}
}
