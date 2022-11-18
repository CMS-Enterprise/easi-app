package resolvers

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// CreateTRBRequestFeedback creates a TRBRequestFeedback in the database
func CreateTRBRequestFeedback(ctx context.Context, store *storage.Store, feedback *models.TRBRequestFeedback) (*models.TRBRequestFeedback, error) {
	feedback.CreatedBy = appcontext.Principal(ctx).ID()
	var formToUpdate *models.TRBRequestForm
	// If action is edits requested, change the form status to "in progress"
	if feedback.Action == models.TRBFeedbackActionRequestEdits {
		form, err := store.GetTRBRequestFormByTRBRequestID(ctx, feedback.TRBRequestID)
		fmt.Println("here 1")
		if err != nil {
			return nil, err
		}
		fmt.Println("here 2")

		// Update the TRB form status to in progress
		formChanges := map[string]interface{}{
			"status": models.TRBFormStatusInProgress,
		}

		err = ApplyChangesAndMetaData(formChanges, form, appcontext.Principal(ctx))
		if err != nil {
			return nil, err
		}

		formToUpdate = form
	}

	fmt.Println("here 3")
	createdFeedback, err := store.CreateTRBRequestFeedback(ctx, feedback, formToUpdate)
	if err != nil {
		return nil, err
	}
	fmt.Println("here 4")

	return createdFeedback, nil
}

// GetTRBRequestFeedbackByTRBRequestID retrieves TRB request feedback records for a given TRB request ID
func GetTRBRequestFeedbackByTRBRequestID(ctx context.Context, store *storage.Store, id uuid.UUID) ([]*models.TRBRequestFeedback, error) {
	results, err := store.GetTRBRequestFeedbackByTRBRequestID(ctx, id)
	if err != nil {
		return nil, err
	}
	return results, err
}
