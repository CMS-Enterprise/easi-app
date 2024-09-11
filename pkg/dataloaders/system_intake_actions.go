package dataloaders

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (d *dataReader) batchSystemIntakeActionsBySystemIntakeIDs(ctx context.Context, systemIntakeIDs []uuid.UUID) ([][]*models.Action, []error) {
	data, err := d.db.GetActionsBySystemIntakeIDs(ctx, systemIntakeIDs)
	if err != nil {
		return nil, []error{err}
	}

	return helpers.OneToMany(systemIntakeIDs, data), nil
}

func GetSystemIntakeActionsBySystemIntakeID(ctx context.Context, systemIntakeID uuid.UUID) ([]*models.Action, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil loaders in GetSystemIntakeActionsBySystemIntakeIDs")
	}

	return loaders.SystemIntakeActions.Load(ctx, systemIntakeID)
}
