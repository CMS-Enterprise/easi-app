package resolvers

import (
	"context"
	"fmt"
	"strconv"

	"github.com/lib/pq"

	"github.com/cmsgov/easi-app/pkg/appconfig"
	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/email"
	"github.com/cmsgov/easi-app/pkg/local"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

// TestCreateTRBRequestFeedback makes a new TRB request feedback
func (suite *ResolverSuite) TestCreateTRBRequestFeedback() {
	ctx := context.Background()

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
		suite.FailNow("Unable to construct email client with local sender")
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

	store := suite.testConfigs.Store
	trbRequest := models.NewTRBRequest(anonEua)
	trbRequest.Type = models.TRBTNeedHelp
	trbRequest.State = models.TRBRequestStateOpen
	trbRequest, err = CreateTRBRequest(suite.testConfigs.Context, models.TRBTBrainstorm, store)
	suite.NoError(err)

	form, err := GetTRBRequestFormByTRBRequestID(ctx, store, trbRequest.ID)
	suite.NoError(err)

	suite.Run("create/update/fetch TRB request feedback", func() {
		// Update the TRB form status to in 'completed' since we're testing the feedback step
		formChanges := map[string]interface{}{
			"status": models.TRBFormStatusCompleted,
		}
		err = ApplyChangesAndMetaData(formChanges, form, appcontext.Principal(ctx))
		suite.NoError(err)
		form, err = store.UpdateTRBRequestForm(ctx, form)
		suite.NoError(err)
		suite.EqualValues(models.TRBFormStatusCompleted, form.Status)

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
			suite.testConfigs.Store,
			&emailClient,
			stubFetchUserInfo,
			stubFetchUserInfos,
			toCreate,
		)
		suite.NoError(err)
		suite.NotNil(created)
		suite.EqualValues(toCreate.FeedbackMessage, created.FeedbackMessage)
		suite.EqualValues(toCreate.CopyTRBMailbox, created.CopyTRBMailbox)
		suite.EqualValues(toCreate.Action, created.Action)
		suite.EqualValues(toCreate.NotifyEUAIDs[0], created.NotifyEUAIDs[0])
		suite.EqualValues(toCreate.NotifyEUAIDs[1], created.NotifyEUAIDs[1])
		suite.EqualValues(toCreate.NotifyEUAIDs[2], created.NotifyEUAIDs[2])
		// Verify that the TRB request feedback status is now "edits requested"
		updatedFeedbackStatus, err := getTRBFeedbackStatus(ctx, store, trbRequest.ID)
		suite.NoError(err)
		suite.EqualValues(models.TRBFeedbackStatusEditsRequested, *updatedFeedbackStatus)
		form, err := GetTRBRequestFormByTRBRequestID(ctx, store, trbRequest.ID)
		suite.NoError(err)
		suite.EqualValues(form.Status, models.TRBFormStatusInProgress)
		suite.EqualValues(models.TRBFormStatusInProgress, form.Status)

		// Update the TRB form status to in 'completed' since we're testing the feedback step again
		formChanges = map[string]interface{}{
			"status": models.TRBFormStatusCompleted,
		}
		err = ApplyChangesAndMetaData(formChanges, form, appcontext.Principal(ctx))
		suite.NoError(err)
		_, err = store.UpdateTRBRequestForm(ctx, form)
		suite.NoError(err)

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
			suite.testConfigs.Store,
			&emailClient,
			stubFetchUserInfo,
			stubFetchUserInfos,
			toCreate2,
		)
		suite.NoError(err)
		suite.NotNil(created2)
		suite.EqualValues(toCreate2.FeedbackMessage, created2.FeedbackMessage)
		suite.EqualValues(toCreate2.CopyTRBMailbox, created2.CopyTRBMailbox)
		suite.EqualValues(toCreate2.Action, created2.Action)
		suite.EqualValues(toCreate2.NotifyEUAIDs[0], created2.NotifyEUAIDs[0])
		suite.EqualValues(toCreate2.NotifyEUAIDs[1], created2.NotifyEUAIDs[1])
		suite.EqualValues(toCreate2.NotifyEUAIDs[2], created2.NotifyEUAIDs[2])

		// Verify that the TRB request feedback status is now "completed"
		finalFeedbackStatus, err := getTRBFeedbackStatus(ctx, store, trbRequest.ID)
		suite.NoError(err)
		suite.EqualValues(models.TRBFeedbackStatusCompleted, *finalFeedbackStatus)
	})
}
