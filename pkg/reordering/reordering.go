package reordering

import (
	"sort"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/google/uuid"
	"golang.org/x/exp/maps"
	"golang.org/x/exp/slices"
)

// TODO - should this be 0 or 1?
const InitialOrder = 1

// TODO - do I need to have a struct wrapping the map and including the advice letter ID, or can this just be a type alias for the map?
type OrderOfRecommendations struct {
	AdviceLetterID          uuid.UUID
	OrderByRecommendationID map[uuid.UUID]int
}

// InsertNewRecommendationAtEnd returns a new ordering with the new recommendation ID added to the end (max of existing orders + 1)
// per UX, new recommendations should be added to the end - see Zoe's comment on https://jiraent.cms.gov/browse/EASI-3140
// TODO - might not need this, given that SQL query might handle it with MAX() of existing order values?
// TODO - might be useful for modeling/testing, though
func InsertNewRecommendationAtEnd(
	ordering OrderOfRecommendations,
	newRecommendationID uuid.UUID,
) OrderOfRecommendations {
	// TODO - assert that newRecommendationID isn't already in the map?

	existingOrders := maps.Values(ordering.OrderByRecommendationID)

	// have to write a manual implementation of maximum checking because the max() built-in doesn't allow spreading slice arguments with ...)
	maxExistingOrder := InitialOrder
	for _, existingOrder := range existingOrders {
		if existingOrder > maxExistingOrder {
			maxExistingOrder = existingOrder
		}
	}

	ordering.OrderByRecommendationID[newRecommendationID] = maxExistingOrder + 1
	return ordering
}

// UpdateRecommendationsWithNewOrdering updates the order field of some recommendations based on a new ordering
func UpdateRecommendationsWithNewOrdering(recommendations []*models.TRBAdviceLetterRecommendation, ordering OrderOfRecommendations) {
	// TODO - assertions (pre-conditions)?
	// assert that `len(recommendations) == len(ordering.OrderByRecommendationID)`?
	// assert that `order fields` in `recommendations`` are unique and contiguous?
	// assert that `ordering` is contiguous?
	// assert that IDs in `recommendations` exactly match IDs in `ordering`?
	// TODO - what to do if assertions fail? should this function return an error indicating that?

	for _, recommendation := range recommendations {
		newOrderForRecommendation, ok := ordering.OrderByRecommendationID[recommendation.ID]
		if !ok {
			panic("not sure how to handle this - assertions should probably prevent this from happening?")
		}
		recommendation.OrderInLetter = newOrderForRecommendation
	}

	// TODO - assertions (post-conditions) - use the preconditions that apply to `recommendations`?
}

// DeleteRecommendationFromOrdering returns a new ordering with the recommendation ID removed, with any orders after it shifted down to keep the ordering contiguous
func DeleteRecommendationFromOrdering(ordering OrderOfRecommendations, recommendationIDToDelete uuid.UUID) OrderOfRecommendations {
	// TODO - assertions (pre-conditions)?
	// assert that `ordering` is contiguous?

	newOrdering := OrderOfRecommendations{
		AdviceLetterID:          ordering.AdviceLetterID,
		OrderByRecommendationID: map[uuid.UUID]int{},
	}

	existingRecommendationIDs := maps.Keys(ordering.OrderByRecommendationID)

	filteredRecommendationIDs := slices.DeleteFunc(existingRecommendationIDs, func(recommendationID uuid.UUID) bool {
		return recommendationID == recommendationIDToDelete
	})

	sort.Slice(filteredRecommendationIDs, func(i, j int) bool {
		// these values will always exist, since we got the keys directly from the map
		return ordering.OrderByRecommendationID[existingRecommendationIDs[i]] < ordering.OrderByRecommendationID[existingRecommendationIDs[j]]
	})

	for i, recommendationID := range filteredRecommendationIDs {
		// TODO - need i + 1 if InitialOrder is 1, but not if it's 0
		newOrdering.OrderByRecommendationID[recommendationID] = i + 1
	}

	// TODO - assertions (post-conditions)?
	// assert that `ordering` is contiguous? (this is pretty important)

	return newOrdering
}
