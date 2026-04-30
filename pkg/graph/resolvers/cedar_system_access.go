package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func GetCedarSystemViewerCapabilities(ctx context.Context, cedarSystemID uuid.UUID) (*models.CedarSystemViewerCapabilities, error) {
	return dataloaders.GetCedarSystemViewerCapabilities(ctx, cedarSystemID)
}
