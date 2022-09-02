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

	//TODO maybe add a base struct pre-update resovler here instead
	err = ApplyChanges(changes, existing)
	if err != nil {
		return nil, err
	}

	princ := appcontext.Principal(ctx)
	modified := princ.ID()

	existing.ModifiedBy = &modified

	retTRB, err := store.TRBRequestUpdate(appcontext.ZLogger(ctx), existing)
	if err != nil {
		return nil, err
	}

	return retTRB, err

}
