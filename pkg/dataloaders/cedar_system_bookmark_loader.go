package dataloaders

import (
	"context"
	"errors"
	"fmt"

	"github.com/graph-gophers/dataloader"

	"github.com/cmsgov/easi-app/pkg/appcontext"
)

func (loaders *DataLoaders) getBookmarkedCEDARSystems(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	logger := appcontext.ZLogger(ctx)

	arrayCK := ConvertToKeyArgsArray(keys)
	marshaledParams, err := arrayCK.ToJSONArray()
	if err != nil {
		logger.Error("issue converting keys to JSON for data loader in Bookmarked CEDAR Systems")
		return nil
	}

	output := make([]*dataloader.Result, len(keys))
	bookmarkMap, err := loaders.DataReader.Store.FetchCedarSystemIsBookmarkedLOADER(ctx, marshaledParams)
	if err != nil {
		for i := range output {
			output[i] = &dataloader.Result{
				Error: err,
				Data:  nil,
			}
		}

		return output
	}

	if bookmarkMap == nil {
		bookmarkMap = map[string]struct{}{}
	}

	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if !ok {
			output[index] = &dataloader.Result{Data: nil, Error: fmt.Errorf("could not retrieve bookmarked system by key %s", key.String())}
			continue
		}

		rawKey, ok := ck.Args["cedar_system_id"]
		if !ok {
			output[index] = &dataloader.Result{Data: nil, Error: errors.New("args map missing cedar_system_id")}
			continue
		}

		resKey := fmt.Sprint(rawKey)
		_, ok = bookmarkMap[resKey]

		output[index] = &dataloader.Result{Data: ok, Error: nil}
	}

	return output
}

func GetCedarSystemIsBookmarked(ctx context.Context, cedarSystemId string) (bool, error) {
	allLoaders := Loaders(ctx)
	loader := allLoaders.cedarSystemIsBookmarked

	key := NewKeyArgs()
	key.Args["cedar_system_id"] = cedarSystemId
	key.Args["eua_user_id"] = appcontext.Principal(ctx).ID()

	thunk := loader.Loader.Load(ctx, key)
	result, err := thunk()
	if err != nil {
		return false, err
	}

	return result.(bool), nil
}
