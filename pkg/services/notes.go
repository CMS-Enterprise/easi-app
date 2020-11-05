package services

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// NewFetchNotes is a service to fetch all notes
// associated with a given SystemIntake
func NewFetchNotes(
	config Config,
	fetchBySystemIntakeID func(context.Context, uuid.UUID) ([]*models.Note, error),
	authorize func(context.Context) (bool, error),
) func(context.Context, uuid.UUID) ([]*models.Note, error) {
	return func(ctx context.Context, id uuid.UUID) ([]*models.Note, error) {
		ok, err := authorize(ctx)
		if err != nil {
			return nil, err
		}
		if !ok {
			return nil, &apperrors.ResourceNotFoundError{
				Err:      errors.New("failed to authorize fetch notes"),
				Resource: models.Note{},
			}
		}
		return fetchBySystemIntakeID(ctx, id)
	}
}
