package models

import (
	"time"

	"github.com/google/uuid"
)

// AccessibilityRequestDeletionReason is why an accessibility request was marked as deleted
type AccessibilityRequestDeletionReason string

const (
	// AccessibilityRequestDeletionReasonIncorrectApplicationAndLifecycleID ...
	AccessibilityRequestDeletionReasonIncorrectApplicationAndLifecycleID AccessibilityRequestDeletionReason = "INCORRECT_APPLICATION_AND_LIFECYCLE_ID"
	// AccessibilityRequestDeletionReasonNoTestingNeeded ...
	AccessibilityRequestDeletionReasonNoTestingNeeded AccessibilityRequestDeletionReason = "NO_TESTING_NEEDED"
	// AccessibilityRequestDeletionReasonOther ...
	AccessibilityRequestDeletionReasonOther AccessibilityRequestDeletionReason = "OTHER"
)

// AccessibilityRequest models a 508 request
type AccessibilityRequest struct {
	ID             uuid.UUID                           `json:"id"`
	Name           string                              `json:"name"`
	IntakeID       uuid.UUID                           `db:"intake_id"`
	CreatedAt      *time.Time                          `db:"created_at" gqlgen:"submittedAt"`
	UpdatedAt      *time.Time                          `db:"updated_at"`
	EUAUserID      string                              `json:"euaUserId" db:"eua_user_id"`
	DeletedAt      *time.Time                          `db:"deleted_at" json:"deletedAt"`
	DeletionReason *AccessibilityRequestDeletionReason `db:"deletion_reason"`
}

// AccessibilityRequestMetrics models metrics about accessibility requests
type AccessibilityRequestMetrics struct {
	StartTime               time.Time `json:"start_time"`
	EndTime                 time.Time `json:"end_time"`
	CreatedAndOpen          int       `json:"created_and_open"`
	CreatedAndClosed        int       `json:"created_and_closed"`
	CreatedAndInRemediation int       `json:"created_and_in_remediation"`
}
