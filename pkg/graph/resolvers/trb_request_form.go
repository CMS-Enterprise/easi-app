package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

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

// GetTRBRequestFormByTRBRequestID retrieves a TRB request form record for a given TRB request ID
func GetTRBRequestFormByTRBRequestID(ctx context.Context, store *storage.Store, id uuid.UUID) (*models.TRBRequestForm, error) {
	form, err := store.GetTRBRequestFormByTRBRequestID(ctx, id)
	if err != nil {
		return nil, err
	}

	return form, err
}
