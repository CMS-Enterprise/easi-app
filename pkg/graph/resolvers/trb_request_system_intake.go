package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// GetTRBRequestSystemIntakesByTRBRequestID retrieves all SystemIntakes that have been associated with a TRB request
func GetTRBRequestSystemIntakesByTRBRequestID(ctx context.Context, store *storage.Store, trbRequestID uuid.UUID) ([]*models.SystemIntake, error) {
	return store.GetTRBRequestSystemIntakesByTRBRequestID(ctx, trbRequestID)
}
