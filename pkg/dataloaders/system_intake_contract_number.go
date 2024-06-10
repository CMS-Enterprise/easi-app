package dataloaders

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/helpers"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (d *dataReader) getSystemIntakeContractNumbersBySystemIntakeID(ctx context.Context, systemIntakeIDs []uuid.UUID) ([][]*models.SystemIntakeContractNumber, []error) {
	data, err := d.db.SystemIntakeContractNumbersBySystemIntakeIDs(ctx, systemIntakeIDs)
	if err != nil {
		return nil, []error{err}
	}

	return helpers.OneToMany[*models.SystemIntakeContractNumber](systemIntakeIDs, data), nil
}

func GetSystemIntakeContractNumbersBySystemIntakeID(ctx context.Context, systemIntakeID uuid.UUID) ([]*models.SystemIntakeContractNumber, error) {
	loaders := loadersFromCTX(ctx)
	if loaders == nil {
		return nil, errors.New("unexpected nil loaders in GetSystemIntakeContractNumbersBySystemIntakeIDs")
	}

	return loaders.SystemIntakeContractNumbers.Load(ctx, systemIntakeID)
}
