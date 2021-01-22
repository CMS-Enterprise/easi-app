package services

import (
	"context"
	"errors"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// NewFetchSystems returns a function that will fetch all the existing systems
func NewFetchSystems(
	config Config,
	fetchAll func(context.Context) ([]*models.System, error),
	authorize func(context.Context) (bool, error),
) func(context.Context) ([]*models.System, error) {
	return func(ctx context.Context) ([]*models.System, error) {
		ok, err := authorize(ctx)
		if err != nil {
			return nil, err
		}
		if !ok {
			return nil, &apperrors.UnauthorizedError{Err: errors.New("failed to authorize fetch systems")}
		}
		return fetchAll(ctx)
	}
}
