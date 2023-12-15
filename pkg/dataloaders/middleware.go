package dataloaders

import (
	"context"
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

// NewLoaders instantiates data loaders for the middleware
func NewLoaders(fetchUserInfos func(context.Context, []string) ([]*models.UserInfo, error)) *Loaders { // TODO: EASI-3341 can this be combined with the larger data loader paradigm?
	userInfoLoader := UserInfoLoader{
		FetchUserInfos: fetchUserInfos,
	}
	loaders := &Loaders{
		UserInfoLoader: dataloader.NewBatchedLoader(userInfoLoader.BatchUserInfos),
	}
	return loaders
}

// For returns the dataloader for a given context
func For(ctx context.Context) *Loaders {
	return ctx.Value(loadersKey).(*Loaders)
}

// Middleware stores Loaders as a request-scoped context value.
func Middleware(fetchUserInfos func(context.Context, []string) ([]*models.UserInfo, error)) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := r.Context()
			loaders := NewLoaders(fetchUserInfos)
			augmentedCtx := context.WithValue(ctx, loadersKey, loaders)
			r = r.WithContext(augmentedCtx)
			next.ServeHTTP(w, r)
		})
	}
}
