package dataloaders2

import "context"

type ctxKey string

const (
	loadersKey = ctxKey("dataloaders")
)

// loadersFromCTX returns the dataloaders for a given context
func loadersFromCTX(ctx context.Context) *DataLoaders {
	return ctx.Value(loadersKey).(*DataLoaders)
}

// CTXWithLoaders sets the given dataloaders onto given context
func CTXWithLoaders(ctx context.Context, dataloaders *DataLoaders) context.Context {
	return context.WithValue(ctx, loadersKey, dataloaders)
}
