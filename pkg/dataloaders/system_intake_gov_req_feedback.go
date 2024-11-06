package dataloaders

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (d *dataReader) batchSystemIntakeGovReqFeedbackByIntakeIDs(ctx context.Context, systemIntakeIDs []uuid.UUID) ([][]*models.GovernanceRequestFeedback, []error) {
	data, err := d.db.GetGovernanceRequestFeedbacksByIntakeIDs(ctx, systemIntakeIDs)
	if err != nil {
		return nil, []error{err}
	}

	return helpers.OneToMany(systemIntakeIDs, data), nil
}

func GetSystemIntakeGovReqFeedbackByIntakeID(ctx context.Context, systemIntakeID uuid.UUID) ([]*models.GovernanceRequestFeedback, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil loaders in GetSystemIntakeGovReqFeedbackByIntakeID")
	}

	return loaders.SystemIntakeGovReqFeedback.Load(ctx, systemIntakeID)
}
