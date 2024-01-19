package dataloaders

import (
	"context"
	"fmt"

	"github.com/graph-gophers/dataloader"

	"github.com/cmsgov/easi-app/pkg/models"
)

// BatchUserInfos implements a batch function to populate UserInfo for EUA IDs
func (loaders *DataLoaders) BatchUserInfos(
	ctx context.Context,
	keys dataloader.Keys,
) []*dataloader.Result {
	results := make([]*dataloader.Result, len(keys))
	euas := make([]string, len(keys))
	for i, key := range keys {
		euas[i] = key.String()
	}

	// Maps EUAs to UserInfo structs
	euaUserInfoMap := map[string]*models.UserInfo{}
	userInfos, err := loaders.FetchUserInfos(ctx, euas)
	if err != nil {
		return results
	}

	for _, userInfo := range userInfos {
		euaUserInfoMap[userInfo.Username] = userInfo
	}

	for i, key := range keys {
		if userInfo, ok := euaUserInfoMap[key.String()]; ok {
			results[i] = &dataloader.Result{Data: userInfo, Error: nil}
		} else {
			err := fmt.Errorf("no user info found for EUA ID %s", key.String())
			results[i] = &dataloader.Result{Data: nil, Error: err}
		}
	}
	return results
}

// GetUserInfo pulls the user info from the map that was loaded
// the UserInfoLoader will batch up all requests for user info over a window of 16ms, then make a single request containing all of the EUA IDs
func GetUserInfo(ctx context.Context, euaID string) (*models.UserInfo, error) {
	allLoaders := Loaders(ctx)
	userInfoLoader := allLoaders.UserInfoLoader

	thunk := userInfoLoader.Loader.Load(ctx, dataloader.StringKey(euaID))
	result, err := thunk()
	if err != nil {
		return nil, err
	}
	return result.(*models.UserInfo), nil
}
