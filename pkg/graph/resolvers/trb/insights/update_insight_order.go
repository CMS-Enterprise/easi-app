package insights

import (
	"errors"
	"slices"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// IsNewInsightOrderValid checks that a new order for TRB guidance letter insights is valid for the current insights
func IsNewInsightOrderValid(currentInsights []*models.TRBGuidanceLetterRecommendation, newOrder []uuid.UUID) error {
	// check that newOrder has the same number of IDs as there are in the current insights
	if len(newOrder) != len(currentInsights) {
		return &apperrors.BadRequestError{
			Err: errors.New("new order for TRB guidance letter insights must have the same number of IDs as there are current insights"),
		}
	}

	// check that all IDs in newOrder are present in currentInsights
	for _, newOrderID := range newOrder {
		if !slices.ContainsFunc(currentInsights, func(currentInsight *models.TRBGuidanceLetterRecommendation) bool {
			return newOrderID == currentInsight.ID
		}) {
			return &apperrors.BadRequestError{
				Err: errors.New("new order for TRB guidance letter insights must contain all IDs of current insights"),
			}
		}
	}

	// check that all IDs in newOrder are distinct
	newOrderIDs := map[uuid.UUID]struct{}{} // set of all IDs in newOrder
	for _, newOrderID := range newOrder {
		if _, ok := newOrderIDs[newOrderID]; ok { // non-distinct ID detected
			return &apperrors.BadRequestError{
				Err: errors.New("new order for TRB guidance letter insights must contain distinct IDs"),
			}
		}

		newOrderIDs[newOrderID] = struct{}{}
	}

	// since we've checked that:
	// * newOrder is exactly as long as currentInsights
	// * all IDs in newOrder are present in currentInsights
	// * all IDs in newOrder are distinct
	// this means that all IDs in currentInsights must be present in newOrder, so we don't have to explicitly check that

	return nil
}
