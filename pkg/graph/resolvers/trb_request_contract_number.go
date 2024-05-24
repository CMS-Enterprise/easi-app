package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/dataloaders2"
	"github.com/cmsgov/easi-app/pkg/models"
)

// TRBRequestContractNumbers utilizes a dataloader to retrieve contract numbers linked to a given TRB Request ID
func TRBRequestContractNumbers(ctx context.Context, trbRequestID uuid.UUID) ([]*models.TRBRequestContractNumber, error) {
	return dataloaders2.GetTRBRequestContractNumbersByTRBRequestID(ctx, trbRequestID)
}
