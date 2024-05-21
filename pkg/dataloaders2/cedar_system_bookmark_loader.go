package dataloaders2

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (d *dataReader) getBookmarkedCEDARSystems(ctx context.Context, cedarSystemIDs []string) ([]*models.CedarSystemBookmark, []error) {
	euaUserID := appcontext.Principal(ctx).ID()
	return d.db.FetchCedarSystemIsBookmarkedLOADER2(ctx, cedarSystemIDs, euaUserID)
}
