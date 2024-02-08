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

// getSystemIntakeContractNumbersBySystemIntakeID uses a DataLoader to return many System Intake Contract Numbers by System Intake ID
func (loaders *DataLoaders) getSystemIntakeContractNumbersBySystemIntakeID(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	logger := appcontext.ZLogger(ctx)

	arrayCK := ConvertToKeyArgsArray(keys)
	marshaledParams, err := arrayCK.ToJSONArray()
	if err != nil {
		logger.Error("issue converting keys to JSON for data loader in System Intake Contract Numbers by system intake ID", zap.Error(err))
		return nil
	}

	output := make([]*dataloader.Result, len(keys))
	systemIntakeContractNumbersMap, err := loaders.DataReader.Store.SystemIntakeContractNumbersBySystemIntakeIDLOADER(ctx, marshaledParams)
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
			output[index] = &dataloader.Result{Data: nil, Error: fmt.Errorf("could not retrieve system intake contract number by key %s", key.String())}
			continue
		}

		rawKey, ok := ck.Args["system_intake_id"]
		if !ok {
			output[index] = &dataloader.Result{Data: nil, Error: errors.New("args map missing system_intake_id key")}
			continue
		}

		resKey := fmt.Sprint(rawKey)
		systemIntakeContractNumbers, ok := systemIntakeContractNumbersMap[resKey]
		if !ok {
			output[index] = &dataloader.Result{Data: nil, Error: fmt.Errorf("system intake contract number not found for id %s", resKey)}
			continue
		}

		output[index] = &dataloader.Result{Data: systemIntakeContractNumbers, Error: nil}
	}

	return output
}

// GetSystemIntakeContractNumbersBySystemIntakeID will batch all requests for Contract Numbers based on System Intake ID and make a single request
func GetSystemIntakeContractNumbersBySystemIntakeID(ctx context.Context, systemIntakeID uuid.UUID) ([]*models.SystemIntakeContractNumber, error) {
	allLoaders := Loaders(ctx)
	loader := allLoaders.systemIntakeContractNumbersLoader

	key := NewKeyArgs()
	key.Args["system_intake_id"] = systemIntakeID

	thunk := loader.Loader.Load(ctx, key)
	result, err := thunk()
	if err != nil {
		return nil, err
	}

	return result.([]*models.SystemIntakeContractNumber), nil
}
