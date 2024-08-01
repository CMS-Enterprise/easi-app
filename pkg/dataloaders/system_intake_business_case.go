package dataloaders

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (d *dataReader) batchSystemIntakeBusinessCaseByIntakeIDs(ctx context.Context, systemIntakeIDs []uuid.UUID) ([]*models.BusinessCase, []error) {
	data, err := d.db.GetBusinessCaseBySystemIntakeIDs(ctx, systemIntakeIDs)
	if err != nil {
		return nil, []error{err}
	}

	return helpers.OneToOne(systemIntakeIDs, data), nil
}

func GetSystemIntakeBusinessCaseBySystemIntakeID(ctx context.Context, systemIntakeID uuid.UUID) (*models.BusinessCase, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil loaders in GetSystemIntakeBusinessCaseBySystemIntakeIDs")
	}

	return loaders.SystemIntakeBusinessCase.Load(ctx, systemIntakeID)
}
