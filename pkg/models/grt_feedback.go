package models

import (
	"time"

	"github.com/google/uuid"
)

// GRTFeedback models GRT Feedback
type GRTFeedback struct {
	ID        uuid.UUID  `json:"id"`
	IntakeID  uuid.UUID  `db:"intake_id"`
	CreatedAt *time.Time `db:"created_at"`
	UpdatedAt *time.Time `db:"updated_at"`
	Feedback  string
}
