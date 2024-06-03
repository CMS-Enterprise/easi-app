package resolvers

import (
	"context"
	"fmt"
	"strconv"
	"time"

	"github.com/lib/pq"

	"github.com/cmsgov/easi-app/pkg/appconfig"
	"github.com/cmsgov/easi-app/pkg/email"
	"github.com/cmsgov/easi-app/pkg/local"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

// TestTRBRequestStatus tests the overall status of a TRB request
func (suite *ResolverSuite) TestTRBRequestStatus() {
	ctx := suite.testConfigs.Context
	store := suite.testConfigs.Store

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

	trb := models.NewTRBRequest(anonEua)
	trb.Type = models.TRBTNeedHelp
	trb.State = models.TRBRequestStateOpen
	trb, err = CreateTRBRequest(suite.testConfigs.Context, models.TRBTBrainstorm, suite.testConfigs.Store)
	suite.NoError(err)

	suite.Run("status is correctly calculated as TRB tasks are performed", func() {
		// Test the "NEW" TRB status
		trb, err = GetTRBRequestByID(suite.testConfigs.Context, trb.ID, suite.testConfigs.Store)
		suite.NoError(err)
		trbStatus, err := GetTRBRequestStatus(ctx, store, *trb)
		suite.NoError(err)
		suite.EqualValues(models.TRBRequestStatusNew, trbStatus)
		taskStatuses, err := GetTRBTaskStatuses(ctx, store, *trb)
		suite.NoError(err)
		suite.EqualValues(models.TRBTaskStatuses{
			FormStatus:                 models.TRBFormStatusReadyToStart,
			FeedbackStatus:             models.TRBFeedbackStatusCannotStartYet,
			ConsultPrepStatus:          models.TRBConsultPrepStatusCannotStartYet,
			AttendConsultStatus:        models.TRBAttendConsultStatusCannotStartYet,
			AdviceLetterStatus:         models.TRBAdviceLetterStatusCannotStartYet,
			AdviceLetterStatusTaskList: models.TRBAdviceLetterStatusTaskListCannotStartYet,
		}, *taskStatuses)

		// Test the "DRAFT_REQUEST_FORM" status by making a random update to the form but not
		// submitting it
		form, err := GetTRBRequestFormByTRBRequestID(ctx, suite.testConfigs.Store, trb.ID)
		suite.NoError(err)
		suite.NotNil(form)
		formChanges := map[string]interface{}{
			"isSubmitted":  false,
			"trbRequestId": trb.ID,
			"component":    "Taco Cart",
		}
		_, err = UpdateTRBRequestForm(ctx, store, &emailClient, stubFetchUserInfo, formChanges)
		suite.NoError(err)
		// Fetch the updated request
		trb, err = GetTRBRequestByID(suite.testConfigs.Context, trb.ID, suite.testConfigs.Store)
		suite.NoError(err)
		trbStatus, err = GetTRBRequestStatus(ctx, store, *trb)
		suite.NoError(err)
		suite.EqualValues(models.TRBRequestStatusDraftRequestForm, trbStatus)
		taskStatuses, err = GetTRBTaskStatuses(ctx, store, *trb)
		suite.NoError(err)
		suite.EqualValues(models.TRBTaskStatuses{
			FormStatus:                 models.TRBFormStatusInProgress,
			FeedbackStatus:             models.TRBFeedbackStatusCannotStartYet,
			ConsultPrepStatus:          models.TRBConsultPrepStatusCannotStartYet,
			AttendConsultStatus:        models.TRBAttendConsultStatusCannotStartYet,
			AdviceLetterStatus:         models.TRBAdviceLetterStatusCannotStartYet,
			AdviceLetterStatusTaskList: models.TRBAdviceLetterStatusTaskListCannotStartYet,
		}, *taskStatuses)

		// Test the "REQUEST_FORM_COMPLETE" status by submitting it
		form, err = GetTRBRequestFormByTRBRequestID(ctx, suite.testConfigs.Store, trb.ID)
		suite.NoError(err)
		suite.NotNil(form)
		formChanges = map[string]interface{}{
			"isSubmitted":  true,
			"trbRequestId": trb.ID,
			"component":    "Taco Cart",
		}
		_, err = UpdateTRBRequestForm(ctx, store, &emailClient, stubFetchUserInfo, formChanges)
		suite.NoError(err)
		// Fetch the updated request
		trb, err = GetTRBRequestByID(suite.testConfigs.Context, trb.ID, suite.testConfigs.Store)
		suite.NoError(err)
		trbStatus, err = GetTRBRequestStatus(ctx, store, *trb)
		suite.NoError(err)
		suite.EqualValues(models.TRBRequestStatusRequestFormComplete, trbStatus)
		taskStatuses, err = GetTRBTaskStatuses(ctx, store, *trb)
		suite.NoError(err)
		suite.EqualValues(models.TRBTaskStatuses{
			FormStatus:                 models.TRBFormStatusCompleted,
			FeedbackStatus:             models.TRBFeedbackStatusInReview,
			ConsultPrepStatus:          models.TRBConsultPrepStatusCannotStartYet,
			AttendConsultStatus:        models.TRBAttendConsultStatusCannotStartYet,
			AdviceLetterStatus:         models.TRBAdviceLetterStatusCannotStartYet,
			AdviceLetterStatusTaskList: models.TRBAdviceLetterStatusTaskListCannotStartYet,
		}, *taskStatuses)

		// Test the "READY_FOR_CONSULT" status by creating an approving feedback
		notifyEUAIDs := pq.StringArray{"WUTT", "NOPE", "YEET"}
		feedback := &models.TRBRequestFeedback{
			TRBRequestID:    trb.ID,
			FeedbackMessage: "I like the TRB request",
			CopyTRBMailbox:  true,
			NotifyEUAIDs:    notifyEUAIDs,
			Action:          models.TRBFeedbackAction(models.TRBFeedbackActionReadyForConsult),
		}
		_, err = CreateTRBRequestFeedback(
			ctx,
			suite.testConfigs.Store,
			&emailClient,
			stubFetchUserInfo,
			stubFetchUserInfos,
			feedback,
		)
		suite.NoError(err)
		// Fetch the updated request
		trb, err = GetTRBRequestByID(suite.testConfigs.Context, trb.ID, suite.testConfigs.Store)
		suite.NoError(err)
		trbStatus, err = GetTRBRequestStatus(ctx, store, *trb)
		suite.NoError(err)
		suite.EqualValues(models.TRBRequestStatusReadyForConsult, trbStatus)
		taskStatuses, err = GetTRBTaskStatuses(ctx, store, *trb)
		suite.NoError(err)
		suite.EqualValues(models.TRBTaskStatuses{
			FormStatus:                 models.TRBFormStatusCompleted,
			FeedbackStatus:             models.TRBFeedbackStatusCompleted,
			ConsultPrepStatus:          models.TRBConsultPrepStatusReadyToStart,
			AttendConsultStatus:        models.TRBAttendConsultStatusReadyToSchedule,
			AdviceLetterStatus:         models.TRBAdviceLetterStatusCannotStartYet,
			AdviceLetterStatusTaskList: models.TRBAdviceLetterStatusTaskListCannotStartYet,
		}, *taskStatuses)

		// Test the "CONSULT_SCHEDULED" status by scheduling a consult session in the future
		meetingTime := time.Now().Local().Add(time.Hour * 24)
		suite.NoError(err)
		_, err = UpdateTRBRequestConsultMeetingTime(
			suite.testConfigs.Context,
			suite.testConfigs.Store,
			nil,
			stubFetchUserInfo,
			stubFetchUserInfos,
			trb.ID,
			meetingTime,
			true,
			[]string{"mclovin@example.com"},
			"See you then!",
		)
		suite.NoError(err)
		// Fetch the updated request
		trb, err = GetTRBRequestByID(suite.testConfigs.Context, trb.ID, suite.testConfigs.Store)
		suite.NoError(err)
		trbStatus, err = GetTRBRequestStatus(ctx, store, *trb)
		suite.NoError(err)
		suite.EqualValues(models.TRBRequestStatusConsultScheduled, trbStatus)
		taskStatuses, err = GetTRBTaskStatuses(ctx, store, *trb)
		suite.NoError(err)
		suite.EqualValues(models.TRBTaskStatuses{
			FormStatus:                 models.TRBFormStatusCompleted,
			FeedbackStatus:             models.TRBFeedbackStatusCompleted,
			ConsultPrepStatus:          models.TRBConsultPrepStatusReadyToStart,
			AttendConsultStatus:        models.TRBAttendConsultStatusScheduled,
			AdviceLetterStatus:         models.TRBAdviceLetterStatusCannotStartYet,
			AdviceLetterStatusTaskList: models.TRBAdviceLetterStatusTaskListCannotStartYet,
		}, *taskStatuses)

		// Test the "CONSULT_COMPLETE" status by updating the meeting time to be a time in the past
		meetingTime = time.Now().Local().Add(time.Hour * -24)
		suite.NoError(err)
		_, err = UpdateTRBRequestConsultMeetingTime(
			suite.testConfigs.Context,
			suite.testConfigs.Store,
			nil,
			stubFetchUserInfo,
			stubFetchUserInfos,
			trb.ID,
			meetingTime,
			true,
			[]string{"mclovin@example.com"},
			"See you then!",
		)
		suite.NoError(err)
		// Fetch the updated request
		trb, err = GetTRBRequestByID(suite.testConfigs.Context, trb.ID, suite.testConfigs.Store)
		suite.NoError(err)
		trbStatus, err = GetTRBRequestStatus(ctx, store, *trb)
		suite.NoError(err)
		suite.EqualValues(models.TRBRequestStatusConsultComplete, trbStatus)
		taskStatuses, err = GetTRBTaskStatuses(ctx, store, *trb)
		suite.NoError(err)
		suite.EqualValues(models.TRBTaskStatuses{
			FormStatus:                 models.TRBFormStatusCompleted,
			FeedbackStatus:             models.TRBFeedbackStatusCompleted,
			ConsultPrepStatus:          models.TRBConsultPrepStatusCompleted,
			AttendConsultStatus:        models.TRBAttendConsultStatusCompleted,
			AdviceLetterStatus:         models.TRBAdviceLetterStatusReadyToStart,
			AdviceLetterStatusTaskList: models.TRBAdviceLetterStatusTaskListInReview,
		}, *taskStatuses)

		// Test the "DRAFT_ADVICE_LETTER" status by making a change to the advice letter
		adviceLetter, err := CreateTRBAdviceLetter(ctx, store, trb.ID)
		suite.NoError(err)
		suite.NotNil(adviceLetter)
		adviceLetterChanges := map[string]interface{}{
			"trbRequestId":   trb.ID,
			"meetingSummary": "Talked about stuff",
		}
		_, err = UpdateTRBAdviceLetter(ctx, store, adviceLetterChanges)
		suite.NoError(err)
		// Fetch the updated request
		trb, err = GetTRBRequestByID(suite.testConfigs.Context, trb.ID, suite.testConfigs.Store)
		suite.NoError(err)
		trbStatus, err = GetTRBRequestStatus(ctx, store, *trb)
		suite.NoError(err)
		suite.EqualValues(models.TRBRequestStatusDraftAdviceLetter, trbStatus)
		taskStatuses, err = GetTRBTaskStatuses(ctx, store, *trb)
		suite.NoError(err)
		suite.EqualValues(models.TRBTaskStatuses{
			FormStatus:                 models.TRBFormStatusCompleted,
			FeedbackStatus:             models.TRBFeedbackStatusCompleted,
			ConsultPrepStatus:          models.TRBConsultPrepStatusCompleted,
			AttendConsultStatus:        models.TRBAttendConsultStatusCompleted,
			AdviceLetterStatus:         models.TRBAdviceLetterStatusInProgress,
			AdviceLetterStatusTaskList: models.TRBAdviceLetterStatusTaskListInReview,
		}, *taskStatuses)

		// Test the "ADVICE_LETTER_IN_REVIEW" status by requesting review for the advice letter
		_, err = RequestReviewForTRBAdviceLetter(ctx, store, &emailClient, stubFetchUserInfo, adviceLetter.ID)
		suite.NoError(err)
		// Fetch the updated request
		trb, err = GetTRBRequestByID(suite.testConfigs.Context, trb.ID, suite.testConfigs.Store)
		suite.NoError(err)
		trbStatus, err = GetTRBRequestStatus(ctx, store, *trb)
		suite.NoError(err)
		suite.EqualValues(models.TRBRequestStatusAdviceLetterInReview, trbStatus)
		taskStatuses, err = GetTRBTaskStatuses(ctx, store, *trb)
		suite.NoError(err)
		suite.EqualValues(models.TRBTaskStatuses{
			FormStatus:                 models.TRBFormStatusCompleted,
			FeedbackStatus:             models.TRBFeedbackStatusCompleted,
			ConsultPrepStatus:          models.TRBConsultPrepStatusCompleted,
			AttendConsultStatus:        models.TRBAttendConsultStatusCompleted,
			AdviceLetterStatus:         models.TRBAdviceLetterStatusReadyForReview,
			AdviceLetterStatusTaskList: models.TRBAdviceLetterStatusTaskListInReview,
		}, *taskStatuses)

		// Test the "ADVICE_LETTER_SENT" status by sending the advice letter
		_, err = SendTRBAdviceLetter(ctx, store, adviceLetter.ID, &emailClient, stubFetchUserInfo, stubFetchUserInfos, false, nil)
		suite.NoError(err)
		// Fetch the updated request
		trb, err = GetTRBRequestByID(suite.testConfigs.Context, trb.ID, suite.testConfigs.Store)
		suite.NoError(err)
		trbStatus, err = GetTRBRequestStatus(ctx, store, *trb)
		suite.NoError(err)
		suite.EqualValues(models.TRBRequestStatusAdviceLetterSent, trbStatus)
		taskStatuses, err = GetTRBTaskStatuses(ctx, store, *trb)
		suite.NoError(err)
		suite.EqualValues(models.TRBTaskStatuses{
			FormStatus:                 models.TRBFormStatusCompleted,
			FeedbackStatus:             models.TRBFeedbackStatusCompleted,
			ConsultPrepStatus:          models.TRBConsultPrepStatusCompleted,
			AttendConsultStatus:        models.TRBAttendConsultStatusCompleted,
			AdviceLetterStatus:         models.TRBAdviceLetterStatusCompleted,
			AdviceLetterStatusTaskList: models.TRBAdviceLetterStatusTaskListCompleted,
		}, *taskStatuses)

		// Test the "FOLLOW_UP_REQUESTED" status by updating the advice letter to recommend follow up
		adviceLetterChanges = map[string]interface{}{
			"trbRequestId":          trb.ID,
			"isFollowupRecommended": true,
		}
		_, err = UpdateTRBAdviceLetter(ctx, store, adviceLetterChanges)
		suite.NoError(err)
		// Fetch the updated request
		trb, err = GetTRBRequestByID(suite.testConfigs.Context, trb.ID, suite.testConfigs.Store)
		suite.NoError(err)
		trbStatus, err = GetTRBRequestStatus(ctx, store, *trb)
		suite.NoError(err)
		suite.EqualValues(models.TRBRequestStatusFollowUpRequested, trbStatus)
		taskStatuses, err = GetTRBTaskStatuses(ctx, store, *trb)
		suite.NoError(err)
		suite.EqualValues(models.TRBTaskStatuses{
			FormStatus:                 models.TRBFormStatusCompleted,
			FeedbackStatus:             models.TRBFeedbackStatusCompleted,
			ConsultPrepStatus:          models.TRBConsultPrepStatusCompleted,
			AttendConsultStatus:        models.TRBAttendConsultStatusCompleted,
			AdviceLetterStatus:         models.TRBAdviceLetterStatusCompleted,
			AdviceLetterStatusTaskList: models.TRBAdviceLetterStatusTaskListCompleted,
		}, *taskStatuses)
	})
}
