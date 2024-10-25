package resolvers

import (
	"github.com/lib/pq"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// TestTRBGuidanceLetterInsightCRUD tests CRUD for TRB guidance letter insights
func (s *ResolverSuite) TestTRBGuidanceLetterInsightCRUD() {
	ctx := s.testConfigs.Context
	anonEua := "ANON"
	store := s.testConfigs.Store

	s.Run("create/update/fetch TRB request feedback", func() {
		trbRequest := models.NewTRBRequest(anonEua)
		trbRequest.Type = models.TRBTNeedHelp
		trbRequest.State = models.TRBRequestStateOpen
		trbRequest, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, store)
		s.NoError(err)

		// Test creation of an insight
		toCreate := models.TRBGuidanceLetterInsight{
			TRBRequestID: trbRequest.ID,
			Title:        "Restart your computer",
			Insight:      "I recommend you restart your computer",
			Links:        pq.StringArray{"google.com", "askjeeves.com"},
			Category:     models.TRBGuidanceLetterInsightCategoryRecommendation,
		}

		created, err := CreateTRBGuidanceLetterInsight(ctx, store, &toCreate)
		s.NoError(err)
		s.EqualValues(toCreate.Title, created.Title)
		s.EqualValues(toCreate.Insight, created.Insight)
		s.EqualValues(toCreate.Links[0], created.Links[0])
		s.EqualValues(toCreate.Links[1], created.Links[1])
		s.EqualValues(toCreate.Category, created.Category)
		s.EqualValues(toCreate.PositionInLetter.Int64, 0)

		// Test fetch of insights list
		insights, err := GetTRBGuidanceLetterInsightsByTRBRequestID(ctx, store, trbRequest.ID)
		s.NoError(err)
		s.True(len(insights) == 1)

		linksChanges := []string{"bing.com", "yahoo.com", "pets.com"}
		changes := map[string]interface{}{
			"id":           created.ID,
			"trbRequestId": trbRequest.ID.String(),
			"title":        "Restart your PC",
			"insight":      "I recommend you restart your PC",
			"links":        linksChanges,
		}
		err = ApplyChangesAndMetaData(changes, created, appcontext.Principal(ctx))
		s.NoError(err)

		// Test updating an insight
		updated, err := UpdateTRBGuidanceLetterInsight(ctx, store, changes)
		s.NoError(err)
		s.EqualValues(changes["title"], updated.Title)
		s.EqualValues(changes["insight"], updated.Insight)
		s.EqualValues(linksChanges[0], updated.Links[0])
		s.EqualValues(linksChanges[1], updated.Links[1])
		s.EqualValues(linksChanges[2], updated.Links[2])

		// Test deletion of an insight
		_, err = DeleteTRBGuidanceLetterInsight(ctx, store, created.ID)
		s.NoError(err)
	})

	s.Run("cannot update deleted TRB insight", func() {
		trbRequest := models.NewTRBRequest(anonEua)
		trbRequest.Type = models.TRBTNeedHelp
		trbRequest.State = models.TRBRequestStateOpen
		trbRequest, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, store)
		s.NoError(err)

		// Test creation of an insight
		toCreate := models.TRBGuidanceLetterInsight{
			TRBRequestID: trbRequest.ID,
			Title:        "Restart your computer",
			Insight:      "I recommend you restart your computer",
			Links:        pq.StringArray{"google.com", "askjeeves.com"},
			Category:     models.TRBGuidanceLetterInsightCategoryRecommendation,
		}

		// Create an insight
		created, err := CreateTRBGuidanceLetterInsight(ctx, store, &toCreate)
		s.NoError(err)

		// Delete the insight
		_, err = DeleteTRBGuidanceLetterInsight(ctx, store, created.ID)
		s.NoError(err)

		// Attempt to update the insight
		linksChanges := []string{"bing.com", "yahoo.com", "pets.com"}
		changes := map[string]interface{}{
			"id":           created.ID,
			"trbRequestId": trbRequest.ID.String(),
			"title":        "Restart your PC",
			"insight":      "I recommend you restart your PC",
			"links":        linksChanges,
		}

		// This update should fail, since the resolver won't be able to fetch the row
		_, err = UpdateTRBGuidanceLetterInsight(ctx, store, changes)
		s.Error(err)
	})

	s.Run("deleting an insight updates other insights' positions to close any gaps", func() {
		trbRequest := models.NewTRBRequest(anonEua)
		trbRequest.Type = models.TRBTNeedHelp
		trbRequest.State = models.TRBRequestStateOpen
		trbRequest, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, store)
		s.NoError(err)

		createdInsights := []*models.TRBGuidanceLetterInsight{}
		for i := 0; i < 3; i++ {
			toCreate := models.TRBGuidanceLetterInsight{
				TRBRequestID: trbRequest.ID,
				Title:        "Restart your computer",
				Insight:      "I recommend you restart your computer",
				Links:        pq.StringArray{"google.com", "askjeeves.com"},
				Category:     models.TRBGuidanceLetterInsightCategoryRecommendation,
			}
			created, err := CreateTRBGuidanceLetterInsight(ctx, store, &toCreate)
			s.NoError(err)
			s.EqualValues(i, created.PositionInLetter.ValueOrZero()) // check that positions were ordered oldest-to-newest during creation
			createdInsights = append(createdInsights, created)
		}

		// delete insight in the middle of the order
		_, err = DeleteTRBGuidanceLetterInsight(ctx, store, createdInsights[1].ID)
		s.NoError(err)

		// check that the last insight's position was adjusted from 2 to 1 to close the gap
		lastInsightAfterDelete, err := store.GetTRBGuidanceLetterInsightByID(ctx, createdInsights[2].ID)
		s.NoError(err)
		s.EqualValues(1, lastInsightAfterDelete.PositionInLetter.ValueOrZero())
	})
}
