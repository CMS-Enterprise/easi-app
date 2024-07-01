package dataloaders

import (
	"context"
	"errors"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (d *dataReader) batchCedarSystemLinkedSystemIntakes(ctx context.Context, requests []models.SystemIntakesByCedarSystemIDsRequest) ([][]*models.SystemIntake, []error) {
	return nil, nil
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
