package resolvers

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/dataloaders"
)

func CedarSystemIsBookmarked(ctx context.Context, cedarSystemID string) (bool, error) {
	return dataloaders.GetCedarSystemIsBookmarked(ctx, cedarSystemID)
}
