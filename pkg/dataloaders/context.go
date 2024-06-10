package dataloaders

import "context"

type ctxKey string

const (
	loadersKey = ctxKey("dataloaders")
)

// loadersFromCTX returns the dataloaders for a given context
func loadersFromCTX(ctx context.Context) (*DataLoaders, bool) {
	loaders := ctx.Value(loadersKey)
	if loaders == nil {
		return nil, false
	}

	dl, ok := loaders.(*DataLoaders)
	return dl, ok
}

// CTXWithLoaders sets the given dataloaders onto given context
func CTXWithLoaders(ctx context.Context, buildDataloaders DataloaderFunc) context.Context {
	return context.WithValue(ctx, loadersKey, buildDataloaders())
}
