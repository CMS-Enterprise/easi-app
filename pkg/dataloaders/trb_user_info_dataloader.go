package dataloaders

import (
	"context"
	"fmt"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/graph-gophers/dataloader"
)

// UserInfoFetcher reads Users from a database
type UserInfoFetcher struct {
	FetchUserInfos func(context.Context, []string) ([]*models.UserInfo, error)
}

// BatchUserInfos implements a batch function to populate UserInfo for EUA IDs
func (u *UserInfoFetcher) BatchUserInfos(
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
	userInfos, err := u.FetchUserInfos(ctx, euas)
	if err != nil {
		return results
	}

	for _, userInfo := range userInfos {
		euaUserInfoMap[userInfo.EuaUserID] = userInfo
	}

	for i, key := range keys {
		if userInfo, ok := euaUserInfoMap[key.String()]; ok {
			results[i] = &dataloader.Result{Data: userInfo, Error: nil}
		} else {
			err := fmt.Errorf("No user info found for EUA ID %s", key.String())
			results[i] = &dataloader.Result{Data: nil, Error: err}
		}
	}
	return results
}

// GetUserInfo pulls the user info from the map that was loaded
func GetUserInfo(ctx context.Context, euaID string) (*models.UserInfo, error) {
	loaders := For(ctx)
	thunk := loaders.UserInfoLoader.Load(ctx, dataloader.StringKey(euaID))
	result, err := thunk()
	if err != nil {
		return nil, err
	}
	return result.(*models.UserInfo), nil
}
