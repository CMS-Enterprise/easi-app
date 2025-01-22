package dataloaders

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (d *dataReader) batchSystemIntakeGRBPresentationLinksByIntakeIDs(ctx context.Context, systemIntakeIDs []uuid.UUID) ([]*models.SystemIntakeGRBPresentationLinks, []error) {
	data, err := d.db.SystemIntakeGRBPresentationLinksByIntakeIDs(ctx, systemIntakeIDs)
	if err != nil {
		return nil, []error{err}
	}

	return helpers.OneToOne(systemIntakeIDs, data), nil
}

func GetSystemIntakeGRBPresentationLinksByIntakeID(ctx context.Context, systemIntakeID uuid.UUID) (*models.SystemIntakeGRBPresentationLinks, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil loaders in GetSystemIntakeGRBPresentationLinksByIntakeID")
	}

	return loaders.SystemIntakeGRBPresentationLinks.Load(ctx, systemIntakeID)
}
