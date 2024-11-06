package resolvers

import (
	"context"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
)

func GetCedarSystemIsBookmarked(ctx context.Context, cedarSystemID string) (bool, error) {
	return dataloaders.GetCedarSystemIsBookmarked(ctx, cedarSystemID, appcontext.Principal(ctx).ID())
}
