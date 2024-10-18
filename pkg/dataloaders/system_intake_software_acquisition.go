package dataloaders

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (d *dataReader) batchSystemIntakeSoftwareAcquisitionBySystemIntakeIDs(ctx context.Context, systemIntakeIDs []uuid.UUID) ([]*models.SystemIntakeSoftwareAcquisition, []error) {
	data, err := d.db.FetchSystemIntakeSoftwareAcquisitionByIntakeIDs(ctx, systemIntakeIDs)
	if err != nil {
		return nil, []error{err}
	}

	return helpers.OneToOne(systemIntakeIDs, data), nil
}

func GetSystemIntakeSoftwareAcquisitionBySystemIntakeID(ctx context.Context, systemIntakeID uuid.UUID) (*models.SystemIntakeSoftwareAcquisition, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil loaders in GetSystemIntakeSoftwareAcquisitionBySystemIntakeID")
	}
	return loaders.SystemIntakeSoftwareAcquisition.Load(ctx, systemIntakeID)
}
