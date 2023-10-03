package reordering

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/samber/lo"
	"golang.org/x/exp/slices"

	"github.com/cmsgov/easi-app/pkg/models"
)

// model used for verifying that the actual code works
// in-memory data store that also checks invariants
// implements RecommendationStore interface (along with our actual store)
type recommendationOrderModel struct {
	// trbRequests []models.TRBRequest // TODO - is this needed?

	// TODO - do I need multiple letters, or is just checking with a single letter sufficient?
	// probably start with single letter, see if it works; if it does, check with multiple letters to better match database/production code

	// adviceLetters []models.TRBAdviceLetter

	// assume a single request and a single letter
	trbRequestID      uuid.UUID
	trbAdviceLetterID uuid.UUID

	recommendations []models.TRBAdviceLetterRecommendation
}

// gets all orders of stored recommendations
// TODO - if model is expanded to multiple advice letters, this should be changed to getOrdersForLetters(); take a letter ID, return orders only for that letter
func (m *recommendationOrderModel) getOrders() []int {
	return lo.Map(m.recommendations, func(rec models.TRBAdviceLetterRecommendation, _ int) int {
		return rec.OrderInLetter
	})
}

// gets a map of recommendation IDs to their orders
// TODO - if model is expanded to multiple advice letters, this should be changed to take a letter ID, return orders only for that letter (should also be renamed)
func (m *recommendationOrderModel) getOrdersByRecommendationID() map[uuid.UUID]int {
	return lo.SliceToMap(m.recommendations, func(rec models.TRBAdviceLetterRecommendation) (uuid.UUID, int) {
		return rec.ID, rec.OrderInLetter
	})
}

func (m *recommendationOrderModel) checkInvariants() bool {
	// check that recommendations are all for the same request
	for _, recommendation := range m.recommendations {
		if recommendation.TRBRequestID != m.trbRequestID {
			return false
		}
	}

	// check that all recommendations have unique IDs
	recsWithUniqueIDs := lo.UniqBy(m.recommendations, func(rec models.TRBAdviceLetterRecommendation) uuid.UUID {
		return rec.ID
	})
	if len(recsWithUniqueIDs) != len(m.recommendations) {
		return false
	}

	// check that the order for each recommendation is unique
	// TODO - if model is expanded to multiple advice letters, this should check uniqueness within each letter
	recsWithUniqueOrders := lo.UniqBy(m.recommendations, func(rec models.TRBAdviceLetterRecommendation) int {
		return rec.OrderInLetter
	})
	if len(recsWithUniqueOrders) != len(m.recommendations) {
		return false
	}

	// get sorted list of orders
	// TODO - if model is expanded to multiple advice letters, this will need to be done for each letter
	orders := m.getOrders()
	slices.Sort(orders)

	// check that recommendation order starts at the correct number
	if len(orders) > 0 && orders[0] != InitialOrder {
		return false
	}

	// check that recommendation orders are contiguous
	contiguousOrders := lo.RangeFrom(InitialOrder, len(orders))
	//lint:ignore S1008 directly return false to continue the same pattern as the rest of the method
	if !slices.Equal(orders, contiguousOrders) {
		return false
	}

	return true
}

// Used to match the same interface as the actual store (RecommendationStore)
func (m *recommendationOrderModel) CreateTRBAdviceLetterRecommendation(
	_ context.Context,
	recommendation *models.TRBAdviceLetterRecommendation,
) (*models.TRBAdviceLetterRecommendation, error) {
	// TODO - potentially inline this (address comments on that method)
	newRecommendation, err := m.insertNewRecommendation(*recommendation)
	if err != nil {
		return nil, err
	}

	return newRecommendation, nil
}

// insert recommendation, mimicking the behavior of the database that'll be used in production
// per UX, new recommendations should be added to the end - see Zoe's comment on https://jiraent.cms.gov/browse/EASI-3140
// returns an error if preconditions or postconditions are violated
func (m *recommendationOrderModel) insertNewRecommendation(
	newRecommendation models.TRBAdviceLetterRecommendation,
) (*models.TRBAdviceLetterRecommendation, error) {
	// TODO - should these preconditions be used by test generation code instead?

	// precondition - new recommendation must have a different ID from all existing recommendations
	for _, existingRecommendation := range m.recommendations {
		if existingRecommendation.ID == newRecommendation.ID {
			// TODO - should this a custom error type to represent precondition violation?
			return nil, errors.New("precondition violated on insertion - new recommendation didn't have a unique ID")
		}
	}

	// TODO - if model is expanded to multiple advice letters, this should check that the new recommendation matches *some* request's ID
	// TODO - if advice letter ID is added to recommendation model, this should check that the new recommendation matches the letter ID
	// TODO - if multiple requests+letters, check that matching letter points to the same recommendation
	// precondition - new recommendation must have the correct request ID
	if newRecommendation.TRBRequestID != m.trbRequestID {
		return nil, errors.New("precondition violated on insertion - new recommendation didn't have the correct request ID")
	}

	existingOrders := m.getOrders()

	if len(existingOrders) == 0 {
		newRecommendation.OrderInLetter = InitialOrder
	} else {
		newRecommendation.OrderInLetter = slices.Max(existingOrders) + 1
	}

	m.recommendations = append(m.recommendations, newRecommendation)

	return &newRecommendation, nil
}

// TODO - should eventually wrap or delegate to actual business logic
// takes a map of recommendation IDs to their new orders
func (m *recommendationOrderModel) updateRecommendationOrder(newOrder map[uuid.UUID]int) error {
	// TODO - should these preconditions be used by test generation code instead?

	// precondition - all recommendations in the new order must already exist
	for recommendationID := range newOrder {
		if !slices.ContainsFunc(m.recommendations, func(recommendation models.TRBAdviceLetterRecommendation) bool {
			return recommendation.ID == recommendationID
		}) {
			return errors.New("precondition violated on update - recommendation specified in new order didn't exist")
		}
	}

	// precondition - newOrder has the same length as recommendations
	if len(newOrder) != len(m.recommendations) {
		return errors.New("precondition violated on update - new order didn't have the same length as existing recommendations")
	}

	// TODO - precondition - all recommendations in newOrder should have unique IDs?
	// TODO - checked by checkInvariants(), maybe just check in test generation code

	// TODO - precondition - all orders in newOrder should be unique and contiguous
	// TODO - checked by checkInvariants(), maybe just check in test generation code

	for _, recommendation := range m.recommendations {
		newOrder, ok := newOrder[recommendation.ID]
		if !ok {
			panic("not sure how to handle this, especially in production code")
		}
		recommendation.OrderInLetter = newOrder
	}

	return nil
}

// Used to match the same interface as the actual store (RecommendationStore)
func (m *recommendationOrderModel) DeleteTRBAdviceLetterRecommendation(
	ctx context.Context,
	id uuid.UUID,
) (*models.TRBAdviceLetterRecommendation, error) {
	// TODO - potentially inline this (address comments on that method)
	deletedRecommendation, err := m.deleteRecommendation(id)
	if err != nil {
		return nil, err
	}

	return deletedRecommendation, nil
}

// TODO - should eventually wrap or delegate to actual business logic
func (m *recommendationOrderModel) deleteRecommendation(recommendationToDeleteID uuid.UUID) (*models.TRBAdviceLetterRecommendation, error) {
	// TODO - should these preconditions be used by test generation code instead?
	// TODO - should this be checked at all, or is deleting a nonexistent recommendation just a no-op?

	// precondition - recommendation must exist
	if !slices.ContainsFunc(m.recommendations, func(recommendation models.TRBAdviceLetterRecommendation) bool {
		return recommendation.ID == recommendationToDeleteID
	}) {
		return nil, errors.New("precondition violated on deletion - recommendation to be deleted wasn't present")
	}

	// loop through recommendations; once recommendation to delete is found, remove it, then shift all subsequent recommendations' order down by 1
	var deletedRecommendation *models.TRBAdviceLetterRecommendation

	// TODO - may not need this - just used deletedRecommendation == true to know when the rec to delete is found
	// deletedRecommendationFound := false

	newRecommendations := []models.TRBAdviceLetterRecommendation{}

	for _, recommendation := range m.recommendations {
		if recommendation.ID == recommendationToDeleteID {
			// deletedRecommendationFound = true
			deletedRecommendation = &recommendation
			continue // skip adding this recommendation to the new list
		}

		// if deletedRecommendationFound {
		if deletedRecommendation != nil {
			recommendation.OrderInLetter--
		}

		newRecommendations = append(newRecommendations, recommendation)
	}

	m.recommendations = newRecommendations
	return deletedRecommendation, nil
}
