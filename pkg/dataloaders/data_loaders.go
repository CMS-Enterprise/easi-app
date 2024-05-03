// Package dataloaders holds functions for batched calls to data sources using the concept of a dataloader
package dataloaders

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// DataLoaders wrap your data loaders to inject via middleware
type DataLoaders struct {
	UserAccountLoader                 *WrappedDataLoader
	DataReader                        *DataReader
	UserInfoLoader                    *WrappedDataLoader
	systemIntakeContractNumbersLoader *WrappedDataLoader
	systemIntakeSystemsLoader         *WrappedDataLoader
	trbRequestContractNumbersLoader   *WrappedDataLoader
	trbRequestSystemsLoader           *WrappedDataLoader
	cedarSystemBookmarksLoader        *WrappedDataLoader
	FetchUserInfos                    func(context.Context, []string) ([]*models.UserInfo, error)
}

// NewDataLoaders instantiates data loaders for the middleware
func NewDataLoaders(store *storage.Store, fetchUserInfos func(context.Context, []string) ([]*models.UserInfo, error)) *DataLoaders {
	loaders := &DataLoaders{
		DataReader: &DataReader{
			Store: store,
		},
		FetchUserInfos: fetchUserInfos,
	}

	loaders.UserAccountLoader = newWrappedDataLoader(loaders.GetUserAccountsByIDLoader)

	loaders.UserInfoLoader = newWrappedDataLoader(loaders.BatchUserInfos)

	loaders.systemIntakeContractNumbersLoader = newWrappedDataLoader(loaders.getSystemIntakeContractNumbersBySystemIntakeID)
	loaders.systemIntakeSystemsLoader = newWrappedDataLoader(loaders.getSystemIntakeSystemsBySystemIntakeID)

	loaders.trbRequestContractNumbersLoader = newWrappedDataLoader(loaders.getTRBRequestContractNumbersByTRBRequestID)
	loaders.trbRequestSystemsLoader = newWrappedDataLoader(loaders.getTRBRequestSystemsByTRBRequestID)

	// loaders.cedarSystemBookmarksLoader = newWrappedDataLoader(loaders.getBookmarkedCEDARSystems)
	return loaders
}

// DataReader reads Users from a database
type DataReader struct {
	Store *storage.Store
}
