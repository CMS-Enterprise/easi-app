package resolvers

import (
	"context"

	"github.com/lib/pq"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

// TestCreateTRBRequestFeedback makes a new TRB request feedback
func (s *ResolverSuite) TestCreateTRBRequestFeedback() {
	ctx := context.Background()
	store := s.testConfigs.Store
	anonEua := "ANON"
	trbRequest := models.NewTRBRequest(anonEua)
	trbRequest.Type = models.TRBTNeedHelp
	trbRequest.Status = models.TRBSOpen
	trbRequest, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, store)
	s.NoError(err)

	form, err := GetTRBRequestFormByTRBRequestID(ctx, store, trbRequest.ID)
	s.NoError(err)

	s.Run("create/update/fetch TRB request feedback", func() {
		// Update the TRB form status to in 'completed' since we're testing the feedback step
		formChanges := map[string]interface{}{
			"status": models.TRBFormStatusCompleted,
		}
		err = ApplyChangesAndMetaData(formChanges, form, appcontext.Principal(ctx))
		s.NoError(err)
		form, err = store.UpdateTRBRequestForm(ctx, form)
		s.NoError(err)
		s.EqualValues(models.TRBFormStatusCompleted, form.Status)

		notifyEUAIDs := pq.StringArray{"WUTT", "NOPE", "YEET"}
		toCreate := &models.TRBRequestFeedback{
			TRBRequestID:    trbRequest.ID,
			FeedbackMessage: "I dislike the TRB request",
			CopyTRBMailbox:  true,
			NotifyEUAIDs:    notifyEUAIDs,
			Action:          models.TRBFeedbackAction(models.TRBFeedbackActionRequestEdits),
		}
		created, err := CreateTRBRequestFeedback(ctx, s.testConfigs.Store, toCreate)
		s.NoError(err)
		s.NotNil(created)
		s.EqualValues(toCreate.FeedbackMessage, created.FeedbackMessage)
		s.EqualValues(toCreate.CopyTRBMailbox, created.CopyTRBMailbox)
		s.EqualValues(toCreate.Action, created.Action)
		s.EqualValues(toCreate.NotifyEUAIDs[0], created.NotifyEUAIDs[0])
		s.EqualValues(toCreate.NotifyEUAIDs[1], created.NotifyEUAIDs[1])
		s.EqualValues(toCreate.NotifyEUAIDs[2], created.NotifyEUAIDs[2])
		// Verify that the TRB request feedback status is now "edits requested"
		updatedFeedbackStatus, err := GetTRBFeedbackStatus(ctx, store, trbRequest.ID)
		s.NoError(err)
		s.EqualValues(models.TRBTaskStatusEditsRequested, *updatedFeedbackStatus)
		form, err := GetTRBRequestFormByTRBRequestID(ctx, store, trbRequest.ID)
		s.NoError(err)
		s.EqualValues(form.Status, models.TRBFormStatusInProgress)
		s.EqualValues(models.TRBFormStatusInProgress, form.Status)

		// Update the TRB form status to in 'completed' since we're testing the feedback step again
		formChanges = map[string]interface{}{
			"status": models.TRBFormStatusCompleted,
		}
		err = ApplyChangesAndMetaData(formChanges, form, appcontext.Principal(ctx))
		s.NoError(err)
		_, err = store.UpdateTRBRequestForm(ctx, form)
		s.NoError(err)

		// Make another feedback, this time without edits requested
		toCreate2 := &models.TRBRequestFeedback{
			TRBRequestID:    trbRequest.ID,
			FeedbackMessage: "I like the TRB request",
			CopyTRBMailbox:  true,
			NotifyEUAIDs:    notifyEUAIDs,
			Action:          models.TRBFeedbackAction(models.TRBFeedbackActionReadyForConsult),
		}
		created2, err := CreateTRBRequestFeedback(ctx, s.testConfigs.Store, toCreate2)
		s.NoError(err)
		s.NotNil(created2)
		s.EqualValues(toCreate2.FeedbackMessage, created2.FeedbackMessage)
		s.EqualValues(toCreate2.CopyTRBMailbox, created2.CopyTRBMailbox)
		s.EqualValues(toCreate2.Action, created2.Action)
		s.EqualValues(toCreate2.NotifyEUAIDs[0], created2.NotifyEUAIDs[0])
		s.EqualValues(toCreate2.NotifyEUAIDs[1], created2.NotifyEUAIDs[1])
		s.EqualValues(toCreate2.NotifyEUAIDs[2], created2.NotifyEUAIDs[2])

		// Verify that the TRB request feedback status is now "completed"
		finalFeedbackStatus, err := GetTRBFeedbackStatus(ctx, store, trbRequest.ID)
		s.NoError(err)
		s.EqualValues(models.TRBTaskStatusCompleted, *finalFeedbackStatus)
	})
}
