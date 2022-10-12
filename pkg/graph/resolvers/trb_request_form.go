package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/applychanges"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// CreateTRBRequestForm creates a TRBRequestForm in the database
func CreateTRBRequestForm(ctx context.Context, store *storage.Store, input map[string]interface{}) (*models.TRBRequestForm, error) {
	form := models.TRBRequestForm{}
	err := applychanges.ApplyChanges(input, &form)
	if err != nil {
		return nil, err
	}
	form.CreatedBy = appcontext.Principal(ctx).ID()
	createdForm, err := store.CreateTRBRequestForm(ctx, &form)
	if err != nil {
		return nil, err
	}
	return createdForm, nil
}

// UpdateTRBRequestForm updates a TRBRequestForm record in the database
func UpdateTRBRequestForm(ctx context.Context, store *storage.Store, input map[string]interface{}) (*models.TRBRequestForm, error) {
	form := models.TRBRequestForm{}
	err := ApplyChangesAndMetaData(input, &form, appcontext.Principal(ctx))
	if err != nil {
		return nil, err
	}

	updatedForm, err := store.UpdateTRBRequestForm(ctx, &form)
	if err != nil {
		return nil, err
	}

	return updatedForm, nil
}

// DeleteTRBRequestForm deletes a TRBRequestForm record from the database
func DeleteTRBRequestForm(ctx context.Context, store *storage.Store, trbRequestID uuid.UUID) (*models.TRBRequestForm, error) {
	deleted, err := store.DeleteTRBRequestForm(ctx, trbRequestID)
	if err != nil {
		return nil, err
	}
	return deleted, nil
}

// GetTRBRequestFormByTRBRequestID retrieves a TRB request form record for a given TRB request ID
func GetTRBRequestFormByTRBRequestID(ctx context.Context, store *storage.Store, id uuid.UUID) (*models.TRBRequestForm, error) {
	form, err := store.GetTRBRequestFormByTRBRequestID(ctx, id)
	if err != nil {
		return nil, err
	}

	return form, err
}
