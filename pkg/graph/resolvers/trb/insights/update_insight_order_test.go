package insights

import (
	"testing"

	"github.com/google/uuid"
	"github.com/guregu/null"
	"github.com/stretchr/testify/assert"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func TestIsNewInsightOrderValid(t *testing.T) {
	t.Run("happy path - valid new order for the existing insights", func(t *testing.T) {
		trbRequestID := uuid.New()

		currentInsights := []*models.TRBGuidanceLetterInsight{
			{
				BaseStruct: models.BaseStruct{
					ID: uuid.New(),
				},
				TRBRequestID:     trbRequestID,
				PositionInLetter: null.IntFrom(0),
				Title:            "Currently at the start, will be reordered to the end",
				Category:         models.TRBGuidanceLetterInsightCategoryRecommendation,
			},
			{
				BaseStruct: models.BaseStruct{
					ID: uuid.New(),
				},
				TRBRequestID:     trbRequestID,
				PositionInLetter: null.IntFrom(1),
				Title:            "Currently at the end, will be reordered to the start",
				Category:         models.TRBGuidanceLetterInsightCategoryRecommendation,
			},
			{
				BaseStruct: models.BaseStruct{
					ID: uuid.New(),
				},
				TRBRequestID:     trbRequestID,
				PositionInLetter: null.IntFrom(0),
				Title:            "Currently at the start, will be reordered to the end",
				Category:         models.TRBGuidanceLetterInsightCategoryConsideration,
			},
			{
				BaseStruct: models.BaseStruct{
					ID: uuid.New(),
				},
				TRBRequestID:     trbRequestID,
				PositionInLetter: null.IntFrom(1),
				Title:            "Currently at the end, will be reordered to the start",
				Category:         models.TRBGuidanceLetterInsightCategoryConsideration,
			},
		}
		newOrder := []uuid.UUID{currentInsights[1].ID, currentInsights[0].ID, currentInsights[2].ID, currentInsights[3].ID}

		err := IsNewInsightOrderValid(currentInsights, newOrder)
		assert.NoError(t, err)
	})

	t.Run("newOrder has more IDs than there are current insights - invalid", func(t *testing.T) {
		currentInsights := []*models.TRBGuidanceLetterInsight{}
		newOrder := []uuid.UUID{uuid.New()}

		err := IsNewInsightOrderValid(currentInsights, newOrder)
		assert.Error(t, err)
	})

	t.Run("newOrder has fewer IDs than there are current insights - invalid", func(t *testing.T) {
		trbRequestID := uuid.New()

		currentInsights := []*models.TRBGuidanceLetterInsight{
			{
				BaseStruct: models.BaseStruct{
					ID: uuid.New(),
				},
				TRBRequestID:     trbRequestID,
				PositionInLetter: null.IntFrom(0),
				Title:            "A single current recommendation",
				Category:         models.TRBGuidanceLetterInsightCategoryRecommendation,
			},
		}
		newOrder := []uuid.UUID{}

		err := IsNewInsightOrderValid(currentInsights, newOrder)
		assert.Error(t, err)
	})

	t.Run("newOrder has an ID that is not in the current insights - invalid", func(t *testing.T) {
		trbRequestID := uuid.New()

		// hardcoded IDs to make sure this test is deterministic and easily understandable
		// we can set the leading hex digits arbitrarily; the "4" and "a" are necessary to identify these as v4 UUIDs
		currentInsightIDs := []uuid.UUID{
			uuid.MustParse("10000000-0000-4000-a000-000000000000"),
			uuid.MustParse("20000000-0000-4000-a000-000000000000"),
			uuid.MustParse("30000000-0000-4000-a000-000000000000"),
		}

		currentInsights := []*models.TRBGuidanceLetterInsight{
			{
				BaseStruct: models.BaseStruct{
					ID: currentInsightIDs[0],
				},
				TRBRequestID:     trbRequestID,
				PositionInLetter: null.IntFrom(0),
				Title:            "Current recommendation 0",
				Category:         models.TRBGuidanceLetterInsightCategoryRecommendation,
			},
			{
				BaseStruct: models.BaseStruct{
					ID: currentInsightIDs[1],
				},
				TRBRequestID:     trbRequestID,
				PositionInLetter: null.IntFrom(1),
				Title:            "Current recommendation 1",
				Category:         models.TRBGuidanceLetterInsightCategoryRecommendation,
			},
			{
				BaseStruct: models.BaseStruct{
					ID: currentInsightIDs[2],
				},
				TRBRequestID:     trbRequestID,
				PositionInLetter: null.IntFrom(2),
				Title:            "Current recommendation 2",
				Category:         models.TRBGuidanceLetterInsightCategoryRecommendation,
			},
		}

		invalidID := uuid.MustParse("6f9aab2b-56a6-4562-a938-202f5f520a58") // invalid because it doesn't match any current insight
		newOrder := []uuid.UUID{
			currentInsightIDs[0],
			currentInsightIDs[1],
			invalidID,
		}

		err := IsNewInsightOrderValid(currentInsights, newOrder)
		assert.Error(t, err)
	})

	t.Run("newOrder has at least one duplicate ID - invalid", func(t *testing.T) {
		trbRequestID := uuid.New()

		// hardcoded IDs to make sure this test is deterministic and easily understandable
		// we can set the leading hex digits arbitrarily; the "4" and "a" are necessary to identify these as v4 UUIDs
		currentInsightIDs := []uuid.UUID{
			uuid.MustParse("10000000-0000-4000-a000-000000000000"),
			uuid.MustParse("20000000-0000-4000-a000-000000000000"),
			uuid.MustParse("30000000-0000-4000-a000-000000000000"),
		}

		currentInsights := []*models.TRBGuidanceLetterInsight{
			{
				BaseStruct: models.BaseStruct{
					ID: currentInsightIDs[0],
				},
				TRBRequestID:     trbRequestID,
				PositionInLetter: null.IntFrom(0),
				Title:            "Current recommendation 0",
				Category:         models.TRBGuidanceLetterInsightCategoryRecommendation,
			},
			{
				BaseStruct: models.BaseStruct{
					ID: currentInsightIDs[1],
				},
				TRBRequestID:     trbRequestID,
				PositionInLetter: null.IntFrom(1),
				Title:            "Current recommendation 1",
				Category:         models.TRBGuidanceLetterInsightCategoryRecommendation,
			},
			{
				BaseStruct: models.BaseStruct{
					ID: currentInsightIDs[2],
				},
				TRBRequestID:     trbRequestID,
				PositionInLetter: null.IntFrom(2),
				Title:            "Current recommendation 2",
				Category:         models.TRBGuidanceLetterInsightCategoryRecommendation,
			},
		}

		newOrder := []uuid.UUID{
			currentInsightIDs[0],
			currentInsightIDs[1],
			currentInsightIDs[1], // duplicate - this should make newOrder invalid
		}

		err := IsNewInsightOrderValid(currentInsights, newOrder)
		assert.Error(t, err)
	})
}
