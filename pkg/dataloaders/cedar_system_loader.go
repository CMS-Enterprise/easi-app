package dataloaders

import (
	"context"
	"fmt"

	"github.com/graph-gophers/dataloader"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

const cedar_system_loader_key = "id"

func (loaders *DataLoaders) getCedarSystemBatchFunction(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	logger := appcontext.ZLogger(ctx)
	cedarSystems, err := loaders.GetCedarSystems(ctx)
	if err != nil {
		logger.Error("error getting cedar systems in data loader", zap.Error(err))
		loaderErrors := make([]*dataloader.Result, len(keys))
		for index := range keys {
			loaderErrors[index] = &dataloader.Result{Data: nil, Error: err}
		}
		return loaderErrors
	}

	systemSummaryMap := make(map[string]*models.CedarSystem)
	for _, sys := range cedarSystems {
		if sys != nil {
			systemSummaryMap[sys.ID.String] = sys
		}
	}
	output := make([]*dataloader.Result, len(keys))

	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if ok {
			resKey := fmt.Sprint(ck.Args[cedar_system_loader_key])
			cedarSystem, ok := systemSummaryMap[resKey]
			if ok {
				output[index] = &dataloader.Result{Data: cedarSystem, Error: nil}
			} else {
				err := fmt.Errorf("cedar system not found for id %s", resKey)
				output[index] = &dataloader.Result{Data: nil, Error: err}
			}
		} else {
			err := fmt.Errorf("could not retrive key from %s", key.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}

	return output
}

func GetCedarSystemByID(ctx context.Context, id string) (*models.CedarSystem, error) {
	allLoaders := Loaders(ctx)
	cedarSystemLoader := allLoaders.cedarSystemByIDLoader

	key := NewKeyArgs()
	key.Args[cedar_system_loader_key] = id

	thunk := cedarSystemLoader.Loader.Load(ctx, key)
	result, err := thunk()
	if err != nil {
		return nil, err
	}

	system, isCedarSystem := result.(*models.CedarSystem)
	if !isCedarSystem {
		return nil, fmt.Errorf("result is not a cedar system it is Type %T", system)
	}

	return system, nil
}
