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

func SystemIntakeContactGetByID(ctx context.Context, systemIntakeID uuid.UUID) (*models.SystemIntakeContact, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil loaders in GetSystemIntakeContactByID")
	}

	return loaders.SystemIntakeContactsByID.Load(ctx, systemIntakeID)
}

// SystemIntakeContactGetRequester is a utility helper method which will parse the contacts for a system intake and return the requester contact if they exist
func SystemIntakeContactGetRequester(ctx context.Context, id uuid.UUID) (*models.SystemIntakeContact, error) {
	contacts, err := SystemIntakeContactsGetBySystemIntakeID(ctx, id)
	if err != nil {
		return nil, err
	}
	return contacts.Requester()
}

func (d *dataReader) batchSystemIntakeContactsBySystemIntakeID(ctx context.Context, systemIntakeIDs []uuid.UUID) ([][]*models.SystemIntakeContact, []error) {
	logger := appcontext.ZLogger(ctx)
	data, err := storage.SystemIntakeContactGetBySystemIntakeIDsLoader(ctx, d.db, logger, systemIntakeIDs)

	if err != nil {
		return nil, []error{err}
	}

	return helpers.OneToMany(systemIntakeIDs, data), nil
}

// SystemIntakeContactGetBySystemIntakeID returns all contacts for a given system intake ID in their basic form from the database
func SystemIntakeContactGetBySystemIntakeID(ctx context.Context, systemIntakeID uuid.UUID) ([]*models.SystemIntakeContact, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil loaders in GetSystemIntakeContactBySystemIntakeID")
	}

	return loaders.SystemIntakeContactsBySystemIntakeID.Load(ctx, systemIntakeID)
}

// SystemIntakeContactsGetBySystemIntakeID fetches contacts for a system intake and wraps them in the systemIntakeContacts struct
func SystemIntakeContactsGetBySystemIntakeID(ctx context.Context, systemIntakeID uuid.UUID) (*models.SystemIntakeContacts, error) {
	contacts, err := SystemIntakeContactGetBySystemIntakeID(ctx, systemIntakeID)
	if err != nil {
		return nil, err
	}
	// Wrap the returned type, so we can calculate additional information on it.
	return &models.SystemIntakeContacts{
		AllContacts: contacts,
	}, nil
}
