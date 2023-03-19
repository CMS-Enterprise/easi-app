package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// GetTRBRequestLCIDsByTRBRequestID retrieves all LCIDs that have been associated with a TRB request
func GetTRBRequestLCIDsByTRBRequestID(ctx context.Context, store *storage.Store, trbReqiestID uuid.UUID) ([]*models.TRBRequestLCID, error) {
	return store.GetTRBRequestLCIDsByTRBRequestID(ctx, trbReqiestID)
}

// CreateTRBRequestLCID relates a TRB request to an LCID
func CreateTRBRequestLCID(ctx context.Context, store *storage.Store, trbRequestID uuid.UUID, lcid string) (*models.TRBRequestLCID, error) {
	trbLcid := &models.TRBRequestLCID{
		TRBRequestID: trbRequestID,
		LCID:         lcid,
	}
	trbLcid.CreatedBy = appcontext.Principal(ctx).ID()
	return store.CreateTRBRequestLCID(ctx, trbLcid)
}

// DeleteTRBRequestLCID removes a TRB request/LCID relationship
func DeleteTRBRequestLCID(ctx context.Context, store *storage.Store, trbRequestID uuid.UUID, lcid string) (*models.TRBRequestLCID, error) {
	return store.DeleteTRBRequestLCID(ctx, trbRequestID, lcid)
}
