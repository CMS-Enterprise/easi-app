package dataloaders2

import (
	"context"
	"errors"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (d *dataReader) getCedarSystemIsBookmarked(ctx context.Context, requests []models.BookmarkRequest) ([]bool, []error) {
	data, err := d.db.FetchCedarSystemIsBookmarkedLOADER(ctx, requests)
	if err != nil {
		return nil, []error{err}
	}

	return data, nil
}

func GetCedarSystemIsBookmarked(ctx context.Context, cedarSystemID string, euaUserID string) (bool, error) {
	loaders := loadersFromCTX(ctx)
	if loaders == nil {
		return false, errors.New("unexpected nil loaders in GetBookmarkedCEDARSystem")
	}

	return loaders.CedarSystemBookmark.Load(ctx, models.BookmarkRequest{
		CedarSystemID: cedarSystemID,
		EuaUserID:     euaUserID,
	})
}
