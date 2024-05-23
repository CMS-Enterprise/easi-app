package dataloaders2

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (d *dataReader) getSystemIntakeContractNumbersBySystemIntakeID(ctx context.Context, systemIntakeIDs []uuid.UUID) ([][]*models.SystemIntakeContractNumber, []error) {
	return d.db.SystemIntakeContractNumbersBySystemIntakeIDLOADER2(ctx, systemIntakeIDs)
}

func GetSystemIntakeContractNumbersBySystemIntakeID(ctx context.Context, systemIntakeID uuid.UUID) ([]*models.SystemIntakeContractNumber, error) {
	loaders := loaders(ctx)
	if loaders == nil {
		return nil, errors.New("unexpected nil loaders in GetSystemIntakeContractNumbersBySystemIntakeIDs")
	}

	return loaders.SystemIntakeContractNumbers.Load(ctx, systemIntakeID)
}
