package resolvers

import (
	"github.com/lib/pq"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// TestTRBAdviceLetterRecommendationCRUD tests CRUD for TRB advice letter recommendations
func (s *ResolverSuite) TestTRBAdviceLetterRecommendationCRUD() {
	ctx := s.testConfigs.Context
	anonEua := "ANON"
	store := s.testConfigs.Store

	s.Run("create/update/fetch TRB request feedback", func() {
		trbRequest := models.NewTRBRequest(anonEua)
		trbRequest.Type = models.TRBTNeedHelp
		trbRequest.State = models.TRBRequestStateOpen
		trbRequest, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, store)
		s.NoError(err)

		// Test creation of a recommendation
		toCreate := models.TRBAdviceLetterRecommendation{
			TRBRequestID:   trbRequest.ID,
			Title:          "Restart your computer",
			Recommendation: "I recommend you restart your computer",
			Links:          pq.StringArray{"google.com", "askjeeves.com"},
		}

		created, err := CreateTRBAdviceLetterRecommendation(ctx, store, &toCreate)
		s.NoError(err)
		s.EqualValues(toCreate.Title, created.Title)
		s.EqualValues(toCreate.Recommendation, created.Recommendation)
		s.EqualValues(toCreate.Links[0], created.Links[0])
		s.EqualValues(toCreate.Links[1], created.Links[1])

		// Test fetch of recommendations list
		recommendations, err := GetTRBAdviceLetterRecommendationsByTRBRequestID(ctx, store, trbRequest.ID)
		s.NoError(err)
		s.True(len(recommendations) == 1)

		linksChanges := []string{"bing.com", "yahoo.com", "pets.com"}
		changes := map[string]interface{}{
			"id":             created.ID,
			"trbRequestId":   trbRequest.ID.String(),
			"title":          "Restart your PC",
			"recommendation": "I recommend you restart your PC",
			"links":          linksChanges,
		}
		err = ApplyChangesAndMetaData(changes, created, appcontext.Principal(ctx))
		s.NoError(err)

		// Test updating a recommendation
		updated, err := UpdateTRBAdviceLetterRecommendation(ctx, store, changes)
		s.NoError(err)
		s.EqualValues(changes["title"], updated.Title)
		s.EqualValues(changes["recommendation"], updated.Recommendation)
		s.EqualValues(linksChanges[0], updated.Links[0])
		s.EqualValues(linksChanges[1], updated.Links[1])
		s.EqualValues(linksChanges[2], updated.Links[2])

		// Test deletion of a recommendation
		_, err = DeleteTRBAdviceLetterRecommendation(ctx, store, created.ID)
		s.NoError(err)
	})

	s.Run("cannot update deleted TRB recommendation", func() {
		trbRequest := models.NewTRBRequest(anonEua)
		trbRequest.Type = models.TRBTNeedHelp
		trbRequest.State = models.TRBRequestStateOpen
		trbRequest, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, store)
		s.NoError(err)

		// Test creation of a recommendation
		toCreate := models.TRBAdviceLetterRecommendation{
			TRBRequestID:   trbRequest.ID,
			Title:          "Restart your computer",
			Recommendation: "I recommend you restart your computer",
			Links:          pq.StringArray{"google.com", "askjeeves.com"},
		}

		// Create a recommendation
		created, err := CreateTRBAdviceLetterRecommendation(ctx, store, &toCreate)
		s.NoError(err)

		// Delete the recommendation
		_, err = DeleteTRBAdviceLetterRecommendation(ctx, store, created.ID)
		s.NoError(err)

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
		s.Error(err)
	})

	s.Run("deleting a recommendation updates other recommendations' positions to close any gaps", func() {
		trbRequest := models.NewTRBRequest(anonEua)
		trbRequest.Type = models.TRBTNeedHelp
		trbRequest.State = models.TRBRequestStateOpen
		trbRequest, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, store)
		s.NoError(err)

		createdRecommendations := []*models.TRBAdviceLetterRecommendation{}
		for i := 0; i < 3; i++ {
			toCreate := models.TRBAdviceLetterRecommendation{
				TRBRequestID:   trbRequest.ID,
				Title:          "Restart your computer",
				Recommendation: "I recommend you restart your computer",
				Links:          pq.StringArray{"google.com", "askjeeves.com"},
			}
			created, err := CreateTRBAdviceLetterRecommendation(ctx, store, &toCreate)
			s.NoError(err)
			s.EqualValues(i, created.PositionInLetter.ValueOrZero()) // check that positions were ordered oldest-to-newest during creation
			createdRecommendations = append(createdRecommendations, created)
		}

		// delete recommendation in the middle of the order
		_, err = DeleteTRBAdviceLetterRecommendation(ctx, store, createdRecommendations[1].ID)
		s.NoError(err)

		// check that the last recommendation's position was adjusted from 2 to 1 to close the gap
		lastRecommendationAfterDelete, err := store.GetTRBAdviceLetterRecommendationByID(ctx, createdRecommendations[2].ID)
		s.NoError(err)
		s.EqualValues(1, lastRecommendationAfterDelete.PositionInLetter.ValueOrZero())
	})
}
