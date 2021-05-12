package testhelpers

import (
	"time"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
)

// NewGRTFeedback generates a feedback to use in tests
func NewGRTFeedback() models.GRTFeedback {
	now := time.Now().UTC()
	return models.GRTFeedback{
		ID:           uuid.New(),
		CreatedAt:    &now,
		UpdatedAt:    &now,
		FeedbackType: models.GRTFeedbackTypeGRB,
		Feedback:     "Fake Feedback",
	}
}
