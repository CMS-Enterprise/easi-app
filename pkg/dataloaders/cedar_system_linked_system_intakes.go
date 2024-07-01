package dataloaders

import (
	"context"
	"errors"

	"github.com/cmsgov/easi-app/pkg/models"
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

	store := map[string][]*models.SystemIntake{}

	for _, req := range requests {
		store[req.CedarSystemID] = []*models.SystemIntake{}
	}

	for _, item := range data {
		store[item.CedarSystemID] = append(store[item.CedarSystemID], item.SystemIntake)
	}

	var out [][]*models.SystemIntake
	for _, req := range requests {
		out = append(out, store[req.CedarSystemID])
	}

	return out, nil
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
