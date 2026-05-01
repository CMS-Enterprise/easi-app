package dataloaders

import (
	"context"
	"errors"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (d *dataReader) batchSystemIntakesWithLCIDs(ctx context.Context, keys []bool) ([][]*models.SystemIntake, []error) {
	intakes, err := d.db.GetSystemIntakesWithLCIDs(ctx)
	if err != nil {
		return nil, []error{err}
	}

	output := make([][]*models.SystemIntake, len(keys))
	for i := range keys {
		output[i] = intakes
	}

	return output, nil
}

func GetSystemIntakesWithLCIDs(ctx context.Context) ([]*models.SystemIntake, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil dataloaders in GetSystemIntakesWithLCIDs")
	}

	return loaders.SystemIntakesWithLCIDs.Load(ctx, true)
}
