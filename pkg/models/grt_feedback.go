package models

import (
	"time"

	"github.com/google/uuid"
)

// GRTFeedbackType indicates the recipient of GRT Feedback
type GRTFeedbackType string

const (
	// GRTFeedbackTypeBUSINESSOWNER captures enum value BUSINESS_OWNER
	GRTFeedbackTypeBUSINESSOWNER GRTFeedbackType = "BUSINESS_OWNER"

	// GRTFeedbackTypeGRB captures enum value GRB
	GRTFeedbackTypeGRB GRTFeedbackType = "GRB"
)

// GRTFeedback models GRT Feedback
type GRTFeedback struct {
	ID           uuid.UUID       `json:"id"`
	IntakeID     uuid.UUID       `db:"intake_id"`
	FeedbackType GRTFeedbackType `db:"feedback_type" json:"feedbackType"`
	CreatedAt    *time.Time      `db:"created_at"`
	UpdatedAt    *time.Time      `db:"updated_at"`
	Feedback     string
}
