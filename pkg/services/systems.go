package services

import (
	"context"
	"errors"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/graph/model"
)

// NewFetchSystems returns a function that will fetch all the existing systems
func NewFetchSystems(
	config Config,
	fetchAll func(context.Context) ([]*model.System, error),
	authorize func(context.Context) (bool, error),
) func(context.Context) ([]*model.System, error) {
	return func(ctx context.Context) ([]*model.System, error) {
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
