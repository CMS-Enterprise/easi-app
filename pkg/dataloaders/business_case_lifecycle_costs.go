package dataloaders

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (d *dataReader) batchBusinessCaseLifecycleCostsByBizCaseIDs(ctx context.Context, businessCaseIDs []uuid.UUID) ([][]*models.EstimatedLifecycleCost, []error) {
	data, err := d.db.GetLifecycleCostsByBizCaseIDs(ctx, businessCaseIDs)
	if err != nil {
		return nil, []error{err}
	}

	return helpers.OneToMany(businessCaseIDs, data), nil
}

func GetBusinessCaseLifecycleCostsByBizCaseID(ctx context.Context, businessCaseID uuid.UUID) ([]*models.EstimatedLifecycleCost, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil loaders in GetBusinessCaseLifecycleCosts")
	}

	return loaders.BusinessCaseLifecycleCosts.Load(ctx, businessCaseID)
}
