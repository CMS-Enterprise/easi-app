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

// getTRBRequestSystemsByTRBRequestID uses a DataLoader to return many TRB Request Systems by TRB Request ID
func (loaders *DataLoaders) getTRBRequestSystemsByTRBRequestID(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	logger := appcontext.ZLogger(ctx)

	arrayCK := ConvertToKeyArgsArray(keys)
	marshaledParams, err := arrayCK.ToJSONArray()
	if err != nil {
		logger.Error("issue converting keys to JSON for data loader in TRB Request Systems by TRB Request ID", zap.Error(err))
		return nil
	}

	output := make([]*dataloader.Result, len(keys))
	trbRequestSystemsMap, err := loaders.DataReader.Store.TRBRequestSystemsByTRBRequestIDLOADER(ctx, marshaledParams)
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
			output[index] = &dataloader.Result{Data: nil, Error: fmt.Errorf("could not retrieve trb request system by key %s", key.String())}
			continue
		}

		rawKey, ok := ck.Args["trb_request_id"]
		if !ok {
			output[index] = &dataloader.Result{Data: nil, Error: errors.New("args map missing trb_request_id key")}
			continue
		}

		resKey := fmt.Sprint(rawKey)
		trbRequestSystems, ok := trbRequestSystemsMap[resKey]
		if !ok {
			output[index] = &dataloader.Result{Data: nil, Error: fmt.Errorf("trb request system not found for id %s", resKey)}
			continue
		}

		output[index] = &dataloader.Result{Data: trbRequestSystems, Error: nil}
	}

	return output
}

// GetTRBRequestSystemsByTRBRequestID will batch all requests for Systems based on trb request ID and make a single request
func GetTRBRequestSystemsByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) ([]*models.TRBRequestSystem, error) {
	allLoaders := Loaders(ctx)
	loader := allLoaders.trbRequestSystemsLoader

	key := NewKeyArgs()
	key.Args["trb_request_id"] = trbRequestID

	thunk := loader.Loader.Load(ctx, key)
	result, err := thunk()
	if err != nil {
		return nil, err
	}

	return result.([]*models.TRBRequestSystem), nil
}
