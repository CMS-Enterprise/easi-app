package recommendations

import (
	"errors"
	"slices"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// IsNewRecommendationOrderValid checks that a new order for TRB advice letter recommendations is valid for the current recommendations
func IsNewRecommendationOrderValid(currentRecommendations []*models.TRBAdviceLetterRecommendation, newOrder []uuid.UUID) error {
	// check that newOrder has the same number of IDs as there are in the current recommendations
	if len(newOrder) != len(currentRecommendations) {
		return &apperrors.BadRequestError{
			Err: errors.New("new order for TRB advice letter recommendations must have the same number of IDs as there are current recommendations"),
		}
	}

	// check that all IDs in newOrder are present in currentRecommendations
	for _, newOrderID := range newOrder {
		if !slices.ContainsFunc(currentRecommendations, func(currentRecommendation *models.TRBAdviceLetterRecommendation) bool {
			return newOrderID == currentRecommendation.ID
		}) {
			return &apperrors.BadRequestError{
				Err: errors.New("new order for TRB advice letter recommendations must contain all IDs of current recommendations"),
			}
		}
	}

	// check that all IDs in newOrder are distinct
	newOrderIDs := map[uuid.UUID]struct{}{} // set of all IDs in newOrder
	for _, newOrderID := range newOrder {
		if _, ok := newOrderIDs[newOrderID]; ok { // non-distinct ID detected
			return &apperrors.BadRequestError{
				Err: errors.New("new order for TRB advice letter recommendations must contain distinct IDs"),
			}
		}

		newOrderIDs[newOrderID] = struct{}{}
	}

	// since we've checked that:
	// * newOrder is exactly as long as currentRecommendations
	// * all IDs in newOrder are present in currentRecommendations
	// * all IDs in newOrder are distinct
	// this means that all IDs in currentRecommendations must be present in newOrder, so we don't have to explicitly check that

	return nil
}
