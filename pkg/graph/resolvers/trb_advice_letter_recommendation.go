package resolvers

import (
	"context"
	"errors"
	"fmt"
	"slices"

	"github.com/google/uuid"
	"golang.org/x/sync/errgroup"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/graph/resolvers/trb/recommendations"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
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
	idIface, idFound := changes["id"]
	if !idFound {
		return nil, errors.New("missing required property trbRequestId")
	}

	// conv uuid first
	id, ok := idIface.(uuid.UUID)
	if !ok {
		return nil, fmt.Errorf("unable to convert incoming trbRequestId to uuid when updating TRB advice letter recommendation: %v", idIface)
	}

	// This will fail to fetch an existing recommendation if the recommendation is deleted, which is sufficient protection
	// against attempting to update a deleted recommendation.
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
	// this extra database query is necessary for validation, so we don't mess up the recommendations' positions with an invalid order,
	// but requiring an extra database call is unfortunate
	currentRecommendations, err := store.GetTRBAdviceLetterRecommendationsByTRBRequestID(ctx, trbRequestID)
	if err != nil {
		return nil, err
	}

	// querying, checking validity, then updating introduces the potential for time-of-check/time-of-use issues:
	// the data in the database might be updated between querying and updating, in which case this validity check won't reflect the latest data
	// This code doesn't currently worry about that, because we don't think it's likely to happen,
	// due to the low likelihood of multiple users concurrently editing the same advice letter.
	// There are issues that could occur in theory, though, such as a recommendation getting deleted between when this function queries and when it updates;
	// that could lead to a `newOrder` with more elements than there are recommendations being accepted, which would throw off the recs' positions.
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
	// as well as deleting the recommendation, we need to update the position of the remaining recommendations for that TRB request, so there aren't any gaps in the ordering

	allRecommendationsForRequest, err := store.GetTRBAdviceLetterRecommendationsSharingTRBRequestID(ctx, id)
	if err != nil {
		return nil, err
	}

	// sort recommendations by position, so we can loop over them to find the recommendations we need to update
	slices.SortFunc(allRecommendationsForRequest, func(recommendationA, recommendationB *models.TRBAdviceLetterRecommendation) int {
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

	// deleting the given recommendation and updating the other recommendations can be done concurrently
	// ideally, we'd do this in a single transaction, but our code doesn't support that at this time - see Note [Database calls from resolvers aren't atomic]
	errGroup := new(errgroup.Group)
	var deletedRecommendation *models.TRBAdviceLetterRecommendation // declare this outside the function we pass to errGroup.Go() so we can return it

	errGroup.Go(func() error {
		deletedRecommendation, err = store.DeleteTRBAdviceLetterRecommendation(ctx, id)
		if err != nil {
			return err
		}
		return nil
	})

	errGroup.Go(func() error {
		_, err := store.UpdateTRBAdviceLetterRecommendationOrder(ctx, trbRequestID, newOrder)
		if err != nil {
			return err
		}
		return nil
	})

	if err := errGroup.Wait(); err != nil {
		return nil, err
	}

	return deletedRecommendation, nil
}
