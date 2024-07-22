package dataloaders

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (d *dataReader) batchTRBFundingSourcesByTRBRequestIDs(ctx context.Context, trbRequestIDs []uuid.UUID) ([][]*models.TRBFundingSource, []error) {
	data, err := d.db.GetTRBFundingSourcesByRequestIDs(ctx, trbRequestIDs)
	if err != nil {
		return nil, []error{err}
	}

	return helpers.OneToMany(trbRequestIDs, data), nil
}

func GetTRBFundingSourcesByRequestID(ctx context.Context, trbRequestID uuid.UUID) ([]*models.TRBFundingSource, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil loaders in GetTRBFundingSourcesByRequestID")
	}

	return loaders.TRBFundingSources.Load(ctx, trbRequestID)
}
