package dataloaders

import (
	"context"
	"fmt"

	"github.com/graph-gophers/dataloader"
	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

// GetSystemIntakeContractNumbersBySystemIntakeID uses a DataLoader to return many System Intake Contract Numbers by System Intake ID
func (loaders *DataLoaders) GetSystemIntakeContractNumbersBySystemIntakeID(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	logger := appcontext.ZLogger(ctx)

	arrayCK := ConvertToKeyArgsArray(keys)
	marshaledParams, err := arrayCK.ToJSONArray()
	if err != nil {
		logger.Error("issue converting keys to JSON for data loader in System Intake Contract Numbers by system intake ID", zap.Error(err))
		return nil
	}

	output := make([]*dataloader.Result, len(keys))
	systemIntakeContractNumbers, err := loaders.DataReader.Store.SystemIntakeContractNumbersBySystemIntakeIDLOADER(ctx, marshaledParams)
	if err != nil {
		for i := range output {
			output[i] = &dataloader.Result{
				Error: err,
				Data:  nil,
			}
		}

		return output
	}

	contractNumbersBySystemIntakeIDs := lo.Associate(systemIntakeContractNumbers, func(systemIntakeContractNumber *models.SystemIntakeContractNumber) (string, *models.SystemIntakeContractNumber) {
		return systemIntakeContractNumber.ID.String(), systemIntakeContractNumber
	})

	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if ok {
			resKey := fmt.Sprint(ck.Args["system_intake_id"])
			systemIntakeContractNumber, ok := contractNumbersBySystemIntakeIDs[resKey]
			if ok {
				output[index] = &dataloader.Result{Data: systemIntakeContractNumber, Error: nil}
			} else {
				output[index] = &dataloader.Result{Data: nil, Error: fmt.Errorf("system intake contract number not found for id %s", resKey)}
			}

		} else {
			output[index] = &dataloader.Result{Data: nil, Error: fmt.Errorf("could not retrieve system intake contract number by key %s", key.String())}
		}
	}

	return output
}

// GetSystemIntakeContractNumberByID uses a DataLoader to return many System Intake Contract Numbers by ID
func (loaders *DataLoaders) GetSystemIntakeContractNumberByID(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	logger := appcontext.ZLogger(ctx)

	arrayCK := ConvertToKeyArgsArray(keys)
	marshaledParams, err := arrayCK.ToJSONArray()
	if err != nil {
		logger.Error("issue converting keys to JSON for data loader in System Intake Contract Numbers by IDs", zap.Error(err))
		return nil
	}

	output := make([]*dataloader.Result, len(keys))
	systemIntakeContractNumbers, err := loaders.DataReader.Store.SystemIntakeContractNumbersByIDLOADER(ctx, marshaledParams)
	if err != nil {
		for i := range output {
			output[i] = &dataloader.Result{
				Error: err,
				Data:  nil,
			}
		}

		return output
	}

	contractNumbersByIDs := lo.Associate(systemIntakeContractNumbers, func(systemIntakeContractNumber *models.SystemIntakeContractNumber) (string, *models.SystemIntakeContractNumber) {
		return systemIntakeContractNumber.ID.String(), systemIntakeContractNumber
	})

	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if ok {
			resKey := fmt.Sprint(ck.Args["id"])
			systemIntakeContractNumber, ok := contractNumbersByIDs[resKey]
			if ok {
				output[index] = &dataloader.Result{Data: systemIntakeContractNumber, Error: nil}
			} else {
				output[index] = &dataloader.Result{Data: nil, Error: fmt.Errorf("contract number not found for id %s", resKey)}
			}

		} else {
			output[index] = &dataloader.Result{Data: nil, Error: fmt.Errorf("could not retrieve contract number by key %s", key.String())}
		}
	}

	return output
}
