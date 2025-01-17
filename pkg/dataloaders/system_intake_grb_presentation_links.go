package dataloaders

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (d *dataReader) batchSystemIntakeGRBPresentationLinksByIntakeIDs(ctx context.Context, systemIntakeIDs []uuid.UUID) ([]*models.SystemIntakeGRBPresentationLinks, []error) {
	return nil, nil
}

func GetSystemIntakeGRBPresentationLinksByIntakeID(ctx context.Context, systemIntakeID uuid.UUID) (*models.SystemIntakeGRBPresentationLinks, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil loaders in GetSystemIntakeGRBPresentationLinksByIntakeID")
	}

	return loaders.SystemIntakeGRBPresentationLinks.Load(ctx, systemIntakeID)
}
