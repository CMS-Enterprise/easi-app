package dataloaders

import (
	"context"
	"errors"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (d *dataReader) batchCedarSystemIsBookmarked(ctx context.Context, requests []models.BookmarkRequest) ([]bool, []error) {
	data, err := d.db.FetchCedarSystemIsBookmarkedByCedarSystemIDs(ctx, requests)
	if err != nil {
		return nil, []error{err}
	}

	return data, nil
}

func GetCedarSystemIsBookmarked(ctx context.Context, cedarSystemID string, euaUserID string) (bool, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return false, errors.New("unexpected nil loaders in GetBookmarkedCEDARSystem")
	}

	return loaders.CedarSystemBookmark.Load(context.WithoutCancel(ctx), models.BookmarkRequest{
		CedarSystemID: cedarSystemID,
		EuaUserID:     euaUserID,
	})
}
