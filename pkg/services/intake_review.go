package services

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// NewAuthorizeReviewIntake is a service to authorize ReviewIntake
func NewAuthorizeReviewIntake() func(context context.Context, review *models.IntakeReview) (bool, error) {
	return func(context context.Context, review *models.IntakeReview) (bool, error) {
		return true, nil
	}
}

// NewReviewIntake is a service to process an intake review
func NewReviewIntake(
	authorize func(context context.Context, review *models.IntakeReview) (bool, error),
	fetch func(id uuid.UUID) (*models.SystemIntake, error),
) func(ctx context.Context, review *models.IntakeReview) error {
	return func(ctx context.Context, review *models.IntakeReview) error {
		existingIntake, fetchErr := fetch(review.IntakeID)
		if fetchErr != nil {
			return &apperrors.QueryError{
				Err:       fetchErr,
				Operation: apperrors.QueryFetch,
				Model:     existingIntake,
			}
		}
		ok, err := authorize(ctx, review)
		if err != nil {
			return err
		}
		if !ok {
			return &apperrors.UnauthorizedError{Err: err}
		}

		if existingIntake.Status != models.SystemIntakeStatusSUBMITTED {
			valErr := apperrors.NewValidationError(
				errors.New("system intake failed validation"),
				models.SystemIntake{},
				existingIntake.ID.String())
			return &valErr
		}

		switch review.Decision {
		case models.IntakeReviewDecisionISSUEID:
			existingIntake.Status = models.SystemIntakeStatusAPPROVED
		case models.IntakeReviewDecisionREVIEWNEEDED:
			existingIntake.Status = models.SystemIntakeStatusACCEPTED
		case models.IntakeReviewDecisionGOVERNANCENOTNEEDED:
			existingIntake.Status = models.SystemIntakeStatusCLOSED
		}
		return nil
	}
}
