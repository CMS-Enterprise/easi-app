package resolvers

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/dataloaders"
)

func GetCedarSystemIsBookmarked(ctx context.Context, cedarSystemID string) (bool, error) {
	// euaUserID := appcontext.Principal(ctx).ID()
	return dataloaders.GetCedarSystemIsBookmarked(ctx, cedarSystemID)
	// return dataloaders2.GetCedarSystemIsBookmarked(ctx, cedarSystemID, euaUserID)
}
