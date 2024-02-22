package dataloaders

import (
	"context"
	"fmt"

	"github.com/graph-gophers/dataloader"
	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/authentication"
)

// GetUserAccountsByIDLoader Uses a DataLoader to return many User Accounts by ID
func (loaders *DataLoaders) GetUserAccountsByIDLoader(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	dr := loaders.DataReader

	logger := appcontext.ZLogger(ctx)
	arrayCK := ConvertToKeyArgsArray(keys)
	marshaledParams, err := arrayCK.ToJSONArray()
	if err != nil {
		logger.Error("issue converting keys to JSON for data loader in User Account", zap.Error(err))
	}
	output := make([]*dataloader.Result, len(keys))

	userAccounts, err2 := dr.Store.UserAccountGetByIDLOADER(logger, marshaledParams)
	if err2 != nil { //IF THERE IS A DB error, return error for every result
		for _, result := range output {
			result.Error = err2
			result.Data = nil
		}
		return output
	}

	userByID := lo.Associate(userAccounts, func(user *authentication.UserAccount) (string, *authentication.UserAccount) { //TRANSLATE TO MAP
		return user.ID.String(), user
	})

	// RETURN IN THE SAME ORDER REQUESTED

	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if ok {
			resKey := fmt.Sprint(ck.Args["id"])
			user, ok := userByID[resKey]
			if ok {
				output[index] = &dataloader.Result{Data: user, Error: nil}
			} else {
				err := fmt.Errorf("user account not found for id %s", resKey)
				output[index] = &dataloader.Result{Data: nil, Error: err}
			}
		} else {
			err := fmt.Errorf("could not retrive key from %s", key.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}

	return output
}
