package recommendations

import (
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/easi-app/pkg/models"
)

func intPointer(i int) *int {
	return &i
}

func TestIsNewRecommendationOrderValid(t *testing.T) {
	t.Run("happy path - valid new order for the existing recommendations", func(t *testing.T) {
		trbRequestID := uuid.New()

		currentRecs := []*models.TRBAdviceLetterRecommendation{
			{
				BaseStruct: models.BaseStruct{
					ID: uuid.New(),
				},
				TRBRequestID:     trbRequestID,
				PositionInLetter: intPointer(0),
				Title:            "Currently at the start, will be reordered to the end",
			},
			{
				BaseStruct: models.BaseStruct{
					ID: uuid.New(),
				},
				TRBRequestID:     trbRequestID,
				PositionInLetter: intPointer(1),
				Title:            "Currently at the end, will be reordered to the start",
			},
		}
		newOrder := []uuid.UUID{currentRecs[1].ID, currentRecs[0].ID}

		err := IsNewRecommendationOrderValid(currentRecs, newOrder)
		assert.NoError(t, err)
	})

	t.Run("newOrder has more IDs than there are current recommendations - invalid", func(t *testing.T) {
		currentRecs := []*models.TRBAdviceLetterRecommendation{}
		newOrder := []uuid.UUID{uuid.New()}

		err := IsNewRecommendationOrderValid(currentRecs, newOrder)
		assert.Error(t, err)
	})

	t.Run("newOrder has fewer IDs than there are current recommendations - invalid", func(t *testing.T) {
		trbRequestID := uuid.New()

		currentRecs := []*models.TRBAdviceLetterRecommendation{
			{
				BaseStruct: models.BaseStruct{
					ID: uuid.New(),
				},
				TRBRequestID:     trbRequestID,
				PositionInLetter: intPointer(0),
				Title:            "A single current recommendation",
			},
		}
		newOrder := []uuid.UUID{}

		err := IsNewRecommendationOrderValid(currentRecs, newOrder)
		assert.Error(t, err)
	})

	t.Run("newOrder has an ID that is not in the current recommendations - invalid", func(t *testing.T) {
		trbRequestID := uuid.New()

		// hardcoded IDs to make sure this test is deterministic and easily understandable
		// we can set the leading hex digits arbitrarily; the "4" and "a" are necessary to identify these as v4 UUIDs
		currentRecIDs := []uuid.UUID{
			uuid.MustParse("10000000-0000-4000-a000-000000000000"),
			uuid.MustParse("20000000-0000-4000-a000-000000000000"),
			uuid.MustParse("30000000-0000-4000-a000-000000000000"),
		}

		currentRecs := []*models.TRBAdviceLetterRecommendation{
			{
				BaseStruct: models.BaseStruct{
					ID: currentRecIDs[0],
				},
				TRBRequestID:     trbRequestID,
				PositionInLetter: intPointer(0),
				Title:            "Current recommendation 0",
			},
			{
				BaseStruct: models.BaseStruct{
					ID: currentRecIDs[1],
				},
				TRBRequestID:     trbRequestID,
				PositionInLetter: intPointer(1),
				Title:            "Current recommendation 1",
			},
			{
				BaseStruct: models.BaseStruct{
					ID: currentRecIDs[2],
				},
				TRBRequestID:     trbRequestID,
				PositionInLetter: intPointer(2),
				Title:            "Current recommendation 2",
			},
		}

		invalidID := uuid.MustParse("6f9aab2b-56a6-4562-a938-202f5f520a58") // invalid because it doesn't match any current recommendation
		newOrder := []uuid.UUID{
			currentRecIDs[0],
			currentRecIDs[1],
			invalidID,
		}

		err := IsNewRecommendationOrderValid(currentRecs, newOrder)
		assert.Error(t, err)
	})

	t.Run("newOrder has at least one duplicate ID - invalid", func(t *testing.T) {
		trbRequestID := uuid.New()

		// hardcoded IDs to make sure this test is deterministic and easily understandable
		// we can set the leading hex digits arbitrarily; the "4" and "a" are necessary to identify these as v4 UUIDs
		currentRecIDs := []uuid.UUID{
			uuid.MustParse("10000000-0000-4000-a000-000000000000"),
			uuid.MustParse("20000000-0000-4000-a000-000000000000"),
			uuid.MustParse("30000000-0000-4000-a000-000000000000"),
		}

		currentRecs := []*models.TRBAdviceLetterRecommendation{
			{
				BaseStruct: models.BaseStruct{
					ID: currentRecIDs[0],
				},
				TRBRequestID:     trbRequestID,
				PositionInLetter: intPointer(0),
				Title:            "Current recommendation 0",
			},
			{
				BaseStruct: models.BaseStruct{
					ID: currentRecIDs[1],
				},
				TRBRequestID:     trbRequestID,
				PositionInLetter: intPointer(1),
				Title:            "Current recommendation 1",
			},
			{
				BaseStruct: models.BaseStruct{
					ID: currentRecIDs[2],
				},
				TRBRequestID:     trbRequestID,
				PositionInLetter: intPointer(2),
				Title:            "Current recommendation 2",
			},
		}

		newOrder := []uuid.UUID{
			currentRecIDs[0],
			currentRecIDs[1],
			currentRecIDs[1], // duplicate - this should make newOrder invalid
		}

		err := IsNewRecommendationOrderValid(currentRecs, newOrder)
		assert.Error(t, err)
	})
}
