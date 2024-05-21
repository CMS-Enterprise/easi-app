package dataloaders2

import (
	"context"

	"github.com/vikstrous/dataloadgen"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

type ctxKey string

const (
	loadersKey = ctxKey("dataloaders")
)

type dataReader struct {
	db *storage.Store
}

type DataLoaders struct {
	CedarSystemBookmark *dataloadgen.Loader[string, *models.SystemBookmark]
}

func NewDataLoaders(store *storage.Store) *DataLoaders {
	dr := &dataReader{
		db: store,
	}
	return &DataLoaders{
		CedarSystemBookmark: dataloadgen.NewLoader(dr.getBookmarkedCEDARSystems),
	}
}

// Loaders returns the dataLoaders for a given context
func Loaders(ctx context.Context) *DataLoaders {
	return ctx.Value(loadersKey).(*DataLoaders)
}

func CTXWithLoaders(ctx context.Context, dataloaders *DataLoaders) context.Context {
	return context.WithValue(ctx, loadersKey, dataloaders)
}
