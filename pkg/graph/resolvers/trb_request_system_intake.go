package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// GetTRBRequestFormSystemIntakesByTRBRequestID retrieves all SystemIntakes that have been associated with a TRB request
func GetTRBRequestFormSystemIntakesByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) ([]*models.SystemIntake, error) {
	return dataloaders.GetTRBRequestFormSystemIntakesByTRBRequestID(ctx, trbRequestID)
}
