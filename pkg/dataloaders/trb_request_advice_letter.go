package dataloaders

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (d *dataReader) batchTRBRequestAdviceLettersByTRBRequestIDs(ctx context.Context, trbRequestIDs []uuid.UUID) ([]*models.TRBAdviceLetter, []error) {
	data, err := d.db.GetTRBAdviceLettersByTRBRequestIDs(ctx, trbRequestIDs)
	if err != nil {
		return nil, []error{err}
	}

	return helpers.OneToOne(trbRequestIDs, data), nil
}

func GetTRBAdviceLetterByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) (*models.TRBAdviceLetter, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil loaders in GetTRBAdviceLetterByTRBRequestID")
	}

	return loaders.TRBRequestAdviceLetter.Load(ctx, trbRequestID)
}
