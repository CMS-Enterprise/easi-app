package loaders

import "github.com/graph-gophers/dataloader"

// WrappedDataLoader wraps a DataLoader so it has access to an optional Map
type WrappedDataLoader struct {
	Loader *dataloader.Loader
}

func newWrappedDataLoader(batchFn dataloader.BatchFunc) *WrappedDataLoader {

	return &WrappedDataLoader{
		Loader: dataloader.NewBatchedLoader(batchFn, dataloader.WithClearCacheOnBatch()),
	}
}
