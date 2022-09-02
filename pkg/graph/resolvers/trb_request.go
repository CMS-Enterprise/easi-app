package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

//TRBRequestCreate makes a new TRB request
func TRBRequestCreate(ctx context.Context, requestType models.TRBRequestType, store *storage.Store) (*models.TRBRequest, error) {
	princ := appcontext.Principal(ctx)
	trb := models.NewTRBRequest(princ.ID())
	trb.Type = requestType
	trb.Status = models.TRBSOpen
	//TODO make sure this is wired up appropriately

	createdTRB, err := store.TRBRequestCreate(appcontext.ZLogger(ctx), trb)
	if err != nil {
		return nil, err
	}

	//TODO create place holders for the rest of the related sections with calls to their stores

	return createdTRB, err

}

//TRBRequestUpdate updates a TRB request
func TRBRequestUpdate(ctx context.Context, id uuid.UUID, changes map[string]interface{}, store *storage.Store) (*models.TRBRequest, error) {

	existing, err := store.TRBRequestGetByID(appcontext.ZLogger(ctx), id)
	if err != nil {
		return nil, err
	}
	logger := appcontext.ZLogger(ctx)
	princ := appcontext.Principal(ctx)

	//apply changes here
	err = BaseStructPreUpdate(logger, existing, changes, princ, store, true)
	if err != nil {
		return nil, err
	}

	retTRB, err := store.TRBRequestUpdate(appcontext.ZLogger(ctx), existing)
	if err != nil {
		return nil, err
	}

	return retTRB, err

}

//TRBRequestGetByID returns a TRB request by it's ID
func TRBRequestGetByID(ctx context.Context, id uuid.UUID, store *storage.Store) (*models.TRBRequest, error) {

	trb, err := store.TRBRequestGetByID(appcontext.ZLogger(ctx), id)
	if err != nil {
		return nil, err
	}
	return trb, err
}

//TRBRequestCollectionGet returns all TRB Requests
func TRBRequestCollectionGet(ctx context.Context, archived bool, store *storage.Store) ([]*models.TRBRequest, error) {

	TRBRequests, err := store.TRBRequestCollectionGet(appcontext.ZLogger(ctx), archived)
	if err != nil {
		return nil, err
	}
	return TRBRequests, err

}
