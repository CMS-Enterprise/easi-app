package dataloaders

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (d *dataReader) batchSystemIntakeGRBReviewersBySystemIntakeIDs(ctx context.Context, systemIntakeIDs []uuid.UUID) ([][]*models.SystemIntakeGRBReviewer, []error) {
	data, err := d.db.SystemIntakeGRBReviewersBySystemIntakeIDs(ctx, systemIntakeIDs)
	if err != nil {
		return nil, []error{err}
	}

	return helpers.OneToMany(systemIntakeIDs, data), nil
}

func GetSystemIntakeGRBReviewersBySystemIntakeID(ctx context.Context, systemIntakeID uuid.UUID) ([]*models.SystemIntakeGRBReviewer, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil loaders in GetSystemIntakeGRBReviewersBySystemIntakeID")
	}

	return loaders.SystemIntakeGRBReviewers.Load(ctx, systemIntakeID)
}
