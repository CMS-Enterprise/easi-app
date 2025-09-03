package dataloaders

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

func (d *dataReader) batchSystemIntakeContactsByID(ctx context.Context, ids []uuid.UUID) ([]*models.SystemIntakeContact, []error) {
	data, err := storage.SystemIntakeContactGetByIDsLoader(ctx, d.db, nil, ids)

	if err != nil {
		return nil, []error{err}
	}

	return helpers.OneToOne(ids, data), nil
}

func GetSystemIntakeContactByID(ctx context.Context, systemIntakeID uuid.UUID) (*models.SystemIntakeContact, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil loaders in GetSystemIntakeContactByID")
	}

	return loaders.SystemIntakeContacts.Load(ctx, systemIntakeID)
}
