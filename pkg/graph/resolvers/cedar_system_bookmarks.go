package resolvers

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/dataloaders2"
)

func CedarSystemIsBookmarked(ctx context.Context, cedarSystemID string) (bool, error) {
	// return dataloaders.GetCedarSystemIsBookmarked(ctx, cedarSystemID)
	out, err := dataloaders2.GetBookmarkedCEDARSystem(ctx, cedarSystemID)
	if err != nil {
		return false, err
	}

	return out.IsBookmarked, nil
}
