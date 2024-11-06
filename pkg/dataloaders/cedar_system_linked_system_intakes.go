package dataloaders

import (
	"context"
	"errors"

	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (d *dataReader) batchCedarSystemLinkedSystemIntakes(ctx context.Context, requests []models.SystemIntakesByCedarSystemIDsRequest) ([][]*models.SystemIntake, []error) {
	data, err := d.db.SystemIntakesByCedarSystemIDs(ctx, requests)
	if err != nil {
		return nil, []error{err}
	}

	ids := make([]string, len(requests))
	for i := range requests {
		ids[i] = requests[i].CedarSystemID
	}

	return helpers.OneToMany(ids, data), nil
}

func GetCedarSystemLinkedSystemIntakes(ctx context.Context, cedarSystemID string, state models.SystemIntakeState) ([]*models.SystemIntake, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil loaders in GetCedarSystemLinkedSystemIntakes")
	}

	return loaders.CedarSystemLinkedSystemIntakes.Load(ctx, models.SystemIntakesByCedarSystemIDsRequest{
		CedarSystemID: cedarSystemID,
		State:         state,
	})
}
