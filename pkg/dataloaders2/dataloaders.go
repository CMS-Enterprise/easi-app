package dataloaders2

import (
	"github.com/vikstrous/dataloadgen"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
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
