package dataloaders

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/helpers"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (d *dataReader) getTRBRequestSystemsByTRBRequestID(ctx context.Context, trbRequestIDs []uuid.UUID) ([][]*models.TRBRequestSystem, []error) {
	data, err := d.db.TRBRequestSystemsByTRBRequestIDs(ctx, trbRequestIDs)
	if err != nil {
		return nil, []error{err}
	}

	return helpers.OneToMany[*models.TRBRequestSystem](trbRequestIDs, data), nil
}

func GetTRBRequestSystemsByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) ([]*models.TRBRequestSystem, error) {
	loaders := loadersFromCTX(ctx)
	if loaders == nil {
		return nil, errors.New("unexpected nil dataloaders in GetTRBRequestSystemsByTRBRequestID")
	}

	return loaders.TRBRequestSystems.Load(ctx, trbRequestID)
}
