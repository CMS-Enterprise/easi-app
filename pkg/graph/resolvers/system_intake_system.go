package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/dataloaders"
	"github.com/cmsgov/easi-app/pkg/models"
)

// Systems utilizies a dataloader to retrieve systems linked to a given system intake ID
func Systems(ctx context.Context, systemIntakeID uuid.UUID) ([]*models.SystemIntakeSystem, error) {
	return dataloaders.GetSystemIntakeSystemsBySystemIntakeID(ctx, systemIntakeID)
}
