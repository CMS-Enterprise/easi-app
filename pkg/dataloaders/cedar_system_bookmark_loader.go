package dataloaders

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/graph-gophers/dataloader"
)

func (loaders *DataLoaders) getBookmarkedCEDARSystemsBySystemIDs(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	logger := appcontext.ZLogger(ctx)

	arrayCK := ConvertToKeyArgsArray(keys)
	marshaledParams, err := arrayCK.ToJSONArray()
	if err != nil {
		logger.Error("issue converting keys to JSON for data loader in Bookmarked CEDAR Systems")
		return nil
	}

	output := make([]*dataloader.Result, len(keys))
}
