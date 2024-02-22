package dataloaders

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/graph-gophers/dataloader"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

// getSystemIntakeSystemsBySystemIntakeID uses a DataLoader to return many System Intake Systems by System Intake ID
func (loaders *DataLoaders) getSystemIntakeSystemsBySystemIntakeID(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	logger := appcontext.ZLogger(ctx)

	arrayCK := ConvertToKeyArgsArray(keys)
	marshaledParams, err := arrayCK.ToJSONArray()
	if err != nil {
		logger.Error("issue converting keys to JSON for data loader in System Intake Systems by system intake ID", zap.Error(err))
		return nil
	}

	output := make([]*dataloader.Result, len(keys))
	systemIntakeSystemsMap, err := loaders.DataReader.Store.SystemIntakeSystemsBySystemIntakeIDLOADER(ctx, marshaledParams)
	if err != nil {
		for i := range output {
			output[i] = &dataloader.Result{
				Error: err,
				Data:  nil,
			}
		}

		return output
	}

	// return in order requested
	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if !ok {
			output[index] = &dataloader.Result{Data: nil, Error: fmt.Errorf("could not retrieve system intake system by key %s", key.String())}
			continue
		}

		rawKey, ok := ck.Args["system_intake_id"]
		if !ok {
			output[index] = &dataloader.Result{Data: nil, Error: errors.New("args map missing system_intake_id key")}
			continue
		}

		resKey := fmt.Sprint(rawKey)
		systemIntakeSystems, ok := systemIntakeSystemsMap[resKey]
		if !ok {
			output[index] = &dataloader.Result{Data: nil, Error: fmt.Errorf("system intake system not found for id %s", resKey)}
			continue
		}

		output[index] = &dataloader.Result{Data: systemIntakeSystems, Error: nil}
	}

	return output
}

// GetSystemIntakeSystemsBySystemIntakeID will batch all requests for Systems based on System Intake ID and make a single request
func GetSystemIntakeSystemsBySystemIntakeID(ctx context.Context, systemIntakeID uuid.UUID) ([]*models.SystemIntakeSystem, error) {
	allLoaders := Loaders(ctx)
	loader := allLoaders.systemIntakeSystemsLoader

	key := NewKeyArgs()
	key.Args["system_intake_id"] = systemIntakeID

	thunk := loader.Loader.Load(ctx, key)
	result, err := thunk()
	if err != nil {
		return nil, err
	}

	return result.([]*models.SystemIntakeSystem), nil
}
