package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
)

func GetCedarSystemIsBookmarked(ctx context.Context, cedarSystemID uuid.UUID) (bool, error) {
	return dataloaders.GetCedarSystemIsBookmarked(ctx, cedarSystemID, appcontext.Principal(ctx).ID())
}
