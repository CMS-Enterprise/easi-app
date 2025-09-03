package dataloaders

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/samber/lo"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

func (d *dataReader) batchSystemIntakeContactsByID(ctx context.Context, ids []uuid.UUID) ([]*models.SystemIntakeContact, []error) {
	logger := appcontext.ZLogger(ctx)
	data, err := storage.SystemIntakeContactGetByIDsLoader(ctx, d.db, logger, ids)

	if err != nil {
		return nil, []error{err}
	}

	// We don't use the helper method here because it would expect the system_intake_id for the mapper value
	contactsByID := lo.Associate(data, func(c *models.SystemIntakeContact) (uuid.UUID, *models.SystemIntakeContact) {
		return c.ID, c
	})

	output := make([]*models.SystemIntakeContact, len(ids))
	for index, id := range ids {
		output[index] = contactsByID[id]
	}
	return output, nil

}

func GetSystemIntakeContactByID(ctx context.Context, systemIntakeID uuid.UUID) (*models.SystemIntakeContact, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil loaders in GetSystemIntakeContactByID")
	}

	return loaders.SystemIntakeContactsByID.Load(ctx, systemIntakeID)
}

func (d *dataReader) batchSystemIntakeContactsBySystemIntakeID(ctx context.Context, systemIntakeIDs []uuid.UUID) ([][]*models.SystemIntakeContact, []error) {
	logger := appcontext.ZLogger(ctx)
	data, err := storage.SystemIntakeContactGetBySystemIntakeIDsLoader(ctx, d.db, logger, systemIntakeIDs)

	if err != nil {
		return nil, []error{err}
	}

	return helpers.OneToMany(systemIntakeIDs, data), nil
}

func GetSystemIntakeContactBySystemIntakeID(ctx context.Context, systemIntakeID uuid.UUID) ([]*models.SystemIntakeContact, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil loaders in GetSystemIntakeContactBySystemIntakeID")
	}

	return loaders.SystemIntakeContactsBySystemIntakeID.Load(ctx, systemIntakeID)
}
