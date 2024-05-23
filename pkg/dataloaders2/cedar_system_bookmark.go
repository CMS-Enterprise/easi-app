package dataloaders2

import (
	"context"
	"errors"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (d *dataReader) getBookmarkedCEDARSystems(ctx context.Context, cedarSystemIDs []string) ([]*models.SystemBookmark, []error) {
	euaUserID := appcontext.Principal(ctx).ID()
	return d.db.FetchCedarSystemIsBookmarkedLOADER2(ctx, cedarSystemIDs, euaUserID)
}

func GetBookmarkedCEDARSystem(ctx context.Context, cedarSystemID string) (*models.SystemBookmark, error) {
	loaders := loaders(ctx)
	if loaders == nil {
		return nil, errors.New("unexpected nil loaders in GetBookmarkedCEDARSystem")
	}

	return loaders.CedarSystemBookmark.Load(ctx, cedarSystemID)
}

func GetBookmarkedCEDARSystems(ctx context.Context, cedarSystemIDs []string) ([]*models.SystemBookmark, error) {
	loaders := loaders(ctx)
	if loaders == nil {
		return nil, errors.New("unexpected nil loaders in GetBookmarkedCEDARSystems")
	}

	return loaders.CedarSystemBookmark.LoadAll(ctx, cedarSystemIDs)
}
