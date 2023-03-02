package resolvers

import (
	"context"
	"fmt"
	"net/http"

	"github.com/graph-gophers/dataloader"

	"github.com/cmsgov/easi-app/pkg/models"
)

// Loaders wrap your data loaders to inject via middleware
type Loaders struct {
	UserInfoLoader *dataloader.Loader
}

type ctxKey string

const (
	loadersKey = ctxKey("dataloaders")
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

// NewLoaders instantiates data loaders for the middleware
func NewLoaders(fetchUserInfos func(context.Context, []string) ([]*models.UserInfo, error)) *Loaders {
	userInfoFetcher := UserInfoFetcher{
		FetchUserInfos: fetchUserInfos,
	}
	loaders := &Loaders{
		UserInfoLoader: dataloader.NewBatchedLoader(userInfoFetcher.BatchUserInfos),
	}
	return loaders
}

// Middleware injects data loaders into the context
func Middleware(loaders *Loaders, next http.Handler) http.Handler {
	// return a middleware that injects the loader to the request context
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		nextCtx := context.WithValue(r.Context(), loadersKey, loaders)
		r = r.WithContext(nextCtx)
		next.ServeHTTP(w, r)
	})
}

// For returns the dataloader for a given context
func For(ctx context.Context) *Loaders {
	return ctx.Value(loadersKey).(*Loaders)
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
