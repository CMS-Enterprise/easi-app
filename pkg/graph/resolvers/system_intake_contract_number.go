package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/dataloaders"
	"github.com/cmsgov/easi-app/pkg/models"
)

// SystemIntakeContractNumbers utilizies a dataloader to retrieve contract numbers linked to a given system intake ID
func SystemIntakeContractNumbers(ctx context.Context, systemIntakeID uuid.UUID) ([]*models.SystemIntakeContractNumber, error) {
	return dataloaders.GetSystemIntakeContractNumbersBySystemIntakeID(ctx, systemIntakeID)
}
