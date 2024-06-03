package resolvers

import (
	"github.com/lib/pq"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

// TestTRBAdviceLetterRecommendationCRUD tests CRUD for TRB advice letter recommendations
func (suite *ResolverSuite) TestTRBAdviceLetterRecommendationCRUD() {
	ctx := suite.testConfigs.Context
	anonEua := "ANON"
	store := suite.testConfigs.Store

	suite.Run("create/update/fetch TRB request feedback", func() {
		trbRequest := models.NewTRBRequest(anonEua)
		trbRequest.Type = models.TRBTNeedHelp
		trbRequest.State = models.TRBRequestStateOpen
		trbRequest, err := CreateTRBRequest(suite.testConfigs.Context, models.TRBTBrainstorm, store)
		suite.NoError(err)

		// Test creation of a recommendation
		toCreate := models.TRBAdviceLetterRecommendation{
			TRBRequestID:   trbRequest.ID,
			Title:          "Restart your computer",
			Recommendation: "I recommend you restart your computer",
			Links:          pq.StringArray{"google.com", "askjeeves.com"},
		}

		created, err := CreateTRBAdviceLetterRecommendation(ctx, store, &toCreate)
		suite.NoError(err)
		suite.EqualValues(toCreate.Title, created.Title)
		suite.EqualValues(toCreate.Recommendation, created.Recommendation)
		suite.EqualValues(toCreate.Links[0], created.Links[0])
		suite.EqualValues(toCreate.Links[1], created.Links[1])

		// Test fetch of recommendations list
		recommendations, err := GetTRBAdviceLetterRecommendationsByTRBRequestID(ctx, store, trbRequest.ID)
		suite.NoError(err)
		suite.True(len(recommendations) == 1)

		linksChanges := []string{"bing.com", "yahoo.com", "pets.com"}
		changes := map[string]interface{}{
			"id":             created.ID,
			"trbRequestId":   trbRequest.ID.String(),
			"title":          "Restart your PC",
			"recommendation": "I recommend you restart your PC",
			"links":          linksChanges,
		}
		err = ApplyChangesAndMetaData(changes, created, appcontext.Principal(ctx))
		suite.NoError(err)

		// Test updating a recommendation
		updated, err := UpdateTRBAdviceLetterRecommendation(ctx, store, changes)
		suite.NoError(err)
		suite.EqualValues(changes["title"], updated.Title)
		suite.EqualValues(changes["recommendation"], updated.Recommendation)
		suite.EqualValues(linksChanges[0], updated.Links[0])
		suite.EqualValues(linksChanges[1], updated.Links[1])
		suite.EqualValues(linksChanges[2], updated.Links[2])

		// Test deletion of a recommendation
		_, err = DeleteTRBAdviceLetterRecommendation(ctx, store, created.ID)
		suite.NoError(err)
	})

	suite.Run("cannot update deleted TRB recommendation", func() {
		trbRequest := models.NewTRBRequest(anonEua)
		trbRequest.Type = models.TRBTNeedHelp
		trbRequest.State = models.TRBRequestStateOpen
		trbRequest, err := CreateTRBRequest(suite.testConfigs.Context, models.TRBTBrainstorm, store)
		suite.NoError(err)

		// Test creation of a recommendation
		toCreate := models.TRBAdviceLetterRecommendation{
			TRBRequestID:   trbRequest.ID,
			Title:          "Restart your computer",
			Recommendation: "I recommend you restart your computer",
			Links:          pq.StringArray{"google.com", "askjeeves.com"},
		}

		// Create a recommendation
		created, err := CreateTRBAdviceLetterRecommendation(ctx, store, &toCreate)
		suite.NoError(err)

		// Delete the recommendation
		_, err = DeleteTRBAdviceLetterRecommendation(ctx, store, created.ID)
		suite.NoError(err)

		// Attempt to update the recommendation
		linksChanges := []string{"bing.com", "yahoo.com", "pets.com"}
		changes := map[string]interface{}{
			"id":             created.ID,
			"trbRequestId":   trbRequest.ID.String(),
			"title":          "Restart your PC",
			"recommendation": "I recommend you restart your PC",
			"links":          linksChanges,
		}

		// This update should fail, since the resolver won't be able to fetch the row
		_, err = UpdateTRBAdviceLetterRecommendation(ctx, store, changes)
		suite.Error(err)
	})

	suite.Run("deleting a recommendation updates other recommendations' positions to close any gaps", func() {
		trbRequest := models.NewTRBRequest(anonEua)
		trbRequest.Type = models.TRBTNeedHelp
		trbRequest.State = models.TRBRequestStateOpen
		trbRequest, err := CreateTRBRequest(suite.testConfigs.Context, models.TRBTBrainstorm, store)
		suite.NoError(err)

		createdRecommendations := []*models.TRBAdviceLetterRecommendation{}
		for i := 0; i < 3; i++ {
			toCreate := models.TRBAdviceLetterRecommendation{
				TRBRequestID:   trbRequest.ID,
				Title:          "Restart your computer",
				Recommendation: "I recommend you restart your computer",
				Links:          pq.StringArray{"google.com", "askjeeves.com"},
			}
			created, err := CreateTRBAdviceLetterRecommendation(ctx, store, &toCreate)
			suite.NoError(err)
			suite.EqualValues(i, created.PositionInLetter.ValueOrZero()) // check that positions were ordered oldest-to-newest during creation
			createdRecommendations = append(createdRecommendations, created)
		}

		// delete recommendation in the middle of the order
		_, err = DeleteTRBAdviceLetterRecommendation(ctx, store, createdRecommendations[1].ID)
		suite.NoError(err)

		// check that the last recommendation's position was adjusted from 2 to 1 to close the gap
		lastRecommendationAfterDelete, err := store.GetTRBAdviceLetterRecommendationByID(ctx, createdRecommendations[2].ID)
		suite.NoError(err)
		suite.EqualValues(1, lastRecommendationAfterDelete.PositionInLetter.ValueOrZero())
	})
}
