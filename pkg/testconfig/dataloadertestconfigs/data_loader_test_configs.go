// Package dataloadertestconfigs provides utility functions for injecting dataloaders into test code
package dataloadertestconfigs

import (
	"context"

	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
	// "github.com/cms-enterprise/easi-app/pkg/storage/loaders"
)

// BuildDataLoaders creates a function that builds dataloaders
func BuildDataLoaders(store *storage.Store, fetchUserInfos func(ctx context.Context, euaUserIDs []string) ([]*models.UserInfo, error), getCedarSystems func(ctx context.Context) ([]*models.CedarSystem, error)) dataloaders.BuildDataloaders {
	buildDataloaders := func() *dataloaders.Dataloaders {
		return dataloaders.NewDataloaders(store, fetchUserInfos, getCedarSystems)
	}
	return buildDataloaders
}

// DecorateTestContextWithDataLoader Wraps a context with data loaders as needed for some unit testing
func DecorateTestContextWithDataLoader(ctx context.Context, store *storage.Store, fetchUserInfos func(ctx context.Context, euaUserIDs []string) ([]*models.UserInfo, error), getCedarSystems func(ctx context.Context) ([]*models.CedarSystem, error)) context.Context {

	return dataloaders.CTXWithLoaders(ctx, BuildDataLoaders(store, fetchUserInfos, getCedarSystems))
}
