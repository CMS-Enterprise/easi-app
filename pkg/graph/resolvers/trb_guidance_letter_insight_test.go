package resolvers

import (
	"github.com/google/uuid"
	"github.com/lib/pq"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// TestTRBGuidanceLetterRecommendationCRUD tests CRUD for TRB guidance letter insights
func (s *ResolverSuite) TestTRBGuidanceLetterRecommendationCRUD() {
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
		toCreate := models.TRBGuidanceLetterInsight{
			TRBRequestID:   trbRequest.ID,
			Title:          "Restart your computer",
			Recommendation: "I recommend you restart your computer",
			Links:          pq.StringArray{"google.com", "askjeeves.com"},
			Category:       models.TRBGuidanceLetterInsightCategoryRecommendation,
		}

		created, err := CreateTRBGuidanceLetterInsight(ctx, store, &toCreate)
		s.NoError(err)
		s.EqualValues(toCreate.Title, created.Title)
		s.EqualValues(toCreate.Recommendation, created.Recommendation)
		s.EqualValues(toCreate.Links[0], created.Links[0])
		s.EqualValues(toCreate.Links[1], created.Links[1])
		s.EqualValues(toCreate.Category, created.Category)
		s.EqualValues(toCreate.PositionInLetter.Int64, 0)

		// Test fetch of recommendations list
		recommendations, err := GetTRBGuidanceLetterInsightsByTRBRequestID(ctx, store, trbRequest.ID)
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
		updated, err := UpdateTRBGuidanceLetterInsight(ctx, store, changes)
		s.NoError(err)
		s.EqualValues(changes["title"], updated.Title)
		s.EqualValues(changes["recommendation"], updated.Recommendation)
		s.EqualValues(linksChanges[0], updated.Links[0])
		s.EqualValues(linksChanges[1], updated.Links[1])
		s.EqualValues(linksChanges[2], updated.Links[2])

		// Test deletion of a recommendation
		_, err = DeleteTRBGuidanceLetterInsight(ctx, store, created.ID)
		s.NoError(err)
	})

	s.Run("cannot update deleted TRB recommendation", func() {
		trbRequest := models.NewTRBRequest(anonEua)
		trbRequest.Type = models.TRBTNeedHelp
		trbRequest.State = models.TRBRequestStateOpen
		trbRequest, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, store)
		s.NoError(err)

		// Test creation of a recommendation
		toCreate := models.TRBGuidanceLetterInsight{
			TRBRequestID:   trbRequest.ID,
			Title:          "Restart your computer",
			Recommendation: "I recommend you restart your computer",
			Links:          pq.StringArray{"google.com", "askjeeves.com"},
			Category:       models.TRBGuidanceLetterInsightCategoryRecommendation,
		}

		// Create a recommendation
		created, err := CreateTRBGuidanceLetterInsight(ctx, store, &toCreate)
		s.NoError(err)

		// Delete the recommendation
		_, err = DeleteTRBGuidanceLetterInsight(ctx, store, created.ID)
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
		_, err = UpdateTRBGuidanceLetterInsight(ctx, store, changes)
		s.Error(err)
	})

	s.Run("deleting a recommendation updates other recommendations' positions to close any gaps", func() {
		trbRequest := models.NewTRBRequest(anonEua)
		trbRequest.Type = models.TRBTNeedHelp
		trbRequest.State = models.TRBRequestStateOpen
		trbRequest, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, store)
		s.NoError(err)

		createdRecommendations := []*models.TRBGuidanceLetterInsight{}
		for i := 0; i < 3; i++ {
			toCreate := models.TRBGuidanceLetterInsight{
				TRBRequestID:   trbRequest.ID,
				Title:          "Restart your computer",
				Recommendation: "I recommend you restart your computer",
				Links:          pq.StringArray{"google.com", "askjeeves.com"},
				Category:       models.TRBGuidanceLetterInsightCategoryRecommendation,
			}
			created, err := CreateTRBGuidanceLetterInsight(ctx, store, &toCreate)
			s.NoError(err)
			s.EqualValues(i, created.PositionInLetter.ValueOrZero()) // check that positions were ordered oldest-to-newest during creation
			createdRecommendations = append(createdRecommendations, created)
		}

		// delete recommendation in the middle of the order
		_, err = DeleteTRBGuidanceLetterInsight(ctx, store, createdRecommendations[1].ID)
		s.NoError(err)

		// check that the last recommendation's position was adjusted from 2 to 1 to close the gap
		lastRecommendationAfterDelete, err := store.GetTRBGuidanceLetterInsightByID(ctx, createdRecommendations[2].ID)
		s.NoError(err)
		s.EqualValues(1, lastRecommendationAfterDelete.PositionInLetter.ValueOrZero())
	})

	s.Run("when creating a new insight, it gets added to the end of its category's order", func() {
		trbRequest := models.NewTRBRequest(anonEua)
		trbRequest.Type = models.TRBTNeedHelp
		trbRequest.State = models.TRBRequestStateOpen
		trbRequest, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, store)
		s.NoError(err)

		// add 2 insights of each category

		// create insights of recommendation category
		recommendationToCreate1 := models.TRBGuidanceLetterInsight{
			TRBRequestID:   trbRequest.ID,
			Title:          "Restart your computer1",
			Recommendation: "I recommend you restart your computer1",
			Links:          pq.StringArray{"google.com", "askjeeves.com"},
			Category:       models.TRBGuidanceLetterInsightCategoryRecommendation,
		}

		recommendationToCreate2 := models.TRBGuidanceLetterInsight{
			TRBRequestID:   trbRequest.ID,
			Title:          "Restart your computer2",
			Recommendation: "I recommend you restart your computer2",
			Links:          pq.StringArray{"google.com", "askjeeves.com"},
			Category:       models.TRBGuidanceLetterInsightCategoryRecommendation,
		}

		createdRecommendation1, err := CreateTRBGuidanceLetterInsight(ctx, store, &recommendationToCreate1)
		s.NoError(err)
		s.EqualValues(createdRecommendation1.PositionInLetter.Int64, int64(0))
		s.EqualValues(createdRecommendation1.Category, models.TRBGuidanceLetterInsightCategoryRecommendation)

		createdRecommendation2, err := CreateTRBGuidanceLetterInsight(ctx, store, &recommendationToCreate2)
		s.NoError(err)
		s.EqualValues(createdRecommendation2.PositionInLetter.Int64, int64(1))
		s.EqualValues(createdRecommendation2.Category, models.TRBGuidanceLetterInsightCategoryRecommendation)

		// create insights of consideration category
		considerationToCreate1 := models.TRBGuidanceLetterInsight{
			TRBRequestID:   trbRequest.ID,
			Title:          "Restart your computer3",
			Recommendation: "I consider you restart your computer1",
			Links:          pq.StringArray{"google.com", "askjeeves.com"},
			Category:       models.TRBGuidanceLetterInsightCategoryConsideration,
		}

		considerationToCreate2 := models.TRBGuidanceLetterInsight{
			TRBRequestID:   trbRequest.ID,
			Title:          "Restart your computer4",
			Recommendation: "I consider you restart your computer2",
			Links:          pq.StringArray{"google.com", "askjeeves.com"},
			Category:       models.TRBGuidanceLetterInsightCategoryConsideration,
		}

		createdConsideration1, err := CreateTRBGuidanceLetterInsight(ctx, store, &considerationToCreate1)
		s.NoError(err)
		s.EqualValues(createdConsideration1.PositionInLetter.Int64, int64(0))
		s.EqualValues(createdConsideration1.Category, models.TRBGuidanceLetterInsightCategoryConsideration)

		createdConsideration2, err := CreateTRBGuidanceLetterInsight(ctx, store, &considerationToCreate2)
		s.NoError(err)
		s.EqualValues(createdConsideration2.PositionInLetter.Int64, int64(1))
		s.EqualValues(createdConsideration2.Category, models.TRBGuidanceLetterInsightCategoryConsideration)

		// create insights of requirement category
		requirementToCreate1 := models.TRBGuidanceLetterInsight{
			TRBRequestID:   trbRequest.ID,
			Title:          "Restart your computer5",
			Recommendation: "I require you restart your computer1",
			Links:          pq.StringArray{"google.com", "askjeeves.com"},
			Category:       models.TRBGuidanceLetterInsightCategoryRequirement,
		}

		requirementToCreate2 := models.TRBGuidanceLetterInsight{
			TRBRequestID:   trbRequest.ID,
			Title:          "Restart your computer6",
			Recommendation: "I require you restart your computer2",
			Links:          pq.StringArray{"google.com", "askjeeves.com"},
			Category:       models.TRBGuidanceLetterInsightCategoryRequirement,
		}

		createdRequirement1, err := CreateTRBGuidanceLetterInsight(ctx, store, &requirementToCreate1)
		s.NoError(err)
		s.EqualValues(createdRequirement1.PositionInLetter.Int64, int64(0))
		s.EqualValues(createdRequirement1.Category, models.TRBGuidanceLetterInsightCategoryRequirement)

		createdRequirement2, err := CreateTRBGuidanceLetterInsight(ctx, store, &requirementToCreate2)
		s.NoError(err)
		s.EqualValues(createdRequirement2.PositionInLetter.Int64, int64(1))
		s.EqualValues(createdRequirement2.Category, models.TRBGuidanceLetterInsightCategoryRequirement)

		// add a third consideration, confirm index position
		considerationToCreate3 := models.TRBGuidanceLetterInsight{
			TRBRequestID:   trbRequest.ID,
			Title:          "Restart your computer7",
			Recommendation: "I consider you restart your computer2",
			Links:          pq.StringArray{"google.com", "askjeeves.com"},
			Category:       models.TRBGuidanceLetterInsightCategoryConsideration,
		}

		createdConsideration3, err := CreateTRBGuidanceLetterInsight(ctx, store, &considerationToCreate3)
		s.NoError(err)
		s.EqualValues(createdConsideration3.PositionInLetter.Int64, int64(2))
		s.EqualValues(createdConsideration3.Category, models.TRBGuidanceLetterInsightCategoryConsideration)
	})

	s.Run("when changing the order of insights, it updates the order properly with the category in mind", func() {
		trbRequest := models.NewTRBRequest(anonEua)
		trbRequest.Type = models.TRBTNeedHelp
		trbRequest.State = models.TRBRequestStateOpen
		trbRequest, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, store)
		s.NoError(err)

		// add 2 insights of each category

		// create insights of recommendation category
		recommendationToCreate1 := models.TRBGuidanceLetterInsight{
			TRBRequestID:   trbRequest.ID,
			Title:          "Restart your computer1",
			Recommendation: "I recommend you restart your computer1",
			Links:          pq.StringArray{"google.com", "askjeeves.com"},
			Category:       models.TRBGuidanceLetterInsightCategoryRecommendation,
		}

		recommendationToCreate2 := models.TRBGuidanceLetterInsight{
			TRBRequestID:   trbRequest.ID,
			Title:          "Restart your computer2",
			Recommendation: "I recommend you restart your computer2",
			Links:          pq.StringArray{"google.com", "askjeeves.com"},
			Category:       models.TRBGuidanceLetterInsightCategoryRecommendation,
		}

		createdRecommendation1, err := CreateTRBGuidanceLetterInsight(ctx, store, &recommendationToCreate1)
		s.NoError(err)
		s.EqualValues(createdRecommendation1.PositionInLetter.Int64, int64(0))
		s.EqualValues(createdRecommendation1.Category, models.TRBGuidanceLetterInsightCategoryRecommendation)

		createdRecommendation2, err := CreateTRBGuidanceLetterInsight(ctx, store, &recommendationToCreate2)
		s.NoError(err)
		s.EqualValues(createdRecommendation2.PositionInLetter.Int64, int64(1))
		s.EqualValues(createdRecommendation2.Category, models.TRBGuidanceLetterInsightCategoryRecommendation)

		// create insights of consideration category
		considerationToCreate1 := models.TRBGuidanceLetterInsight{
			TRBRequestID:   trbRequest.ID,
			Title:          "Restart your computer3",
			Recommendation: "I consider you restart your computer1",
			Links:          pq.StringArray{"google.com", "askjeeves.com"},
			Category:       models.TRBGuidanceLetterInsightCategoryConsideration,
		}

		considerationToCreate2 := models.TRBGuidanceLetterInsight{
			TRBRequestID:   trbRequest.ID,
			Title:          "Restart your computer4",
			Recommendation: "I consider you restart your computer2",
			Links:          pq.StringArray{"google.com", "askjeeves.com"},
			Category:       models.TRBGuidanceLetterInsightCategoryConsideration,
		}

		considerationToCreate3 := models.TRBGuidanceLetterInsight{
			TRBRequestID:   trbRequest.ID,
			Title:          "Restart your computer7",
			Recommendation: "I consider you restart your computer2",
			Links:          pq.StringArray{"google.com", "askjeeves.com"},
			Category:       models.TRBGuidanceLetterInsightCategoryConsideration,
		}

		createdConsideration1, err := CreateTRBGuidanceLetterInsight(ctx, store, &considerationToCreate1)
		s.NoError(err)
		s.EqualValues(createdConsideration1.PositionInLetter.Int64, int64(0))
		s.EqualValues(createdConsideration1.Category, models.TRBGuidanceLetterInsightCategoryConsideration)

		createdConsideration2, err := CreateTRBGuidanceLetterInsight(ctx, store, &considerationToCreate2)
		s.NoError(err)
		s.EqualValues(createdConsideration2.PositionInLetter.Int64, int64(1))
		s.EqualValues(createdConsideration2.Category, models.TRBGuidanceLetterInsightCategoryConsideration)

		createdConsideration3, err := CreateTRBGuidanceLetterInsight(ctx, store, &considerationToCreate3)
		s.NoError(err)
		s.EqualValues(createdConsideration3.PositionInLetter.Int64, int64(2))
		s.EqualValues(createdConsideration3.Category, models.TRBGuidanceLetterInsightCategoryConsideration)

		// create insights of requirement category
		requirementToCreate1 := models.TRBGuidanceLetterInsight{
			TRBRequestID:   trbRequest.ID,
			Title:          "Restart your computer5",
			Recommendation: "I require you restart your computer1",
			Links:          pq.StringArray{"google.com", "askjeeves.com"},
			Category:       models.TRBGuidanceLetterInsightCategoryRequirement,
		}

		requirementToCreate2 := models.TRBGuidanceLetterInsight{
			TRBRequestID:   trbRequest.ID,
			Title:          "Restart your computer6",
			Recommendation: "I require you restart your computer2",
			Links:          pq.StringArray{"google.com", "askjeeves.com"},
			Category:       models.TRBGuidanceLetterInsightCategoryRequirement,
		}

		createdRequirement1, err := CreateTRBGuidanceLetterInsight(ctx, store, &requirementToCreate1)
		s.NoError(err)
		s.EqualValues(createdRequirement1.PositionInLetter.Int64, int64(0))
		s.EqualValues(createdRequirement1.Category, models.TRBGuidanceLetterInsightCategoryRequirement)

		createdRequirement2, err := CreateTRBGuidanceLetterInsight(ctx, store, &requirementToCreate2)
		s.NoError(err)
		s.EqualValues(createdRequirement2.PositionInLetter.Int64, int64(1))
		s.EqualValues(createdRequirement2.Category, models.TRBGuidanceLetterInsightCategoryRequirement)

		// let's try swapping consideration 2 and 3
		updated, err := UpdateTRBGuidanceLetterInsightOrder(ctx, store, models.UpdateTRBGuidanceLetterInsightOrderInput{
			TrbRequestID: trbRequest.ID,
			NewOrder:     []uuid.UUID{createdConsideration1.ID, createdConsideration3.ID, createdConsideration2.ID},
			Category:     models.TRBGuidanceLetterInsightCategoryConsideration,
		})
		s.NoError(err)

		s.Len(updated, 3)
		s.EqualValues(updated[0].ID, createdConsideration1.ID)
		s.EqualValues(updated[1].ID, createdConsideration3.ID)
		s.EqualValues(updated[2].ID, createdConsideration2.ID)

		// confirm this had no effect on recommendations or requirements
		recommendations, err := store.GetTRBGuidanceLetterInsightsByTRBRequestIDAndCategory(ctx, trbRequest.ID, models.TRBGuidanceLetterInsightCategoryRecommendation)
		s.NoError(err)
		s.Len(recommendations, 2)
		s.EqualValues(recommendations[0].ID, createdRecommendation1.ID)
		s.EqualValues(recommendations[1].ID, createdRecommendation2.ID)

		requirements, err := store.GetTRBGuidanceLetterInsightsByTRBRequestIDAndCategory(ctx, trbRequest.ID, models.TRBGuidanceLetterInsightCategoryRequirement)
		s.NoError(err)
		s.Len(requirements, 2)
		s.EqualValues(requirements[0].ID, createdRequirement1.ID)
		s.EqualValues(requirements[1].ID, createdRequirement2.ID)
	})

	s.Run("when changing the category of an insight, it gets added to the end of the new category's order and reshuffles the old category's order to remove any holes", func() {
		trbRequest := models.NewTRBRequest(anonEua)
		trbRequest.Type = models.TRBTNeedHelp
		trbRequest.State = models.TRBRequestStateOpen
		trbRequest, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, store)
		s.NoError(err)

		// add 2 insights of each category

		// create insights of recommendation category
		recommendationToCreate1 := models.TRBGuidanceLetterInsight{
			TRBRequestID:   trbRequest.ID,
			Title:          "Restart your computer1",
			Recommendation: "I recommend you restart your computer1",
			Links:          pq.StringArray{"google.com", "askjeeves.com"},
			Category:       models.TRBGuidanceLetterInsightCategoryRecommendation,
		}

		recommendationToCreate2 := models.TRBGuidanceLetterInsight{
			TRBRequestID:   trbRequest.ID,
			Title:          "Restart your computer2",
			Recommendation: "I recommend you restart your computer2",
			Links:          pq.StringArray{"google.com", "askjeeves.com"},
			Category:       models.TRBGuidanceLetterInsightCategoryRecommendation,
		}

		createdRecommendation1, err := CreateTRBGuidanceLetterInsight(ctx, store, &recommendationToCreate1)
		s.NoError(err)
		s.EqualValues(createdRecommendation1.PositionInLetter.Int64, int64(0))
		s.EqualValues(createdRecommendation1.Category, models.TRBGuidanceLetterInsightCategoryRecommendation)

		createdRecommendation2, err := CreateTRBGuidanceLetterInsight(ctx, store, &recommendationToCreate2)
		s.NoError(err)
		s.EqualValues(createdRecommendation2.PositionInLetter.Int64, int64(1))
		s.EqualValues(createdRecommendation2.Category, models.TRBGuidanceLetterInsightCategoryRecommendation)

		// create insights of consideration category
		considerationToCreate1 := models.TRBGuidanceLetterInsight{
			TRBRequestID:   trbRequest.ID,
			Title:          "Restart your computer3",
			Recommendation: "I consider you restart your computer1",
			Links:          pq.StringArray{"google.com", "askjeeves.com"},
			Category:       models.TRBGuidanceLetterInsightCategoryConsideration,
		}

		considerationToCreate2 := models.TRBGuidanceLetterInsight{
			TRBRequestID:   trbRequest.ID,
			Title:          "Restart your computer4",
			Recommendation: "I consider you restart your computer2",
			Links:          pq.StringArray{"google.com", "askjeeves.com"},
			Category:       models.TRBGuidanceLetterInsightCategoryConsideration,
		}

		considerationToCreate3 := models.TRBGuidanceLetterInsight{
			TRBRequestID:   trbRequest.ID,
			Title:          "Restart your computer7",
			Recommendation: "I consider you restart your computer2",
			Links:          pq.StringArray{"google.com", "askjeeves.com"},
			Category:       models.TRBGuidanceLetterInsightCategoryConsideration,
		}

		createdConsideration1, err := CreateTRBGuidanceLetterInsight(ctx, store, &considerationToCreate1)
		s.NoError(err)
		s.EqualValues(createdConsideration1.PositionInLetter.Int64, int64(0))
		s.EqualValues(createdConsideration1.Category, models.TRBGuidanceLetterInsightCategoryConsideration)

		createdConsideration2, err := CreateTRBGuidanceLetterInsight(ctx, store, &considerationToCreate2)
		s.NoError(err)
		s.EqualValues(createdConsideration2.PositionInLetter.Int64, int64(1))
		s.EqualValues(createdConsideration2.Category, models.TRBGuidanceLetterInsightCategoryConsideration)

		createdConsideration3, err := CreateTRBGuidanceLetterInsight(ctx, store, &considerationToCreate3)
		s.NoError(err)
		s.EqualValues(createdConsideration3.PositionInLetter.Int64, int64(2))
		s.EqualValues(createdConsideration3.Category, models.TRBGuidanceLetterInsightCategoryConsideration)

		// create insights of requirement category
		requirementToCreate1 := models.TRBGuidanceLetterInsight{
			TRBRequestID:   trbRequest.ID,
			Title:          "Restart your computer5",
			Recommendation: "I require you restart your computer1",
			Links:          pq.StringArray{"google.com", "askjeeves.com"},
			Category:       models.TRBGuidanceLetterInsightCategoryRequirement,
		}

		requirementToCreate2 := models.TRBGuidanceLetterInsight{
			TRBRequestID:   trbRequest.ID,
			Title:          "Restart your computer6",
			Recommendation: "I require you restart your computer2",
			Links:          pq.StringArray{"google.com", "askjeeves.com"},
			Category:       models.TRBGuidanceLetterInsightCategoryRequirement,
		}

		createdRequirement1, err := CreateTRBGuidanceLetterInsight(ctx, store, &requirementToCreate1)
		s.NoError(err)
		s.EqualValues(createdRequirement1.PositionInLetter.Int64, int64(0))
		s.EqualValues(createdRequirement1.Category, models.TRBGuidanceLetterInsightCategoryRequirement)

		createdRequirement2, err := CreateTRBGuidanceLetterInsight(ctx, store, &requirementToCreate2)
		s.NoError(err)
		s.EqualValues(createdRequirement2.PositionInLetter.Int64, int64(1))
		s.EqualValues(createdRequirement2.Category, models.TRBGuidanceLetterInsightCategoryRequirement)

		// let's try moving consideration 2 to requirements
		// we should expect it to be number 3 in requirements after the move
		// we should expect consideration 3 to bump up to consideration 2 to fill in the gap
		updated, err := UpdateTRBGuidanceLetterInsight(ctx, store, map[string]interface{}{
			"id":       createdConsideration2.ID,
			"category": models.TRBGuidanceLetterInsightCategoryRequirement.String(),
		})
		s.NoError(err)
		s.NotNil(updated)
		// it should now be the third requirement (index pos 2)
		s.EqualValues(updated.ID, createdConsideration2.ID)
		s.EqualValues(updated.Category, models.TRBGuidanceLetterInsightCategoryRequirement)
		s.EqualValues(updated.PositionInLetter.Int64, int64(2))

		// check considerations to confirm consideration 3 moved up to position 2
		considerations, err := store.GetTRBGuidanceLetterInsightsByTRBRequestIDAndCategory(ctx, trbRequest.ID, models.TRBGuidanceLetterInsightCategoryConsideration)
		s.NoError(err)
		s.Len(considerations, 2)
		s.EqualValues(considerations[0].PositionInLetter.Int64, int64(0))
		s.EqualValues(considerations[1].PositionInLetter.Int64, int64(1))
	})

	s.Run("does not allow setting a category to `uncategorized`", func() {
		trbRequest := models.NewTRBRequest(anonEua)
		trbRequest.Type = models.TRBTNeedHelp
		trbRequest.State = models.TRBRequestStateOpen
		trbRequest, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, store)
		s.NoError(err)

		// create insights of recommendation category
		recommendationToCreate1 := models.TRBGuidanceLetterInsight{
			TRBRequestID:   trbRequest.ID,
			Title:          "Restart your computer1",
			Recommendation: "I recommend you restart your computer1",
			Links:          pq.StringArray{"google.com", "askjeeves.com"},
			Category:       models.TRBGuidanceLetterInsightCategoryRecommendation,
		}

		createdRecommendation1, err := CreateTRBGuidanceLetterInsight(ctx, store, &recommendationToCreate1)
		s.NoError(err)
		s.EqualValues(createdRecommendation1.PositionInLetter.Int64, int64(0))
		s.EqualValues(createdRecommendation1.Category, models.TRBGuidanceLetterInsightCategoryRecommendation)

		// try to update the category to `uncategorized`
		_, err = UpdateTRBGuidanceLetterInsight(ctx, store, map[string]interface{}{
			"id":       createdRecommendation1.ID,
			"category": models.TRBGuidanceLetterInsightCategoryUncategorized.String(),
		})
		s.Error(err)
	})
}
