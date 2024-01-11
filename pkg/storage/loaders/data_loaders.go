package loaders

import "github.com/cmsgov/easi-app/pkg/storage"

// DataLoaders wrap your data loaders to inject via middleware
type DataLoaders struct {
	UserAccountLoader *WrappedDataLoader
	DataReader        *DataReader
}

// NewDataLoaders instantiates data loaders for the middleware
func NewDataLoaders(store *storage.Store) *DataLoaders {
	loaders := &DataLoaders{
		DataReader: &DataReader{
			Store: store,
		},
	}

	loaders.UserAccountLoader = newWrappedDataLoader(loaders.GetUserAccountsByIDLoader)

	return loaders
}

// DataReader reads Users from a database
type DataReader struct {
	Store *storage.Store
}
