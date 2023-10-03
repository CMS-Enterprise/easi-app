package production

import (
	"github.com/cmsgov/easi-app/pkg/reordering/types"
	"github.com/google/uuid"
)

// business logic that'll be used in production
// pure functions that will eventually live in a subfolder under pkg/graph/resolvers/

// Reading/Querying - doesn't need business logic

// Inserting - doesn't need business logic

// Updating - will probably want validity checks in production, but otherwise not business logic

// DeleteTRBAdviceLetterRecommendation does stuff
// TODO - add more comments - has business logic for adjusting remaining recs' order
func DeleteTRBAdviceLetterRecommendation(recStore types.RecommendationStore, recommendationID uuid.UUID) error {
	// TODO - calculate new order for remaining recommendations
	// TODO - concurrently delete specified recommendation and update remaining recommendations with new order
	panic("not implemented")
}
