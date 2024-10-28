package resolvers

import (
	"context"
	"errors"
	"fmt"
	"slices"

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
	insight *models.TRBGuidanceLetterInsight,
) (*models.TRBGuidanceLetterInsight, error) {
	insight.CreatedBy = appcontext.Principal(ctx).ID()
	createdInsight, err := store.CreateTRBGuidanceLetterInsight(ctx, insight)
	if err != nil {
		return nil, err
	}
	return createdInsight, nil
}

// GetTRBGuidanceLetterInsightsByTRBRequestID retrieves TRB request guidance letter insights records for a given TRB request ID,
// ordering them in the user-specified positions
func GetTRBGuidanceLetterInsightsByTRBRequestID(ctx context.Context, store *storage.Store, id uuid.UUID) ([]*models.TRBGuidanceLetterInsight, error) {
	results, err := store.GetTRBGuidanceLetterInsightsByTRBRequestID(ctx, id)
	if err != nil {
		return nil, err
	}
	return results, nil
}

// UpdateTRBGuidanceLetterInsight updates a TRBGuidanceLetterInsight record in the database
func UpdateTRBGuidanceLetterInsight(ctx context.Context, store *storage.Store, changes map[string]interface{}) (*models.TRBGuidanceLetterInsight, error) {
	idIface, idFound := changes["id"]
	if !idFound {
		return nil, errors.New("missing required property trbRequestId")
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

	updated, err := store.UpdateTRBGuidanceLetterInsight(ctx, insight)
	if err != nil {
		return nil, err
	}

	return updated, err
}

// UpdateTRBGuidanceLetterInsightOrder updates the order that TRB guidance letter insights are displayed in
func UpdateTRBGuidanceLetterInsightOrder(
	ctx context.Context,
	store *storage.Store,
	input models.UpdateTRBGuidanceLetterInsightOrderInput,
) ([]*models.TRBGuidanceLetterInsight, error) {
	// this extra database query is necessary for validation, so we don't mess up the insights' positions with an invalid order,
	// but requiring an extra database call is unfortunate
	currentInsights, err := store.GetTRBGuidanceLetterInsightsByTRBRequestID(ctx, input.TrbRequestID)
	if err != nil {
		return nil, err
	}

	// querying, checking validity, then updating introduces the potential for time-of-check/time-of-use issues:
	// the data in the database might be updated between querying and updating, in which case this validity check won't reflect the latest data
	// This code doesn't currently worry about that, because we don't think it's likely to happen,
	// due to the low likelihood of multiple users concurrently editing the same guidance letter.
	// There are issues that could occur in theory, though, such as an insight getting deleted between when this function queries and when it updates;
	// that could lead to a `newOrder` with more elements than there are insights being accepted, which would throw off the insights' positions.
	err = insights.IsNewInsightOrderValid(currentInsights, input.NewOrder)
	if err != nil {
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
) (*models.TRBGuidanceLetterInsight, error) {
	// as well as deleting the insight, we need to update the position of the remaining insights for that TRB request, so there aren't any gaps in the ordering

	allInsightForRequest, err := store.GetTRBGuidanceLetterInsightsSharingTRBRequestID(ctx, id)
	if err != nil {
		return nil, err
	}

	// sort insights by position, so we can loop over them to find the insights we need to update
	slices.SortFunc(allInsightForRequest, func(insightA, insightB *models.TRBGuidanceLetterInsight) int {
		return int(insightA.PositionInLetter.ValueOrZero()) - int(insightB.PositionInLetter.ValueOrZero())
	})

	newOrder := []uuid.UUID{} // updated positions

	for _, insight := range allInsightForRequest {
		if insight.ID != id { // skip over the insight we want to delete
			newOrder = append(newOrder, insight.ID)
		}
	}

	return store.DeleteTRBGuidanceLetterInsight(ctx, id, newOrder)
}
