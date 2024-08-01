package dataloaders

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (d *dataReader) batchTRBRequestFormSystemIntakesByTRBRequestIDs(ctx context.Context, trbRequestIDs []uuid.UUID) ([][]*models.SystemIntake, []error) {
	data, err := d.db.GetTRBRequestFormSystemIntakesByTRBRequestIDs(ctx, trbRequestIDs)
	if err != nil {
		return nil, []error{err}
	}

	return helpers.OneToMany(trbRequestIDs, data), nil
}

func GetTRBRequestFormSystemIntakesByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) ([]*models.SystemIntake, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil dataloaders in GetTRBRequestFormSystemsIntakesByTRBRequestID")
	}

	return loaders.TRBRequestFormSystemIntakes.Load(ctx, trbRequestID)
}
