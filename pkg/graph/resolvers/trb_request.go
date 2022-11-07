package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// CreateTRBRequest makes a new TRB request
func CreateTRBRequest(ctx context.Context, requestType models.TRBRequestType, store *storage.Store) (*models.TRBRequest, error) {
	princ := appcontext.Principal(ctx)
	trb := models.NewTRBRequest(princ.ID())
	trb.Type = requestType
	trb.Status = models.TRBSOpen
	trb.FeedbackStatus = models.TRBFeedbackStatusCannotStartYet
	//TODO make sure this is wired up appropriately

	createdTRB, err := store.CreateTRBRequest(appcontext.ZLogger(ctx), trb)
	if err != nil {
		return nil, err
	}

	//TODO create place holders for the rest of the related sections with calls to their stores

	return createdTRB, err

}

// UpdateTRBRequest updates a TRB request
func UpdateTRBRequest(ctx context.Context, id uuid.UUID, changes map[string]interface{}, store *storage.Store) (*models.TRBRequest, error) {

	existing, err := store.GetTRBRequestByID(appcontext.ZLogger(ctx), id)
	if err != nil {
		return nil, err
	}

	princ := appcontext.Principal(ctx)

	//apply changes here
	err = ApplyChangesAndMetaData(changes, existing, princ)
	if err != nil {
		return nil, err
	}

	retTRB, err := store.UpdateTRBRequest(appcontext.ZLogger(ctx), existing)
	if err != nil {
		return nil, err
	}

	return retTRB, err

}

// GetTRBRequestByID returns a TRB request by it's ID
func GetTRBRequestByID(ctx context.Context, id uuid.UUID, store *storage.Store) (*models.TRBRequest, error) {

	trb, err := store.GetTRBRequestByID(appcontext.ZLogger(ctx), id)
	if err != nil {
		return nil, err
	}

	return trb, err
}

// GetTRBRequests returns all TRB Requests
func GetTRBRequests(ctx context.Context, archived bool, store *storage.Store) ([]*models.TRBRequest, error) {

	TRBRequests, err := store.GetTRBRequests(appcontext.ZLogger(ctx), archived)
	if err != nil {
		return nil, err
	}
	return TRBRequests, err

}
