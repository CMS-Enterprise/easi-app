package dataloaders

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (d *dataReader) batchSystemIntakeFundingSourcesBySystemIntakeIDs(ctx context.Context, systemIntakeIDs []uuid.UUID) ([][]*models.SystemIntakeFundingSource, []error) {
	data, err := d.db.FetchSystemIntakeFundingSourcesByIntakeIDs(ctx, systemIntakeIDs)
	if err != nil {
		return nil, []error{err}
	}

	return helpers.OneToMany(systemIntakeIDs, data), nil
}

func GetSystemIntakeFundingSourceBySystemIntakeID(ctx context.Context, systemIntakeID uuid.UUID) ([]*models.SystemIntakeFundingSource, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil loaders in GetSystemIntakeFundingSourcesBySystemIntakeID")
	}

	return loaders.SystemIntakeFundingSources.Load(ctx, systemIntakeID)
}
