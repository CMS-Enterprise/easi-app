package resolvers

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/graph/resolvers/trb/recommendations"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// CreateTRBAdviceLetterRecommendation creates a TRBAdviceLetterRecommendation in the database
func CreateTRBAdviceLetterRecommendation(
	ctx context.Context,
	store *storage.Store,
	recommendation *models.TRBAdviceLetterRecommendation,
) (*models.TRBAdviceLetterRecommendation, error) {
	recommendation.CreatedBy = appcontext.Principal(ctx).ID()
	createdRecommendation, err := store.CreateTRBAdviceLetterRecommendation(ctx, recommendation)
	if err != nil {
		return nil, err
	}
	return createdRecommendation, nil
}

// GetTRBAdviceLetterRecommendationsByTRBRequestID retrieves TRB request advice letter recommendations records for a given TRB request ID,
// ordering them in the user-specified positions
func GetTRBAdviceLetterRecommendationsByTRBRequestID(ctx context.Context, store *storage.Store, id uuid.UUID) ([]*models.TRBAdviceLetterRecommendation, error) {
	results, err := store.GetTRBAdviceLetterRecommendationsByTRBRequestID(ctx, id)
	if err != nil {
		return nil, err
	}
	return results, nil
}

// UpdateTRBAdviceLetterRecommendation updates a TRBAdviceLetterRecommendation record in the database
func UpdateTRBAdviceLetterRecommendation(ctx context.Context, store *storage.Store, changes map[string]interface{}) (*models.TRBAdviceLetterRecommendation, error) {
	idStr, idFound := changes["id"]
	if !idFound {
		return nil, errors.New("missing required property trbRequestId")
	}

	id, err := uuid.Parse(idStr.(string))
	if err != nil {
		return nil, err
	}

	recommendation, err := store.GetTRBAdviceLetterRecommendationByID(ctx, id)
	if err != nil {
		return nil, err
	}

	err = ApplyChangesAndMetaData(changes, recommendation, appcontext.Principal(ctx))
	if err != nil {
		return nil, err
	}

	updated, err := store.UpdateTRBAdviceLetterRecommendation(ctx, recommendation)
	if err != nil {
		return nil, err
	}

	return updated, err
}

// UpdateTRBAdviceLetterRecommendationOrder updates the order that TRB advice letter recommendations are displayed in
func UpdateTRBAdviceLetterRecommendationOrder(
	ctx context.Context,
	store *storage.Store,
	trbRequestID uuid.UUID,
	newOrder []uuid.UUID,
) ([]*models.TRBAdviceLetterRecommendation, error) {
	// extra database query is necessary for validation (messing up the recommendations' positions with an invalid order would be *bad*)
	// but requiring an extra database call is unfortunate
	currentRecommendations, err := store.GetTRBAdviceLetterRecommendationsByTRBRequestID(ctx, trbRequestID)
	if err != nil {
		return nil, err
	}

	err = recommendations.IsNewRecommendationOrderValid(currentRecommendations, newOrder)
	if err != nil {
		return nil, err
	}

	updated, err := store.UpdateTRBAdviceLetterRecommendationOrder(ctx, trbRequestID, newOrder)
	if err != nil {
		return nil, err
	}
	return updated, nil
}

// DeleteTRBAdviceLetterRecommendation deletes a TRBAdviceLetterRecommendation record from the database
func DeleteTRBAdviceLetterRecommendation(ctx context.Context, store *storage.Store, id uuid.UUID) (*models.TRBAdviceLetterRecommendation, error) {
	deleted, err := store.DeleteTRBAdviceLetterRecommendation(ctx, id)
	if err != nil {
		return nil, err
	}
	return deleted, nil
}
