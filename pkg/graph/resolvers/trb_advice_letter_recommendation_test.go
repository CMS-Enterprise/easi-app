package resolvers

import (
	"context"

	"github.com/lib/pq"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

// TestTRBAdviceLetterRecommendationCRUD tests CRUD for TRB advice letter recommendations
func (s *ResolverSuite) TestTRBAdviceLetterRecommendationCRUD() {
	ctx := context.Background()
	anonEua := "ANON"
	store := s.testConfigs.Store
	trbRequest := models.NewTRBRequest(anonEua)
	trbRequest.Type = models.TRBTNeedHelp
	trbRequest.State = models.TRBRequestStateOpen
	trbRequest, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, store)
	s.NoError(err)

	s.Run("create/update/fetch TRB request feedback", func() {
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
			"id":             created.ID.String(),
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
}
