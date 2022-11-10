package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// CreateTRBRequestFeedback creates a TRBRequestFeedback in the database
func CreateTRBRequestFeedback(ctx context.Context, store *storage.Store, feedback *models.TRBRequestFeedback) (*models.TRBRequestFeedback, error) {
	feedback.CreatedBy = appcontext.Principal(ctx).ID()

	form, err := store.GetTRBRequestFormByTRBRequestID(ctx, feedback.TRBRequestID)
	if err != nil {
		return nil, err
	}

	trb, err := store.GetTRBRequestByID(appcontext.ZLogger(ctx), feedback.TRBRequestID)
	if err != nil {
		return nil, err
	}

	// If status is edits requested
	if feedback.Action == models.TRBFeedbackActionRequestEdits {
		// Update the TRB form status to in progress
		formChanges := map[string]interface{}{
			"status": models.TRBFormStatusInProgress,
		}
		err = ApplyChangesAndMetaData(formChanges, form, appcontext.Principal(ctx))
		if err != nil {
			return nil, err
		}

		_, err = store.UpdateTRBRequestForm(ctx, form)
		if err != nil {
			return nil, err
		}

		// Update TRB feedback status to "edits requested"
		trbChanges := map[string]interface{}{
			"feedbackStatus": models.TRBFeedbackStatusEditsRequested,
		}
		err = ApplyChangesAndMetaData(trbChanges, trb, appcontext.Principal(ctx))
		if err != nil {
			return nil, err
		}

		_, err = store.UpdateTRBRequest(appcontext.ZLogger(ctx), trb)
		if err != nil {
			return nil, err
		}
	} else if feedback.Action == models.TRBFeedbackActionReadyForConsult {
		// Update TRB feedback status to "edits requested"
		trbChanges := map[string]interface{}{
			"feedbackStatus": models.TRBFeedbackStatusCompleted,
		}
		err = ApplyChangesAndMetaData(trbChanges, trb, appcontext.Principal(ctx))
		if err != nil {
			return nil, err
		}

		_, err = store.UpdateTRBRequest(appcontext.ZLogger(ctx), trb)
		if err != nil {
			return nil, err
		}
	}

	createdFeedback, err := store.CreateTRBRequestFeedback(ctx, feedback)

	if err != nil {
		return nil, err
	}
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
