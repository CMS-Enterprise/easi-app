package dataloaders2

import "context"

type ctxKey string

const (
	loadersKey = ctxKey("dataloaders")
)

// Loaders returns the dataLoaders for a given context
func Loaders(ctx context.Context) *DataLoaders {
	return ctx.Value(loadersKey).(*DataLoaders)
}

func CTXWithLoaders(ctx context.Context, dataloaders *DataLoaders) context.Context {
	return context.WithValue(ctx, loadersKey, dataloaders)
}
