package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// GetTRBRequestSystemIntakesByTRBRequestID retrieves all SystemIntakes that have been associated with a TRB request
func GetTRBRequestSystemIntakesByTRBRequestID(ctx context.Context, store *storage.Store, trbReqiestID uuid.UUID) ([]*models.SystemIntake, error) {
	return store.GetTRBRequestSystemIntakesByTRBRequestID(ctx, trbReqiestID)
}

// CreateTRBRequestSystemIntake relates a TRB request to an SystemIntake
func CreateTRBRequestSystemIntake(ctx context.Context, store *storage.Store, trbRequestID uuid.UUID, systemIntakeID uuid.UUID) (*models.TRBRequestSystemIntake, error) {
	trbLcid := &models.TRBRequestSystemIntake{
		TRBRequestID:   trbRequestID,
		SystemIntakeID: systemIntakeID,
	}
	trbLcid.CreatedBy = appcontext.Principal(ctx).ID()
	return store.CreateTRBRequestSystemIntake(ctx, trbLcid)
}

// DeleteTRBRequestSystemIntake removes a TRB request/SystemIntake relationship
func DeleteTRBRequestSystemIntake(ctx context.Context, store *storage.Store, trbRequestID uuid.UUID, systemIntakeID uuid.UUID) (*models.TRBRequestSystemIntake, error) {
	return store.DeleteTRBRequestSystemIntake(ctx, trbRequestID, systemIntakeID)
}
