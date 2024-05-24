package dataloaders2

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (d *dataReader) getSystemIntakeSystemsBySystemIntakeID(ctx context.Context, systemIntakeIDs []uuid.UUID) ([][]*models.SystemIntakeSystem, []error) {
	return nil, nil
}

func GetSystemIntakeSystemsBySystemIntakeID(ctx context.Context, systemIntakeID uuid.UUID) ([]*models.SystemIntakeSystem, error) {
	loaders := loadersFromCTX(ctx)
	if loaders == nil {
		return nil, errors.New("unexpected nil loaders in GetSystemIntakeSystemsBySystemIntakeID")
	}

	return loaders.SystemIntakeSystems.Load(ctx, systemIntakeID)
}
