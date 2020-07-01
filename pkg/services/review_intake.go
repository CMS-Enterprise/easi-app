package services

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
)

// NewReviewIntake is a service to process an intake review
func NewReviewIntake(
	fetch func(id uuid.UUID) (*models.SystemIntake, error),
) func(context context.Context, review *models.IntakeReview) error {
	return func(context context.Context, review *models.IntakeReview) error {
		existingIntake, fetchErr := fetch(review.IntakeID)

		return nil
	}
}
