package dataloaders

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (d *dataReader) getCedarSystemsByIDs(ctx context.Context, cedarSystemIDs []uuid.UUID) ([]*models.CedarSystem, []error) {
	data, err := d.getCedarSystems(ctx)
	if err != nil {
		return nil, []error{err}
	}

	store := map[uuid.UUID]*models.CedarSystem{}

	for _, sys := range data {
		if sys != nil {
			store[sys.IDAsUUID] = sys
		}
	}

	var out []*models.CedarSystem
	for _, id := range cedarSystemIDs {
		if val, ok := store[id]; ok {
			out = append(out, val)
		}
	}

	return out, nil
}

func GetCedarSystemByID(ctx context.Context, cedarSystemID uuid.UUID) (*models.CedarSystem, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil dataloaders in GetCedarSystemByID")
	}

	return loaders.GetCedarSystem.Load(ctx, cedarSystemID)
}
