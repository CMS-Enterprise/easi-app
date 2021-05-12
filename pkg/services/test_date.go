package services

import (
	"context"
	"errors"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// NewCreateTestDate is a service to create a 508 test date
func NewCreateTestDate(
	config Config,
	authorize func(context.Context) (bool, error),
	create func(context.Context, *models.TestDate) (*models.TestDate, error),
) func(context.Context, *models.TestDate) (*models.TestDate, error) {
	return func(ctx context.Context, testDate *models.TestDate) (*models.TestDate, error) {
		ok, err := authorize(ctx)
		if err != nil {
			return nil, err
		}
		if !ok {
			return nil, &apperrors.UnauthorizedError{Err: errors.New("failed to authorize create test date")}
		}
		return create(ctx, testDate)
	}
}
