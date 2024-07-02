package dataloaders

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (d *dataReader) batchTRBRequestContractNumbersByTRBRequestIDs(ctx context.Context, trbRequestIDs []uuid.UUID) ([][]*models.TRBRequestContractNumber, []error) {
	data, err := d.db.TRBRequestContractNumbersByTRBRequestIDs(ctx, trbRequestIDs)
	if err != nil {
		return nil, []error{err}
	}

	return helpers.OneToMany[*models.TRBRequestContractNumber](trbRequestIDs, data), nil
}

func GetTRBRequestContractNumbersByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) ([]*models.TRBRequestContractNumber, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil loaders in GetTRBRequestContractNumbersByTRBRequestID")
	}

	return loaders.TRBRequestContractNumbers.Load(ctx, trbRequestID)
}
