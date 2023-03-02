package dataloaders

import (
	"context"
	"net/http"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/graph-gophers/dataloader"
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
func NewLoaders(fetchUserInfos func(context.Context, []string) ([]*models.UserInfo, error)) *Loaders {
	userInfoFetcher := UserInfoFetcher{
		FetchUserInfos: fetchUserInfos,
	}
	loaders := &Loaders{
		UserInfoLoader: dataloader.NewBatchedLoader(userInfoFetcher.BatchUserInfos),
	}
	return loaders
}

// For returns the dataloader for a given context
func For(ctx context.Context) *Loaders {
	return ctx.Value(loadersKey).(*Loaders)
}

// Middleware stores Loaders as a request-scoped context value.
func Middleware(loaders *Loaders, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		nextCtx := context.WithValue(r.Context(), loadersKey, loaders)
		r = r.WithContext(nextCtx)
		next.ServeHTTP(w, r)
	})
}
