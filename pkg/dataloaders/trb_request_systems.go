package dataloaders

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (d *dataReader) batchTRBRequestSystemsByTRBRequestIDs(ctx context.Context, trbRequestIDs []uuid.UUID) ([][]*models.TRBRequestSystem, []error) {
	data, err := d.db.TRBRequestSystemsByTRBRequestIDs(ctx, trbRequestIDs)
	if err != nil {
		return nil, []error{err}
	}

	return helpers.OneToMany(trbRequestIDs, data), nil
}

func GetTRBRequestSystemsByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) ([]*models.TRBRequestSystem, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil dataloaders in GetTRBRequestSystemsByTRBRequestID")
	}

	return loaders.TRBRequestSystems.Load(ctx, trbRequestID)
}
