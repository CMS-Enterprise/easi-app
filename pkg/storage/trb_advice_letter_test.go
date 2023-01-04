package storage

import (
	"context"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

func createTRBRequest(s *StoreTestSuite, logger *zap.Logger, createdBy string) uuid.UUID {
	trbRequest := models.NewTRBRequest(createdBy)
	trbRequest.Type = models.TRBTNeedHelp
	trbRequest.Status = models.TRBSOpen
	createdRequest, err := s.store.CreateTRBRequest(logger, trbRequest)
	s.NoError(err)

	return createdRequest.ID
}

func (s *StoreTestSuite) TestTRBAdviceLetterStoreMethods() {
	ctx := context.Background()
	logger := appcontext.ZLogger(ctx)

	anonEua := "ANON"

	s.Run("Creating an advice letter returns a blank advice letter in the In Progress status", func() {
		trbRequestID := createTRBRequest(s, logger, anonEua)

		createdLetter, err := s.store.CreateTRBAdviceLetter(logger, anonEua, trbRequestID)
		s.NoError(err)
		s.EqualValues(trbRequestID, createdLetter.TRBRequestID)
		s.EqualValues(anonEua, createdLetter.CreatedBy)
		s.EqualValues(models.TRBAdviceLetterStatusInProgress, createdLetter.Status)
		s.Nil(createdLetter.MeetingSummary)
		s.Nil(createdLetter.NextSteps)
		s.Nil(createdLetter.IsFollowupRecommended)
		s.Nil(createdLetter.DateSent)
		s.Nil(createdLetter.FollowupPoint)
	})

	s.Run("Creating, then fetching an advice letter returns a blank advice letter in the In Progress status", func() {
		trbRequestID := createTRBRequest(s, logger, anonEua)

		_, err := s.store.CreateTRBAdviceLetter(logger, anonEua, trbRequestID)
		s.NoError(err)

		fetchedLetter, err := s.store.GetTRBAdviceLetterByTRBRequestID(logger, trbRequestID)
		s.NoError(err)

		s.EqualValues(trbRequestID, fetchedLetter.TRBRequestID)
		s.EqualValues(anonEua, fetchedLetter.CreatedBy)
		s.EqualValues(models.TRBAdviceLetterStatusInProgress, fetchedLetter.Status)

		s.Nil(fetchedLetter.MeetingSummary)
		s.Nil(fetchedLetter.NextSteps)
		s.Nil(fetchedLetter.IsFollowupRecommended)
		s.Nil(fetchedLetter.DateSent)
		s.Nil(fetchedLetter.FollowupPoint)
	})

	s.Run("Updating an advice letter returns an advice letter with updated data", func() {
		trbRequestID := createTRBRequest(s, logger, anonEua)

		createdLetter, err := s.store.CreateTRBAdviceLetter(logger, anonEua, trbRequestID)
		s.NoError(err)

		updatedMeetingSummary := "Meeting went well, no notes"
		updatedNextSteps := "Move forward with development"
		updatedIsFollowupRecommended := true
		updatedFollowupPoint := "In 3 months, check that everything's going well"
		updatedLetter := models.TRBAdviceLetter{
			TRBRequestID:          createdLetter.TRBRequestID,
			Status:                createdLetter.Status,
			MeetingSummary:        &updatedMeetingSummary,
			NextSteps:             &updatedNextSteps,
			IsFollowupRecommended: &updatedIsFollowupRecommended,
			FollowupPoint:         &updatedFollowupPoint,
		}
		updatedLetter.ID = createdLetter.ID

		returnedLetter, err := s.store.UpdateTRBAdviceLetter(logger, &updatedLetter)
		s.NoError(err)

		// fields that should have remained constant
		s.EqualValues(createdLetter.ID, returnedLetter.ID)
		s.EqualValues(createdLetter.TRBRequestID, returnedLetter.TRBRequestID)
		s.EqualValues(anonEua, returnedLetter.CreatedBy)
		s.EqualValues(models.TRBAdviceLetterStatusInProgress, returnedLetter.Status)
		s.Nil(returnedLetter.DateSent)

		// updated fields
		s.EqualValues(updatedMeetingSummary, *returnedLetter.MeetingSummary)
		s.EqualValues(updatedNextSteps, *returnedLetter.NextSteps)
		s.EqualValues(updatedIsFollowupRecommended, *returnedLetter.IsFollowupRecommended)
		s.EqualValues(updatedFollowupPoint, *returnedLetter.FollowupPoint)
	})

	s.Run("Updating an advice letter to be ready for review changes the status while leaving DateSent nil", func() {
		trbRequestID := createTRBRequest(s, logger, anonEua)

		createdLetter, err := s.store.CreateTRBAdviceLetter(logger, anonEua, trbRequestID)
		s.NoError(err)

		updatedLetter, err := s.store.UpdateTRBAdviceLetterStatus(logger, createdLetter.ID, models.TRBAdviceLetterStatusReadyForReview)
		s.NoError(err)

		s.EqualValues(models.TRBAdviceLetterStatusReadyForReview, updatedLetter.Status)
		s.Nil(updatedLetter.DateSent)
	})

	s.Run("Updating an advice letter to complete it changes the status and sets DateSent", func() {
		trbRequestID := createTRBRequest(s, logger, anonEua)

		createdLetter, err := s.store.CreateTRBAdviceLetter(logger, anonEua, trbRequestID)
		s.NoError(err)

		updatedLetter, err := s.store.UpdateTRBAdviceLetterStatus(logger, createdLetter.ID, models.TRBAdviceLetterStatusCompleted)
		s.NoError(err)

		s.EqualValues(models.TRBAdviceLetterStatusCompleted, updatedLetter.Status)

		// don't bother stubbing time.Now(), just make sure that DateSent was set to *something* instead of nil
		s.NotNil(updatedLetter.DateSent)
	})
}
