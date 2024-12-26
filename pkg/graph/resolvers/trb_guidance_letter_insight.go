package resolvers

import (
	"context"
	"errors"
	"fmt"
	"slices"
	"sort"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/graph/resolvers/trb/insights"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

// CreateTRBGuidanceLetterInsight creates a TRBGuidanceLetterInsight in the database
func CreateTRBGuidanceLetterInsight(
	ctx context.Context,
	store *storage.Store,
	insight *models.TRBGuidanceLetterRecommendation,
) (*models.TRBGuidanceLetterRecommendation, error) {
	insight.CreatedBy = appcontext.Principal(ctx).ID()
	createdInsight, err := store.CreateTRBGuidanceLetterInsight(ctx, insight)
	if err != nil {
		return nil, err
	}
	return createdInsight, nil
}

// GetTRBGuidanceLetterInsightsByTRBRequestID retrieves TRB request guidance letter insights records for a given TRB request ID,
// ordering them in the user-specified positions
func GetTRBGuidanceLetterInsightsByTRBRequestID(ctx context.Context, store *storage.Store, id uuid.UUID) ([]*models.TRBGuidanceLetterRecommendation, error) {
	results, err := store.GetTRBGuidanceLetterInsightsByTRBRequestID(ctx, id)
	if err != nil {
		return nil, err
	}
	return results, nil
}

// UpdateTRBGuidanceLetterInsight updates a TRBGuidanceLetterInsight record in the database
func UpdateTRBGuidanceLetterInsight(ctx context.Context, store *storage.Store, changes map[string]interface{}) (*models.TRBGuidanceLetterRecommendation, error) {
	idIface, idFound := changes["id"]
	if !idFound {
		return nil, errors.New("missing required property id")
	}

	// conv uuid first
	id, ok := idIface.(uuid.UUID)
	if !ok {
		return nil, fmt.Errorf("unable to convert incoming trbRequestId to uuid when updating TRB guidance letter insight: %v", idIface)
	}

	// This will fail to fetch an existing insight if the insight is deleted, which is sufficient protection
	// against attempting to update a deleted insight.
	insight, err := store.GetTRBGuidanceLetterInsightByID(ctx, id)
	if err != nil {
		return nil, err
	}

	err = ApplyChangesAndMetaData(changes, insight, appcontext.Principal(ctx))
	if err != nil {
		return nil, err
	}

	// do not allow users to set category to `uncategorized`
	if insight.Category == models.TRBGuidanceLetterRecommendationCategoryUncategorized {
		return nil, errors.New("cannot set category to `uncategorized` on an insight")
	}

	updated, err := store.UpdateTRBGuidanceLetterInsight(ctx, insight)
	if err != nil {
		return nil, err
	}

	// clean up the order to fill any missing order numbers
	// ex: having considerations 1, 2, 3, 4 and moving consideration 2 to a requirement, leaving considerations 1, 3, 4)
	// while the missing order numbers will not affect the UI as the UI displays the insights in the order received (we
	// do not send the position int to the UI), it is still better db hygiene to clean up the orders
	if err := cleanupGuidanceLetterInsightOrder(ctx, store, insight.TRBRequestID); err != nil {
		return nil, err
	}

	return updated, nil
}

// UpdateTRBGuidanceLetterInsightOrder updates the order that TRB guidance letter insights are displayed in
func UpdateTRBGuidanceLetterInsightOrder(
	ctx context.Context,
	store *storage.Store,
	input models.UpdateTRBGuidanceLetterRecommendationOrderInput,
) ([]*models.TRBGuidanceLetterRecommendation, error) {
	// this extra database query is necessary for validation, so we don't mess up the insights' positions with an invalid order,
	// but requiring an extra database call is unfortunate
	currentInsights, err := store.GetTRBGuidanceLetterInsightsByTRBRequestIDAndCategory(ctx, input.TrbRequestID, input.Category)
	if err != nil {
		return nil, err
	}

	// querying, checking validity, then updating introduces the potential for time-of-check/time-of-use issues:
	// the data in the database might be updated between querying and updating, in which case this validity check won't reflect the latest data
	// This code doesn't currently worry about that, because we don't think it's likely to happen,
	// due to the low likelihood of multiple users concurrently editing the same guidance letter.
	// There are issues that could occur in theory, though, such as an insight getting deleted between when this function queries and when it updates;
	// that could lead to a `newOrder` with more elements than there are insights being accepted, which would throw off the recs' positions.
	if err := insights.IsNewInsightOrderValid(currentInsights, input.NewOrder); err != nil {
		return nil, err
	}

	updated, err := store.UpdateTRBGuidanceLetterInsightOrder(ctx, input)
	if err != nil {
		return nil, err
	}

	return updated, nil
}

// DeleteTRBGuidanceLetterInsight deletes a TRBGuidanceLetterInsight record from the database
func DeleteTRBGuidanceLetterInsight(
	ctx context.Context,
	store *storage.Store,
	id uuid.UUID,
) (*models.TRBGuidanceLetterRecommendation, error) {
	// as well as deleting the insight, we need to update the position of the remaining insights for that TRB request, so there aren't any gaps in the ordering

	allInsightsForRequest, err := store.GetTRBGuidanceLetterInsightsSharingTRBRequestID(ctx, id)
	if err != nil {
		return nil, err
	}

	// sort insights by position, so we can loop over them to find the insights we need to update
	slices.SortFunc(allInsightsForRequest, func(insightA, insightB *models.TRBGuidanceLetterRecommendation) int {
		return int(insightA.PositionInLetter.ValueOrZero()) - int(insightB.PositionInLetter.ValueOrZero())
	})

	newOrder := []uuid.UUID{} // updated positions

	for _, insight := range allInsightsForRequest {
		if insight.ID != id { // skip over the insight we want to delete
			newOrder = append(newOrder, insight.ID)
		}
	}

	return store.DeleteTRBGuidanceLetterInsight(ctx, id, newOrder)
}

// cleanupGuidanceLetterInsightOrder sets re-ordered lists of insights for each category
// ex: we have Considerations 1, 2, 3, 4, and Consideration 2 is moved to Requirements
// now, we have Considerations 1, 3, 4. While this will not impact the UI, as we will still return the list in position-ascending order
// (so, still 1, 3, 4 in order), it is better DB hygiene to clean up that order to shuffle the 3, 4 back to 2, 3, leaving us
// with 1, 2, 3
func cleanupGuidanceLetterInsightOrder(ctx context.Context, store *storage.Store, trbRequestID uuid.UUID) error {
	// first, get list of all insights for this guidance letter
	allInsights, err := store.GetTRBGuidanceLetterInsightsByTRBRequestID(ctx, trbRequestID)
	if err != nil {
		return err
	}

	// presort, regardless of category, for ease later
	sort.Slice(allInsights, func(i, j int) bool {
		return allInsights[i].PositionInLetter.Int64 < allInsights[j].PositionInLetter.Int64
	})

	// group by category, shuffle up the order if needed, update db
	m := map[models.TRBGuidanceLetterInsightCategory][]*models.TRBGuidanceLetterRecommendation{}

	// prefill with all available categories
	for _, category := range models.AllTRBGuidanceLetterRecommendationCategory {
		m[category] = []*models.TRBGuidanceLetterRecommendation{}
	}

	// populate map
	for _, insight := range allInsights {
		m[insight.Category] = append(m[insight.Category], insight)
	}

	// set new order
	for category, insights := range m {
		var ordered []uuid.UUID

		// here is where we set the order. by simply appending to the list `ordered`, we fill in any index gaps
		for _, insight := range insights {
			ordered = append(ordered, insight.ID)
		}

		// save new order for each category
		if _, err := store.UpdateTRBGuidanceLetterInsightOrder(ctx, models.UpdateTRBGuidanceLetterRecommendationOrderInput{
			TrbRequestID: trbRequestID,
			NewOrder:     ordered,
			Category:     category,
		}); err != nil {
			return err
		}
	}

	return nil
}
