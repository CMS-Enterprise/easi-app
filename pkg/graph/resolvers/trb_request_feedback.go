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
	createdFeedback, err := store.CreateTRBRequestFeedback(ctx, feedback)

	// TODO: if status is edits requested, change trb form status to in progress
	// TODO: if status is edits requested, change feedback status to edits requested
	// TODO: if status is completed, and form status is completed, set feedback status to completed
	// TODO: if status is completed, and form status is completed, set consult status to "ready to start"

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
