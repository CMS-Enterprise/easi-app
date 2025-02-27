package resolvers

import (
	"context"
	"fmt"
	"strconv"
	"time"

	"github.com/lib/pq"

	"github.com/cms-enterprise/easi-app/pkg/appconfig"
	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/local"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/testhelpers"
)

// TestTRBRequestStatus tests the overall status of a TRB request
func (s *ResolverSuite) TestTRBRequestStatus() {
	ctx := s.testConfigs.Context
	store := s.testConfigs.Store

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

	env, _ := appconfig.NewEnvironment("test") // hardcoding here rather than using real env vars so we can have predictable the output in our tests

	localSender := local.NewSender(env)
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

	trb := models.NewTRBRequest(anonEua)
	trb.Type = models.TRBTNeedHelp
	trb.State = models.TRBRequestStateOpen
	trb, err = CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, s.testConfigs.Store)
	s.NoError(err)

	s.Run("status is correctly calculated as TRB tasks are performed", func() {
		// Test the "NEW" TRB status
		trb, err = GetTRBRequestByID(s.ctxWithNewDataloaders(), s.testConfigs.Store, trb.ID)
		s.NoError(err)
		trbStatus, err := GetTRBRequestStatus(s.ctxWithNewDataloaders(), *trb)
		s.NoError(err)
		s.EqualValues(models.TRBRequestStatusNew, trbStatus)
		taskStatuses, err := GetTRBTaskStatuses(s.ctxWithNewDataloaders(), *trb)
		s.NoError(err)
		s.EqualValues(models.TRBTaskStatuses{
			FormStatus:                   models.TRBFormStatusReadyToStart,
			FeedbackStatus:               models.TRBFeedbackStatusCannotStartYet,
			ConsultPrepStatus:            models.TRBConsultPrepStatusCannotStartYet,
			AttendConsultStatus:          models.TRBAttendConsultStatusCannotStartYet,
			GuidanceLetterStatus:         models.TRBGuidanceLetterStatusCannotStartYet,
			GuidanceLetterStatusTaskList: models.TRBGuidanceLetterStatusTaskListCannotStartYet,
		}, *taskStatuses)

		// Test the "DRAFT_REQUEST_FORM" status by making a random update to the form but not
		// submitting it
		form, err := GetTRBRequestFormByTRBRequestID(s.ctxWithNewDataloaders(), trb.ID)
		s.NoError(err)
		s.NotNil(form)
		formChanges := map[string]interface{}{
			"isSubmitted":  false,
			"trbRequestId": trb.ID,
			"component":    "Taco Cart",
		}
		_, err = UpdateTRBRequestForm(ctx, store, &emailClient, stubFetchUserInfo, formChanges)
		s.NoError(err)
		// Fetch the updated request
		trb, err = GetTRBRequestByID(s.testConfigs.Context, s.testConfigs.Store, trb.ID)
		s.NoError(err)
		trbStatus, err = GetTRBRequestStatus(s.ctxWithNewDataloaders(), *trb)
		s.NoError(err)
		s.EqualValues(models.TRBRequestStatusDraftRequestForm, trbStatus)
		taskStatuses, err = GetTRBTaskStatuses(s.ctxWithNewDataloaders(), *trb)
		s.NoError(err)
		s.EqualValues(models.TRBTaskStatuses{
			FormStatus:                   models.TRBFormStatusInProgress,
			FeedbackStatus:               models.TRBFeedbackStatusCannotStartYet,
			ConsultPrepStatus:            models.TRBConsultPrepStatusCannotStartYet,
			AttendConsultStatus:          models.TRBAttendConsultStatusCannotStartYet,
			GuidanceLetterStatus:         models.TRBGuidanceLetterStatusCannotStartYet,
			GuidanceLetterStatusTaskList: models.TRBGuidanceLetterStatusTaskListCannotStartYet,
		}, *taskStatuses)

		// Test the "REQUEST_FORM_COMPLETE" status by submitting it
		form, err = GetTRBRequestFormByTRBRequestID(s.ctxWithNewDataloaders(), trb.ID)
		s.NoError(err)
		s.NotNil(form)
		formChanges = map[string]interface{}{
			"isSubmitted":  true,
			"trbRequestId": trb.ID,
			"component":    "Taco Cart",
		}
		_, err = UpdateTRBRequestForm(ctx, store, &emailClient, stubFetchUserInfo, formChanges)
		s.NoError(err)
		// Fetch the updated request
		trb, err = GetTRBRequestByID(s.ctxWithNewDataloaders(), s.testConfigs.Store, trb.ID)
		s.NoError(err)
		trbStatus, err = GetTRBRequestStatus(s.ctxWithNewDataloaders(), *trb)
		s.NoError(err)
		s.EqualValues(models.TRBRequestStatusRequestFormComplete, trbStatus)
		taskStatuses, err = GetTRBTaskStatuses(s.ctxWithNewDataloaders(), *trb)
		s.NoError(err)
		s.EqualValues(models.TRBTaskStatuses{
			FormStatus:                   models.TRBFormStatusCompleted,
			FeedbackStatus:               models.TRBFeedbackStatusInReview,
			ConsultPrepStatus:            models.TRBConsultPrepStatusCannotStartYet,
			AttendConsultStatus:          models.TRBAttendConsultStatusCannotStartYet,
			GuidanceLetterStatus:         models.TRBGuidanceLetterStatusCannotStartYet,
			GuidanceLetterStatusTaskList: models.TRBGuidanceLetterStatusTaskListCannotStartYet,
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
			s.testConfigs.Store,
			&emailClient,
			stubFetchUserInfo,
			stubFetchUserInfos,
			feedback,
		)
		s.NoError(err)
		// Fetch the updated request
		trb, err = GetTRBRequestByID(s.ctxWithNewDataloaders(), s.testConfigs.Store, trb.ID)
		s.NoError(err)
		trbStatus, err = GetTRBRequestStatus(s.ctxWithNewDataloaders(), *trb)
		s.NoError(err)
		s.EqualValues(models.TRBRequestStatusReadyForConsult, trbStatus)
		taskStatuses, err = GetTRBTaskStatuses(s.ctxWithNewDataloaders(), *trb)
		s.NoError(err)
		s.EqualValues(models.TRBTaskStatuses{
			FormStatus:                   models.TRBFormStatusCompleted,
			FeedbackStatus:               models.TRBFeedbackStatusCompleted,
			ConsultPrepStatus:            models.TRBConsultPrepStatusReadyToStart,
			AttendConsultStatus:          models.TRBAttendConsultStatusReadyToSchedule,
			GuidanceLetterStatus:         models.TRBGuidanceLetterStatusCannotStartYet,
			GuidanceLetterStatusTaskList: models.TRBGuidanceLetterStatusTaskListCannotStartYet,
		}, *taskStatuses)

		// Test the "CONSULT_SCHEDULED" status by scheduling a consult session in the future
		meetingTime := time.Now().Local().Add(time.Hour * 24)
		s.NoError(err)
		_, err = UpdateTRBRequestConsultMeetingTime(
			s.testConfigs.Context,
			s.testConfigs.Store,
			nil,
			stubFetchUserInfo,
			stubFetchUserInfos,
			trb.ID,
			meetingTime,
			true,
			[]string{"mclovin@example.com"},
			"See you then!",
		)
		s.NoError(err)
		// Fetch the updated request
		trb, err = GetTRBRequestByID(s.ctxWithNewDataloaders(), s.testConfigs.Store, trb.ID)
		s.NoError(err)
		trbStatus, err = GetTRBRequestStatus(s.ctxWithNewDataloaders(), *trb)
		s.NoError(err)
		s.EqualValues(models.TRBRequestStatusConsultScheduled, trbStatus)
		taskStatuses, err = GetTRBTaskStatuses(s.ctxWithNewDataloaders(), *trb)
		s.NoError(err)
		s.EqualValues(models.TRBTaskStatuses{
			FormStatus:                   models.TRBFormStatusCompleted,
			FeedbackStatus:               models.TRBFeedbackStatusCompleted,
			ConsultPrepStatus:            models.TRBConsultPrepStatusReadyToStart,
			AttendConsultStatus:          models.TRBAttendConsultStatusScheduled,
			GuidanceLetterStatus:         models.TRBGuidanceLetterStatusCannotStartYet,
			GuidanceLetterStatusTaskList: models.TRBGuidanceLetterStatusTaskListCannotStartYet,
		}, *taskStatuses)

		// Test the "CONSULT_COMPLETE" status by updating the meeting time to be a time in the past
		meetingTime = time.Now().Local().Add(time.Hour * -24)
		s.NoError(err)
		_, err = UpdateTRBRequestConsultMeetingTime(
			s.testConfigs.Context,
			s.testConfigs.Store,
			nil,
			stubFetchUserInfo,
			stubFetchUserInfos,
			trb.ID,
			meetingTime,
			true,
			[]string{"mclovin@example.com"},
			"See you then!",
		)
		s.NoError(err)
		// Fetch the updated request
		trb, err = GetTRBRequestByID(s.ctxWithNewDataloaders(), s.testConfigs.Store, trb.ID)
		s.NoError(err)
		trbStatus, err = GetTRBRequestStatus(s.ctxWithNewDataloaders(), *trb)
		s.NoError(err)
		s.EqualValues(models.TRBRequestStatusConsultComplete, trbStatus)
		taskStatuses, err = GetTRBTaskStatuses(s.ctxWithNewDataloaders(), *trb)
		s.NoError(err)
		s.EqualValues(models.TRBTaskStatuses{
			FormStatus:                   models.TRBFormStatusCompleted,
			FeedbackStatus:               models.TRBFeedbackStatusCompleted,
			ConsultPrepStatus:            models.TRBConsultPrepStatusCompleted,
			AttendConsultStatus:          models.TRBAttendConsultStatusCompleted,
			GuidanceLetterStatus:         models.TRBGuidanceLetterStatusReadyToStart,
			GuidanceLetterStatusTaskList: models.TRBGuidanceLetterStatusTaskListInReview,
		}, *taskStatuses)

		// Test the "DRAFT_GUIDANCE_LETTER" status by making a change to the guidance letter
		guidanceLetter, err := CreateTRBGuidanceLetter(ctx, store, trb.ID)
		s.NoError(err)
		s.NotNil(guidanceLetter)
		guidanceLetterChanges := map[string]interface{}{
			"trbRequestId":   trb.ID,
			"meetingSummary": "Talked about stuff",
		}
		_, err = UpdateTRBGuidanceLetter(ctx, store, guidanceLetterChanges)
		s.NoError(err)
		// Fetch the updated request
		trb, err = GetTRBRequestByID(s.ctxWithNewDataloaders(), s.testConfigs.Store, trb.ID)
		s.NoError(err)
		trbStatus, err = GetTRBRequestStatus(s.ctxWithNewDataloaders(), *trb)
		s.NoError(err)
		s.EqualValues(models.TRBRequestStatusDraftGuidanceLetter, trbStatus)
		taskStatuses, err = GetTRBTaskStatuses(s.ctxWithNewDataloaders(), *trb)
		s.NoError(err)
		s.EqualValues(models.TRBTaskStatuses{
			FormStatus:                   models.TRBFormStatusCompleted,
			FeedbackStatus:               models.TRBFeedbackStatusCompleted,
			ConsultPrepStatus:            models.TRBConsultPrepStatusCompleted,
			AttendConsultStatus:          models.TRBAttendConsultStatusCompleted,
			GuidanceLetterStatus:         models.TRBGuidanceLetterStatusInProgress,
			GuidanceLetterStatusTaskList: models.TRBGuidanceLetterStatusTaskListInReview,
		}, *taskStatuses)

		// Test the "GUIDANCE_LETTER_IN_REVIEW" status by requesting review for the guidance letter
		_, err = RequestReviewForTRBGuidanceLetter(ctx, store, &emailClient, stubFetchUserInfo, guidanceLetter.ID)
		s.NoError(err)
		// Fetch the updated request
		trb, err = GetTRBRequestByID(s.ctxWithNewDataloaders(), s.testConfigs.Store, trb.ID)
		s.NoError(err)
		trbStatus, err = GetTRBRequestStatus(s.ctxWithNewDataloaders(), *trb)
		s.NoError(err)
		s.EqualValues(models.TRBRequestStatusGuidanceLetterInReview, trbStatus)
		taskStatuses, err = GetTRBTaskStatuses(s.ctxWithNewDataloaders(), *trb)
		s.NoError(err)
		s.EqualValues(models.TRBTaskStatuses{
			FormStatus:                   models.TRBFormStatusCompleted,
			FeedbackStatus:               models.TRBFeedbackStatusCompleted,
			ConsultPrepStatus:            models.TRBConsultPrepStatusCompleted,
			AttendConsultStatus:          models.TRBAttendConsultStatusCompleted,
			GuidanceLetterStatus:         models.TRBGuidanceLetterStatusReadyForReview,
			GuidanceLetterStatusTaskList: models.TRBGuidanceLetterStatusTaskListInReview,
		}, *taskStatuses)

		// Test the "GUIDANCE_LETTER_SENT" status by sending the guidance letter
		_, err = SendTRBGuidanceLetter(ctx, store, guidanceLetter.ID, &emailClient, stubFetchUserInfo, stubFetchUserInfos, false, nil)
		s.NoError(err)
		// Fetch the updated request
		trb, err = GetTRBRequestByID(s.ctxWithNewDataloaders(), s.testConfigs.Store, trb.ID)
		s.NoError(err)
		trbStatus, err = GetTRBRequestStatus(s.ctxWithNewDataloaders(), *trb)
		s.NoError(err)
		s.EqualValues(models.TRBRequestStatusGuidanceLetterSent, trbStatus)
		taskStatuses, err = GetTRBTaskStatuses(s.ctxWithNewDataloaders(), *trb)
		s.NoError(err)
		s.EqualValues(models.TRBTaskStatuses{
			FormStatus:                   models.TRBFormStatusCompleted,
			FeedbackStatus:               models.TRBFeedbackStatusCompleted,
			ConsultPrepStatus:            models.TRBConsultPrepStatusCompleted,
			AttendConsultStatus:          models.TRBAttendConsultStatusCompleted,
			GuidanceLetterStatus:         models.TRBGuidanceLetterStatusCompleted,
			GuidanceLetterStatusTaskList: models.TRBGuidanceLetterStatusTaskListCompleted,
		}, *taskStatuses)

		// Test the "FOLLOW_UP_REQUESTED" status by updating the guidance letter to recommend follow up
		guidanceLetterChanges = map[string]interface{}{
			"trbRequestId":          trb.ID,
			"isFollowupRecommended": true,
		}
		_, err = UpdateTRBGuidanceLetter(ctx, store, guidanceLetterChanges)
		s.NoError(err)
		// Fetch the updated request
		trb, err = GetTRBRequestByID(s.ctxWithNewDataloaders(), s.testConfigs.Store, trb.ID)
		s.NoError(err)
		trbStatus, err = GetTRBRequestStatus(s.ctxWithNewDataloaders(), *trb)
		s.NoError(err)
		s.EqualValues(models.TRBRequestStatusFollowUpRequested, trbStatus)
		taskStatuses, err = GetTRBTaskStatuses(s.ctxWithNewDataloaders(), *trb)
		s.NoError(err)
		s.EqualValues(models.TRBTaskStatuses{
			FormStatus:                   models.TRBFormStatusCompleted,
			FeedbackStatus:               models.TRBFeedbackStatusCompleted,
			ConsultPrepStatus:            models.TRBConsultPrepStatusCompleted,
			AttendConsultStatus:          models.TRBAttendConsultStatusCompleted,
			GuidanceLetterStatus:         models.TRBGuidanceLetterStatusCompleted,
			GuidanceLetterStatusTaskList: models.TRBGuidanceLetterStatusTaskListCompleted,
		}, *taskStatuses)
	})
}
