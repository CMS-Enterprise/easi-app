package storage

import (
	"context"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *StoreTestSuite) TestTRBAdviceLetterStoreMethods() {
	ctx := context.Background()

	anonEua := "ANON"

	s.Run("Creating an advice letter returns a blank advice letter in the In Progress status", func() {
		trbRequestID := createTRBRequest(ctx, s, anonEua)

		createdLetter, err := s.store.CreateTRBGuidanceLetter(ctx, anonEua, trbRequestID)
		s.NoError(err)
		s.EqualValues(trbRequestID, createdLetter.TRBRequestID)
		s.EqualValues(anonEua, createdLetter.CreatedBy)
		s.EqualValues(models.TRBGuidanceLetterStatusInProgress, createdLetter.Status)
		s.Nil(createdLetter.MeetingSummary)
		s.Nil(createdLetter.NextSteps)
		s.Nil(createdLetter.IsFollowupRecommended)
		s.Nil(createdLetter.DateSent)
		s.Nil(createdLetter.FollowupPoint)
	})

	s.Run("Creating, then fetching an advice letter returns a blank advice letter in the In Progress status", func() {
		trbRequestID := createTRBRequest(ctx, s, anonEua)

		_, err := s.store.CreateTRBGuidanceLetter(ctx, anonEua, trbRequestID)
		s.NoError(err)

		fetchedLetter, err := s.store.GetTRBGuidanceLetterByTRBRequestID(ctx, trbRequestID)
		s.NoError(err)

		s.EqualValues(trbRequestID, fetchedLetter.TRBRequestID)
		s.EqualValues(anonEua, fetchedLetter.CreatedBy)
		s.EqualValues(models.TRBGuidanceLetterStatusInProgress, fetchedLetter.Status)

		s.Nil(fetchedLetter.MeetingSummary)
		s.Nil(fetchedLetter.NextSteps)
		s.Nil(fetchedLetter.IsFollowupRecommended)
		s.Nil(fetchedLetter.DateSent)
		s.Nil(fetchedLetter.FollowupPoint)
	})

	s.Run("Updating an advice letter returns an advice letter with updated data", func() {
		trbRequestID := createTRBRequest(ctx, s, anonEua)

		createdLetter, err := s.store.CreateTRBGuidanceLetter(ctx, anonEua, trbRequestID)
		s.NoError(err)

		updatedMeetingSummary := models.HTML("Meeting went well, no notes")
		updatedNextSteps := models.HTML("Move forward with development")
		updatedIsFollowupRecommended := true
		updatedFollowupPoint := "In 3 months, check that everything's going well"
		updatedLetter := models.TRBGuidanceLetter{
			TRBRequestID:          createdLetter.TRBRequestID,
			Status:                createdLetter.Status,
			MeetingSummary:        &updatedMeetingSummary,
			NextSteps:             &updatedNextSteps,
			IsFollowupRecommended: &updatedIsFollowupRecommended,
			FollowupPoint:         &updatedFollowupPoint,
		}
		updatedLetter.ID = createdLetter.ID

		returnedLetter, err := s.store.UpdateTRBGuidanceLetter(ctx, &updatedLetter)
		s.NoError(err)

		// fields that should have remained constant
		s.EqualValues(createdLetter.ID, returnedLetter.ID)
		s.EqualValues(createdLetter.TRBRequestID, returnedLetter.TRBRequestID)
		s.EqualValues(anonEua, returnedLetter.CreatedBy)
		s.EqualValues(models.TRBGuidanceLetterStatusInProgress, returnedLetter.Status)
		s.Nil(returnedLetter.DateSent)

		// updated fields
		s.EqualValues(updatedMeetingSummary, *returnedLetter.MeetingSummary)
		s.EqualValues(updatedNextSteps, *returnedLetter.NextSteps)
		s.EqualValues(updatedIsFollowupRecommended, *returnedLetter.IsFollowupRecommended)
		s.EqualValues(updatedFollowupPoint, *returnedLetter.FollowupPoint)
	})

	s.Run("Updating an advice letter to be ready for review changes the status while leaving DateSent nil", func() {
		trbRequestID := createTRBRequest(ctx, s, anonEua)

		createdLetter, err := s.store.CreateTRBGuidanceLetter(ctx, anonEua, trbRequestID)
		s.NoError(err)

		updatedLetter, err := s.store.UpdateTRBGuidanceLetterStatus(ctx, createdLetter.ID, models.TRBGuidanceLetterStatusReadyForReview)
		s.NoError(err)

		s.EqualValues(models.TRBGuidanceLetterStatusReadyForReview, updatedLetter.Status)
		s.Nil(updatedLetter.DateSent)
	})

	s.Run("Updating an advice letter to complete it changes the status and sets DateSent", func() {
		trbRequestID := createTRBRequest(ctx, s, anonEua)

		createdLetter, err := s.store.CreateTRBGuidanceLetter(ctx, anonEua, trbRequestID)
		s.NoError(err)

		updatedLetter, err := s.store.UpdateTRBGuidanceLetterStatus(ctx, createdLetter.ID, models.TRBGuidanceLetterStatusCompleted)
		s.NoError(err)

		s.EqualValues(models.TRBGuidanceLetterStatusCompleted, updatedLetter.Status)

		// don't bother stubbing time.Now(), just make sure that DateSent was set to *something* instead of nil
		s.NotNil(updatedLetter.DateSent)
	})
}
