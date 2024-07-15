package dataloaders

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (d *dataReader) batchTRBRequestFormsByTRBRequestIDs(ctx context.Context, trbRequestIDs []uuid.UUID) ([]*models.TRBRequestForm, []error) {
	data, err := d.db.GetTRBRequestFormsByTRBRequestIDs(ctx, trbRequestIDs)
	if err != nil {
		return nil, []error{err}
	}

	return helpers.OneToOne(trbRequestIDs, data), nil
}

func GetTRBRequestFormByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) (*models.TRBRequestForm, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil loaders in GetTRBRequestFormsByTRBRequestID")
	}

	return loaders.TRBRequestForm.Load(ctx, trbRequestID)
}
