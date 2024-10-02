package dataloaders

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (d *dataReader) batchTRBRequestAdviceLettersByTRBRequestIDs(ctx context.Context, trbRequestIDs []uuid.UUID) ([]*models.TRBGuidanceLetter, []error) {
	data, err := d.db.GetTRBGuidanceLettersByTRBRequestIDs(ctx, trbRequestIDs)
	if err != nil {
		return nil, []error{err}
	}

	return helpers.OneToOne(trbRequestIDs, data), nil
}

func GetTRBGuidanceLetterByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) (*models.TRBGuidanceLetter, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil loaders in GetTRBGuidanceLetterByTRBRequestID")
	}

	return loaders.TRBRequestAdviceLetter.Load(ctx, trbRequestID)
}
