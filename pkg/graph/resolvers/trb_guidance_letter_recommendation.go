package resolvers

import (
	"context"
	"errors"
	"fmt"
	"slices"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/graph/resolvers/trb/recommendations"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

// CreateTRBGuidanceLetterRecommendation creates a TRBGuidanceLetterRecommendation in the database
func CreateTRBGuidanceLetterRecommendation(
	ctx context.Context,
	store *storage.Store,
	recommendation *models.TRBGuidanceLetterRecommendation,
) (*models.TRBGuidanceLetterRecommendation, error) {
	recommendation.CreatedBy = appcontext.Principal(ctx).ID()
	createdRecommendation, err := store.CreateTRBGuidanceLetterRecommendation(ctx, recommendation)
	if err != nil {
		return nil, err
	}
	return createdRecommendation, nil
}

// GetTRBGuidanceLetterRecommendationsByTRBRequestID retrieves TRB request guidance letter recommendations records for a given TRB request ID,
// ordering them in the user-specified positions
func GetTRBGuidanceLetterRecommendationsByTRBRequestID(ctx context.Context, store *storage.Store, id uuid.UUID) ([]*models.TRBGuidanceLetterRecommendation, error) {
	results, err := store.GetTRBGuidanceLetterRecommendationsByTRBRequestID(ctx, id)
	if err != nil {
		return nil, err
	}
	return results, nil
}

// UpdateTRBGuidanceLetterRecommendation updates a TRBGuidanceLetterRecommendation record in the database
func UpdateTRBGuidanceLetterRecommendation(ctx context.Context, store *storage.Store, changes map[string]interface{}) (*models.TRBGuidanceLetterRecommendation, error) {
	idIface, idFound := changes["id"]
	if !idFound {
		return nil, errors.New("missing required property trbRequestId")
	}

	// conv uuid first
	id, ok := idIface.(uuid.UUID)
	if !ok {
		return nil, fmt.Errorf("unable to convert incoming trbRequestId to uuid when updating TRB guidance letter recommendation: %v", idIface)
	}

	// This will fail to fetch an existing recommendation if the recommendation is deleted, which is sufficient protection
	// against attempting to update a deleted recommendation.
	recommendation, err := store.GetTRBGuidanceLetterRecommendationByID(ctx, id)
	if err != nil {
		return nil, err
	}

	err = ApplyChangesAndMetaData(changes, recommendation, appcontext.Principal(ctx))
	if err != nil {
		return nil, err
	}

	updated, err := store.UpdateTRBGuidanceLetterRecommendation(ctx, recommendation)
	if err != nil {
		return nil, err
	}

	return updated, err
}

// UpdateTRBGuidanceLetterRecommendationOrder updates the order that TRB guidance letter recommendations are displayed in
func UpdateTRBGuidanceLetterRecommendationOrder(
	ctx context.Context,
	store *storage.Store,
	input models.UpdateTRBGuidanceLetterRecommendationOrderInput,
) ([]*models.TRBGuidanceLetterRecommendation, error) {
	// this extra database query is necessary for validation, so we don't mess up the recommendations' positions with an invalid order,
	// but requiring an extra database call is unfortunate
	currentRecommendations, err := store.GetTRBGuidanceLetterRecommendationsByTRBRequestID(ctx, input.TrbRequestID)
	if err != nil {
		return nil, err
	}

	// querying, checking validity, then updating introduces the potential for time-of-check/time-of-use issues:
	// the data in the database might be updated between querying and updating, in which case this validity check won't reflect the latest data
	// This code doesn't currently worry about that, because we don't think it's likely to happen,
	// due to the low likelihood of multiple users concurrently editing the same guidance letter.
	// There are issues that could occur in theory, though, such as a recommendation getting deleted between when this function queries and when it updates;
	// that could lead to a `newOrder` with more elements than there are recommendations being accepted, which would throw off the recs' positions.
	err = recommendations.IsNewRecommendationOrderValid(currentRecommendations, input.NewOrder)
	if err != nil {
		return nil, err
	}

	updated, err := store.UpdateTRBGuidanceLetterRecommendationOrder(ctx, input)
	if err != nil {
		return nil, err
	}
	return updated, nil
}

// DeleteTRBGuidanceLetterRecommendation deletes a TRBGuidanceLetterRecommendation record from the database
func DeleteTRBGuidanceLetterRecommendation(
	ctx context.Context,
	store *storage.Store,
	id uuid.UUID,
) (*models.TRBGuidanceLetterRecommendation, error) {
	// as well as deleting the recommendation, we need to update the position of the remaining recommendations for that TRB request, so there aren't any gaps in the ordering

	allRecommendationsForRequest, err := store.GetTRBGuidanceLetterRecommendationsSharingTRBRequestID(ctx, id)
	if err != nil {
		return nil, err
	}

	// sort recommendations by position, so we can loop over them to find the recommendations we need to update
	slices.SortFunc(allRecommendationsForRequest, func(recommendationA, recommendationB *models.TRBGuidanceLetterRecommendation) int {
		return int(recommendationA.PositionInLetter.ValueOrZero()) - int(recommendationB.PositionInLetter.ValueOrZero())
	})

	var trbRequestID uuid.UUID // will be set once we start looping over allRecommendationsForRequest
	newOrder := []uuid.UUID{}  // updated positions

	for _, recommendation := range allRecommendationsForRequest {
		trbRequestID = recommendation.TRBRequestID // doesn't matter that we set this on every iteration, all recommendations will have the same request ID
		if recommendation.ID != id {               // skip over the recommendation we want to delete
			newOrder = append(newOrder, recommendation.ID)
		}
	}

	deletedRecommendation, err := store.DeleteTRBGuidanceLetterRecommendation(ctx, id)
	if err != nil {
		return nil, err
	}

	if _, err := store.UpdateTRBGuidanceLetterRecommendationOrder(ctx, models.UpdateTRBGuidanceLetterRecommendationOrderInput{
		TrbRequestID: trbRequestID,
		NewOrder:     newOrder,
		Category:     deletedRecommendation.Category,
	}); err != nil {
		return nil, err
	}

	return deletedRecommendation, nil
}
