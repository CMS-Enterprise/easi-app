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

func (loaders *DataLoaders) getTRBRequestContractNumbersByTRBRequestID(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	logger := appcontext.ZLogger(ctx)

	arrayCK := ConvertToKeyArgsArray(keys)
	marshaledParams, err := arrayCK.ToJSONArray()
	if err != nil {
		logger.Error("issue converting keys to JSON for data loader in TRB request Contract Numbers by TRB request ID", zap.Error(err))
		return nil
	}

	output := make([]*dataloader.Result, len(keys))
	trbRequestContractNumbersMap, err := loaders.DataReader.Store.TRBRequestContractNumbersByTRBRequestIDLOADER(ctx, marshaledParams)
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
			output[index] = &dataloader.Result{Data: nil, Error: fmt.Errorf("could not retrieve TRB request contract number by key %s", key.String())}
			continue
		}

		rawKey, ok := ck.Args["trb_request_id"]
		if !ok {
			output[index] = &dataloader.Result{Data: nil, Error: errors.New("args map missing trb_request_id key")}
			continue
		}

		resKey := fmt.Sprint(rawKey)
		trbRequestContractNumbers, ok := trbRequestContractNumbersMap[resKey]
		if !ok {
			output[index] = &dataloader.Result{Data: nil, Error: fmt.Errorf("TRB request contract number not found for id %s", resKey)}
			continue
		}

		output[index] = &dataloader.Result{Data: trbRequestContractNumbers, Error: nil}
	}

	return output
}

// GetTRBRequestContractNumbersByTRBRequestID will batch all requests for Contract Numbers based on TRB Request ID and make a single request
func GetTRBRequestContractNumbersByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) ([]*models.TRBRequestContractNumber, error) {
	allLoaders := Loaders(ctx)
	loader := allLoaders.trbRequestContractNumbersLoader

	key := NewKeyArgs()
	key.Args["trb_request_id"] = trbRequestID

	thunk := loader.Loader.Load(ctx, key)
	result, err := thunk()
	if err != nil {
		return nil, err
	}

	return result.([]*models.TRBRequestContractNumber), nil
}
