package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// SystemIntakeContractNumbers utilizes a dataloader to retrieve contract numbers linked to a given system intake ID
func SystemIntakeContractNumbers(ctx context.Context, systemIntakeID uuid.UUID) ([]*models.SystemIntakeContractNumber, error) {
	return dataloaders.GetSystemIntakeContractNumbersBySystemIntakeID(ctx, systemIntakeID)
}
