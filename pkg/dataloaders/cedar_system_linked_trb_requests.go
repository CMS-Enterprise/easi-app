package dataloaders

import (
	"context"
	"errors"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (d *dataReader) batchCedarSystemLinkedTRBRequests(ctx context.Context, requests []models.TRBRequestsByCedarSystemIDsRequest) ([][]*models.TRBRequest, []error) {
	data, err := d.db.TRBRequestsByCedarSystemIDs(ctx, requests)
	if err != nil {
		return nil, []error{err}
	}

	ids := make([]string, len(requests))
	for i := range requests {
		ids[i] = requests[i].CedarSystemID
	}

	store := map[string][]*models.TRBRequest{}

	for _, req := range requests {
		store[req.CedarSystemID] = []*models.TRBRequest{}
	}

	for _, item := range data {
		store[item.CedarSystemID] = append(store[item.CedarSystemID], item.TRBRequest)
	}

	var out [][]*models.TRBRequest
	for _, req := range requests {
		out = append(out, store[req.CedarSystemID])
	}

	return out, nil
}

func GetCedarSystemLinkedTRBRequests(ctx context.Context, cedarSystemID string, state models.TRBRequestState) ([]*models.TRBRequest, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil loaders in GetCedarSystemLinkedTRBRequests")
	}

	return loaders.CedarSystemLinkedTRBRequests.Load(ctx, models.TRBRequestsByCedarSystemIDsRequest{
		CedarSystemID: cedarSystemID,
		State:         state,
	})
}
