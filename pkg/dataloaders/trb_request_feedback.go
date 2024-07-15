package dataloaders

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (d *dataReader) batchTRBRequestNewestFeedbackByTRBRequestIDs(ctx context.Context, trbRequestIDs []uuid.UUID) ([]*models.TRBRequestFeedback, []error) {
	data, err := d.db.GetNewestTRBRequestFeedbackByTRBRequestIDs(ctx, trbRequestIDs)
	if err != nil {
		return nil, []error{err}
	}

	return helpers.OneToOne(trbRequestIDs, data), nil
}

func GetNewestTRBRequestFeedbackByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) (*models.TRBRequestFeedback, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil dataloaders in GetNewestTRBRequestFeedbackByTRBRequestID")
	}

	return loaders.TRBRequestFeedbackNewest.Load(ctx, trbRequestID)
}

func (d *dataReader) batchTRBRequestFeedbackByTRBRequestIDs(ctx context.Context, trbRequestIDs []uuid.UUID) ([][]*models.TRBRequestFeedback, []error) {
	data, err := d.db.GetTRBRequestFeedbackByTRBRequestIDs(ctx, trbRequestIDs)
	if err != nil {
		return nil, []error{err}
	}

	return helpers.OneToMany(trbRequestIDs, data), nil
}

func GetTRBRequestFeedbackByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) ([]*models.TRBRequestFeedback, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil dataloaders in GetNewestTRBRequestFeedbackByTRBRequestID")
	}

	return loaders.TRBRequestFeedback.Load(ctx, trbRequestID)
}
