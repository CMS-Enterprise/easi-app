package insights

import (
	"testing"

	"github.com/google/uuid"
	"github.com/guregu/null"
	"github.com/stretchr/testify/assert"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func TestIsNewRecommendationOrderValid(t *testing.T) {
	t.Run("happy path - valid new order for the existing recommendations", func(t *testing.T) {
		trbRequestID := uuid.New()

		currentRecs := []*models.TRBGuidanceLetterInsight{
			{
				BaseStruct: models.BaseStruct{
					ID: uuid.New(),
				},
				TRBRequestID:     trbRequestID,
				PositionInLetter: null.IntFrom(0),
				Title:            "Currently at the start, will be reordered to the end",
				Category:         models.TRBGuidanceLetterRecommendationCategoryRecommendation,
			},
			{
				BaseStruct: models.BaseStruct{
					ID: uuid.New(),
				},
				TRBRequestID:     trbRequestID,
				PositionInLetter: null.IntFrom(1),
				Title:            "Currently at the end, will be reordered to the start",
				Category:         models.TRBGuidanceLetterRecommendationCategoryRecommendation,
			},
			{
				BaseStruct: models.BaseStruct{
					ID: uuid.New(),
				},
				TRBRequestID:     trbRequestID,
				PositionInLetter: null.IntFrom(0),
				Title:            "Currently at the start, will be reordered to the end",
				Category:         models.TRBGuidanceLetterRecommendationCategoryConsideration,
			},
			{
				BaseStruct: models.BaseStruct{
					ID: uuid.New(),
				},
				TRBRequestID:     trbRequestID,
				PositionInLetter: null.IntFrom(1),
				Title:            "Currently at the end, will be reordered to the start",
				Category:         models.TRBGuidanceLetterRecommendationCategoryConsideration,
			},
		}
		newOrder := []uuid.UUID{currentRecs[1].ID, currentRecs[0].ID, currentRecs[2].ID, currentRecs[3].ID}

		err := IsNewInsightOrderValid(currentRecs, newOrder)
		assert.NoError(t, err)
	})

	t.Run("newOrder has more IDs than there are current recommendations - invalid", func(t *testing.T) {
		currentRecs := []*models.TRBGuidanceLetterInsight{}
		newOrder := []uuid.UUID{uuid.New()}

		err := IsNewInsightOrderValid(currentRecs, newOrder)
		assert.Error(t, err)
	})

	t.Run("newOrder has fewer IDs than there are current recommendations - invalid", func(t *testing.T) {
		trbRequestID := uuid.New()

		currentRecs := []*models.TRBGuidanceLetterInsight{
			{
				BaseStruct: models.BaseStruct{
					ID: uuid.New(),
				},
				TRBRequestID:     trbRequestID,
				PositionInLetter: null.IntFrom(0),
				Title:            "A single current recommendation",
				Category:         models.TRBGuidanceLetterRecommendationCategoryRecommendation,
			},
		}
		newOrder := []uuid.UUID{}

		err := IsNewInsightOrderValid(currentRecs, newOrder)
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

		currentRecs := []*models.TRBGuidanceLetterInsight{
			{
				BaseStruct: models.BaseStruct{
					ID: currentRecIDs[0],
				},
				TRBRequestID:     trbRequestID,
				PositionInLetter: null.IntFrom(0),
				Title:            "Current recommendation 0",
				Category:         models.TRBGuidanceLetterRecommendationCategoryRecommendation,
			},
			{
				BaseStruct: models.BaseStruct{
					ID: currentRecIDs[1],
				},
				TRBRequestID:     trbRequestID,
				PositionInLetter: null.IntFrom(1),
				Title:            "Current recommendation 1",
				Category:         models.TRBGuidanceLetterRecommendationCategoryRecommendation,
			},
			{
				BaseStruct: models.BaseStruct{
					ID: currentRecIDs[2],
				},
				TRBRequestID:     trbRequestID,
				PositionInLetter: null.IntFrom(2),
				Title:            "Current recommendation 2",
				Category:         models.TRBGuidanceLetterRecommendationCategoryRecommendation,
			},
		}

		invalidID := uuid.MustParse("6f9aab2b-56a6-4562-a938-202f5f520a58") // invalid because it doesn't match any current recommendation
		newOrder := []uuid.UUID{
			currentRecIDs[0],
			currentRecIDs[1],
			invalidID,
		}

		err := IsNewInsightOrderValid(currentRecs, newOrder)
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

		currentRecs := []*models.TRBGuidanceLetterInsight{
			{
				BaseStruct: models.BaseStruct{
					ID: currentRecIDs[0],
				},
				TRBRequestID:     trbRequestID,
				PositionInLetter: null.IntFrom(0),
				Title:            "Current recommendation 0",
				Category:         models.TRBGuidanceLetterRecommendationCategoryRecommendation,
			},
			{
				BaseStruct: models.BaseStruct{
					ID: currentRecIDs[1],
				},
				TRBRequestID:     trbRequestID,
				PositionInLetter: null.IntFrom(1),
				Title:            "Current recommendation 1",
				Category:         models.TRBGuidanceLetterRecommendationCategoryRecommendation,
			},
			{
				BaseStruct: models.BaseStruct{
					ID: currentRecIDs[2],
				},
				TRBRequestID:     trbRequestID,
				PositionInLetter: null.IntFrom(2),
				Title:            "Current recommendation 2",
				Category:         models.TRBGuidanceLetterRecommendationCategoryRecommendation,
			},
		}

		newOrder := []uuid.UUID{
			currentRecIDs[0],
			currentRecIDs[1],
			currentRecIDs[1], // duplicate - this should make newOrder invalid
		}

		err := IsNewInsightOrderValid(currentRecs, newOrder)
		assert.Error(t, err)
	})
}
