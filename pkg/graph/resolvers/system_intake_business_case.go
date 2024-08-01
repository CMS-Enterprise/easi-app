package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func GetLifecycleCostLinesByBusinessCaseID(ctx context.Context, businessCaseID uuid.UUID) ([]*models.EstimatedLifecycleCost, error) {
	costlines, err := dataloaders.GetBusinessCaseLifecycleCostsByBizCaseID(ctx, businessCaseID)
	if err != nil {
		return nil, err
	}
	return costlines, nil
}
