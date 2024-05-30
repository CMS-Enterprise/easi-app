// Package dataloaders holds functions for batched calls to data sources using the concept of a dataloader
package dataloaders

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// DataLoaders wrap your data loaders to inject via middleware
type DataLoaders struct {
	DataReader                        *DataReader
	UserInfoLoader                    *WrappedDataLoader
	systemIntakeContractNumbersLoader *WrappedDataLoader
	systemIntakeSystemsLoader         *WrappedDataLoader
	trbRequestContractNumbersLoader   *WrappedDataLoader
	trbRequestSystemsLoader           *WrappedDataLoader
	cedarSystemByIDLoader             *WrappedDataLoader
	cedarSystemIsBookmarked           *WrappedDataLoader
	FetchUserInfos                    func(context.Context, []string) ([]*models.UserInfo, error)
	GetCedarSystems                   func(ctx context.Context) ([]*models.CedarSystem, error)
}

// NewDataLoaders instantiates data loaders for the middleware
func NewDataLoaders(store *storage.Store, fetchUserInfos func(context.Context, []string) ([]*models.UserInfo, error), getCedarSystems func(ctx context.Context) ([]*models.CedarSystem, error)) *DataLoaders {
	loaders := &DataLoaders{
		DataReader: &DataReader{
			Store: store,
		},
		FetchUserInfos:  fetchUserInfos,
		GetCedarSystems: getCedarSystems,
	}

	loaders.UserInfoLoader = newWrappedDataLoader(loaders.BatchUserInfos)

	loaders.systemIntakeContractNumbersLoader = newWrappedDataLoader(loaders.getSystemIntakeContractNumbersBySystemIntakeID)
	loaders.systemIntakeSystemsLoader = newWrappedDataLoader(loaders.getSystemIntakeSystemsBySystemIntakeID)

	loaders.trbRequestContractNumbersLoader = newWrappedDataLoader(loaders.getTRBRequestContractNumbersByTRBRequestID)
	loaders.trbRequestSystemsLoader = newWrappedDataLoader(loaders.getTRBRequestSystemsByTRBRequestID)
	loaders.cedarSystemByIDLoader = newWrappedDataLoader(loaders.getCedarSystemBatchFunction)
	loaders.cedarSystemIsBookmarked = newWrappedDataLoader(loaders.getBookmarkedCEDARSystems)
	return loaders
}

// DataReader reads Users from a database
type DataReader struct {
	Store *storage.Store
}
