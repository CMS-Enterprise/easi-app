package resolvers

import (
	"context"
	"fmt"
	"strconv"

	"github.com/lib/pq"

	"github.com/cms-enterprise/easi-app/pkg/appconfig"
	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/local"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/testhelpers"
)

// TestCreateTRBRequestFeedback makes a new TRB request feedback
func (s *ResolverSuite) TestCreateTRBRequestFeedback() {
	ctx := s.testConfigs.Context

	config := testhelpers.NewConfig()

	// set up Email Client
	emailConfig := email.Config{
		GRTEmail:          models.NewEmailAddress(config.GetString(appconfig.GRTEmailKey)),
		ITInvestmentEmail: models.NewEmailAddress(config.GetString(appconfig.ITInvestmentEmailKey)),
		TRBEmail:          models.NewEmailAddress(config.GetString(appconfig.TRBEmailKey)),
		EASIHelpEmail:     models.NewEmailAddress(config.GetString(appconfig.EASIHelpEmailKey)),
		URLHost:           config.GetString(appconfig.ClientHostKey),
		URLScheme:         config.GetString(appconfig.ClientProtocolKey),
		TemplateDirectory: config.GetString(appconfig.EmailTemplateDirectoryKey),
	}
	localSender := local.NewSender()
	emailClient, err := email.NewClient(emailConfig, localSender)
	if err != nil {
		s.FailNow("Unable to construct email client with local sender")
	}

	anonEua := "ANON"

	stubFetchUserInfo := func(context.Context, string) (*models.UserInfo, error) {
		return &models.UserInfo{
			Username:    anonEua,
			DisplayName: "Anonymous",
			Email:       models.NewEmailAddress("anon@local.fake"),
		}, nil
	}

	stubFetchUserInfos := func(ctx context.Context, euaIDs []string) ([]*models.UserInfo, error) {
		userInfos := []*models.UserInfo{}

		for i, euaID := range euaIDs {
			userInfo := &models.UserInfo{
				Username:    euaID,
				DisplayName: strconv.Itoa(i),
				Email:       models.NewEmailAddress(fmt.Sprintf("%v@local.fake", i)),
			}
			userInfos = append(userInfos, userInfo)
		}

		return userInfos, nil
	}

	store := s.testConfigs.Store
	trbRequest := models.NewTRBRequest(anonEua)
	trbRequest.Type = models.TRBTNeedHelp
	trbRequest.State = models.TRBRequestStateOpen
	trbRequest, err = CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, store)
	s.NoError(err)

	initFeedbackStatus, err := getTRBFeedbackStatus(s.ctxWithNewDataloaders(), trbRequest.ID)
	s.NoError(err)
	s.EqualValues(models.TRBFeedbackStatusCannotStartYet, *initFeedbackStatus)

	feedback, err := store.GetTRBRequestFeedbackByTRBRequestID(ctx, trbRequest.ID)
	s.NoError(err)
	s.Empty(feedback)

	latestFeedback, err := store.GetNewestTRBRequestFeedbackByTRBRequestID(ctx, trbRequest.ID)
	s.NoError(err)
	s.Nil(latestFeedback)

	form, err := GetTRBRequestFormByTRBRequestID(s.ctxWithNewDataloaders(), trbRequest.ID)
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

		reviewFeedbackStatus, err := getTRBFeedbackStatus(s.ctxWithNewDataloaders(), trbRequest.ID)
		s.NoError(err)
		s.EqualValues(models.TRBFeedbackStatusInReview, *reviewFeedbackStatus)

		notifyEUAIDs := pq.StringArray{"WUTT", "NOPE", "YEET"}
		toCreate := &models.TRBRequestFeedback{
			TRBRequestID:    trbRequest.ID,
			FeedbackMessage: "I dislike the TRB request",
			CopyTRBMailbox:  true,
			NotifyEUAIDs:    notifyEUAIDs,
			Action:          models.TRBFeedbackAction(models.TRBFeedbackActionRequestEdits),
		}
		created, err := CreateTRBRequestFeedback(
			ctx,
			s.testConfigs.Store,
			&emailClient,
			stubFetchUserInfo,
			stubFetchUserInfos,
			toCreate,
		)
		s.NoError(err)
		s.NotNil(created)
		s.EqualValues(toCreate.FeedbackMessage, created.FeedbackMessage)
		s.EqualValues(toCreate.CopyTRBMailbox, created.CopyTRBMailbox)
		s.EqualValues(toCreate.Action, created.Action)
		s.EqualValues(toCreate.NotifyEUAIDs[0], created.NotifyEUAIDs[0])
		s.EqualValues(toCreate.NotifyEUAIDs[1], created.NotifyEUAIDs[1])
		s.EqualValues(toCreate.NotifyEUAIDs[2], created.NotifyEUAIDs[2])
		// Verify that the TRB request feedback status is now "edits requested"
		updatedFeedbackStatus, err := getTRBFeedbackStatus(s.ctxWithNewDataloaders(), trbRequest.ID)
		s.NoError(err)
		s.EqualValues(models.TRBFeedbackStatusEditsRequested, *updatedFeedbackStatus)
		form, err := GetTRBRequestFormByTRBRequestID(s.ctxWithNewDataloaders(), trbRequest.ID)
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
		created2, err := CreateTRBRequestFeedback(
			ctx,
			s.testConfigs.Store,
			&emailClient,
			stubFetchUserInfo,
			stubFetchUserInfos,
			toCreate2,
		)
		s.NoError(err)
		s.NotNil(created2)
		s.EqualValues(toCreate2.FeedbackMessage, created2.FeedbackMessage)
		s.EqualValues(toCreate2.CopyTRBMailbox, created2.CopyTRBMailbox)
		s.EqualValues(toCreate2.Action, created2.Action)
		s.EqualValues(toCreate2.NotifyEUAIDs[0], created2.NotifyEUAIDs[0])
		s.EqualValues(toCreate2.NotifyEUAIDs[1], created2.NotifyEUAIDs[1])
		s.EqualValues(toCreate2.NotifyEUAIDs[2], created2.NotifyEUAIDs[2])

		// Verify that the TRB request feedback status is now "completed"
		finalFeedbackStatus, err := getTRBFeedbackStatus(s.ctxWithNewDataloaders(), trbRequest.ID)
		s.NoError(err)
		s.EqualValues(models.TRBFeedbackStatusCompleted, *finalFeedbackStatus)
	})
}
