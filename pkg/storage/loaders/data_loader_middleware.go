package loaders

import (
	"context"
	"net/http"
)

type ctxKey string

const (
	loadersKey = ctxKey("dataloaders")
)

func dataLoadermMiddleware(loaders *DataLoaders, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		nextCtx := CTXWithLoaders(r.Context(), loaders)
		r = r.WithContext(nextCtx)
		next.ServeHTTP(w, r)
	})
}

// NewDataLoaderMiddleware decorates a request with data loader context
func NewDataLoaderMiddleware(loaders *DataLoaders) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return dataLoadermMiddleware(loaders, next)
	}
}

// Loaders returns the dataLoaders for a given context
func Loaders(ctx context.Context) *DataLoaders {
	return ctx.Value(loadersKey).(*DataLoaders)
}

// CTXWithLoaders decorates the context with a dataloader
func CTXWithLoaders(ctx context.Context, loaders *DataLoaders) context.Context {
	return context.WithValue(ctx, loadersKey, loaders)
}
