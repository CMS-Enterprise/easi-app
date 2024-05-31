package resolvers

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/dataloaders"
)

func GetCedarSystemIsBookmarked(ctx context.Context, cedarSystemID string) (bool, error) {
	return dataloaders.GetCedarSystemIsBookmarked(ctx, cedarSystemID, appcontext.Principal(ctx).ID())
}
