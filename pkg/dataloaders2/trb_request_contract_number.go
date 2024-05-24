package dataloaders2

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (d *dataReader) getTRBRequestContractNumbersByTRBRequestID(ctx context.Context, trbRequestIDs []uuid.UUID) ([][]*models.TRBRequestContractNumber, []error) {
	return nil, nil
}

func GetTRBRequestContractNumbersByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) ([]*models.TRBRequestContractNumber, error) {
	loaders := loadersFromCTX(ctx)
	if loaders == nil {
		return nil, errors.New("unexpected nil loaders in GetTRBRequestContractNumbersByTRBRequestID")
	}

	return loaders.TRBRequestContractNumbers.Load(ctx, trbRequestID)
}
