package services

import (
	"context"
	"errors"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/graph/model"
)

// NewCreateTestDate is a service to create a 508 test date
func NewCreateTestDate(
	config Config,
	authorize func(context.Context) (bool, error),
	create func(context.Context, *model.TestDate) (*model.TestDate, error),
) func(context.Context, *model.TestDate) (*model.TestDate, error) {
	return func(ctx context.Context, testDate *model.TestDate) (*model.TestDate, error) {
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
