package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/dataloaders"
	"github.com/cmsgov/easi-app/pkg/models"
)

// TRBRequestContractNumbers utilizies a dataloader to retrieve contract numbers linked to a given TRB Request ID
func TRBRequestContractNumbers(ctx context.Context, trbRequestID uuid.UUID) ([]*models.TRBRequestContractNumber, error) {
	return dataloaders.GetTRBRequestContractNumbersByTRBRequestID(ctx, trbRequestID)
}
