package seed

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/cmd/devdata/mocks"
	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/graph/resolvers"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

type trbSeeder struct {
	ctx           context.Context
	logger        *zap.Logger
	store         *storage.Store
	principalUser string
}

func newTRBSeeder(ctx context.Context, logger *zap.Logger, store *storage.Store, principalUser string) *trbSeeder {
	return &trbSeeder{
		ctx:           ctx,
		logger:        logger,
		store:         store,
		principalUser: principalUser,
	}
}

// TRBRequests seeds the database with a number of TRB requests in various states
func TRBRequests(logger *zap.Logger, store *storage.Store) error {
	ctx := mocks.CtxWithLoggerAndPrincipal(logger, mocks.PrincipalUser)
	s := newTRBSeeder(ctx, logger, store, mocks.PrincipalUser)
	must(s.seedTRBLeadOptions())

	if err := s.seedTRBCase1(); err != nil {
		return err
	}
	if err := s.seedTRBCase2(); err != nil {
		return err
	}
	if err := s.seedTRBCase3(); err != nil {
		return err
	}
	if err := s.seedTRBCase4(); err != nil {
		return err
	}
	if err := s.seedTRBCase5(); err != nil {
		return err
	}
	if err := s.seedTRBCase6(); err != nil {
		return err
	}
	if err := s.seedTRBCase7(); err != nil {
		return err
	}

	return nil
}

func (s *trbSeeder) seedTRBCase1() error {
	_, err := s.makeTRBRequest(models.TRBTNeedHelp, func(t *models.TRBRequest) {
		t.Name = "Case 1 - Draft request form"
	})
	if err != nil {
		return err
	}
	return nil
}

func (s *trbSeeder) seedTRBCase2() error {
	_, err := s.seedTRBWithForm("Case 2 - Request form complete", true)
	if err != nil {
		return err
	}

	return nil
}

func (s *trbSeeder) seedTRBCase3() error {
	trb, err := s.seedTRBWithForm("Case 3 - Ready for consult", true)
	if err != nil {
		return err
	}

	_, err = s.addTRBFeedback(trb)
	if err != nil {
		return err
	}

	return nil
}

func (s *trbSeeder) seedTRBCase4() error {
	trb, err := s.seedTRBWithForm("Case 4 - Consult scheduled", true)
	if err != nil {
		return err
	}

	_, err = s.addTRBFeedback(trb)
	if err != nil {
		return err
	}

	_, err = s.addTRBConsultMeeting(trb, false)
	if err != nil {
		return err
	}

	return nil
}

func (s *trbSeeder) seedTRBCase5() error {
	trb, err := s.seedTRBWithForm("Case 5 - Consult complete", true)
	if err != nil {
		return err
	}

	_, err = s.addTRBFeedback(trb)
	if err != nil {
		return err
	}

	_, err = s.addTRBConsultMeeting(trb, true)
	if err != nil {
		return err
	}

	return nil
}

func (s *trbSeeder) seedTRBCase6() error {
	trb, err := s.seedTRBWithForm("Case 6 - Draft advice letter", true)
	if err != nil {
		return err
	}

	_, err = s.addTRBFeedback(trb)
	if err != nil {
		return err
	}

	_, err = s.addTRBConsultMeeting(trb, true)
	if err != nil {
		return err
	}

	_, err = s.addAdviceLetter(trb, true)
	if err != nil {
		return err
	}

	return nil
}

func (s *trbSeeder) seedTRBCase7() error {
	trb, err := s.seedTRBWithForm("Case 7 - Advice letter in review", false)
	if err != nil {
		return err
	}

	_, err = s.addTRBFeedback(trb)
	if err != nil {
		return err
	}

	_, err = s.addTRBConsultMeeting(trb, true)
	if err != nil {
		return err
	}

	_, err = s.addAdviceLetter(trb, true)
	if err != nil {
		return err
	}

	return nil
}

func (s *trbSeeder) seedTRBLeadOptions() ([]*models.UserInfo, error) {
	ctx := appcontext.WithLogger(context.Background(), s.logger)
	leadUsers := map[string]*models.UserInfo{
		"ABCD": {
			CommonName: "Adeline Aarons",
			Email:      "adeline.aarons@local.fake",
			EuaUserID:  "ABCD",
		},
		"TEST": {
			CommonName: "Terry Thompson",
			Email:      "terry.thompson@local.fake",
			EuaUserID:  "TEST",
		},
		"A11Y": {
			CommonName: "Ally Anderson",
			Email:      "ally.anderson@local.fake",
			EuaUserID:  "A11Y",
		},
		"GRTB": {
			CommonName: "Gary Gordon",
			Email:      "gary.gordon@local.fake",
			EuaUserID:  "GRTB",
		},
	}

	stubFetchUserInfo := func(ctx context.Context, euaID string) (*models.UserInfo, error) {
		if userInfo, ok := leadUsers[euaID]; ok {
			return userInfo, nil
		}
		return nil, nil
	}

	leadUserInfos := make([]*models.UserInfo, 0, len(leadUsers))
	for euaID := range leadUsers {
		leadOpt, err := resolvers.CreateTRBLeadOption(ctx, s.store, stubFetchUserInfo, euaID)
		if err != nil {
			return nil, err
		}
		leadUserInfos = append(leadUserInfos, leadOpt)
	}

	return leadUserInfos, nil
}

func (s *trbSeeder) seedTRBWithForm(trbName string, isSubmitted bool) (*models.TRBRequest, error) {
	inProgress, err := s.makeTRBRequest(models.TRBTNeedHelp, func(t *models.TRBRequest) {
		t.Name = trbName
	})
	if err != nil {
		return nil, err
	}

	_, err = s.updateTRBRequestForm(map[string]interface{}{
		"trbRequestId":             inProgress.ID.String(),
		"isSubmitted":              isSubmitted,
		"component":                "Center for Medicare",
		"needsAssistanceWith":      "Something is wrong with my system",
		"hasSolutionInMind":        true,
		"proposedSolution":         "Get a tech support guru to fix it",
		"whereInProcess":           models.TRBWhereInProcessOptionOther,
		"whereInProcessOther":      "Just starting",
		"hasExpectedStartEndDates": true,
		"expectedStartDate":        "2023-02-27T05:00:00.000Z",
		"expectedEndDate":          "2023-01-31T05:00:00.000Z",
		"collabGroups": []models.TRBCollabGroupOption{
			models.TRBCollabGroupOptionEnterpriseArchitecture,
			models.TRBCollabGroupOptionOther,
		},
		"collabDateEnterpriseArchitecture": "The other day",
		"collabGroupOther":                 "CMS Splunk Team",
		"collabDateOther":                  "Last week",
		"collabGRBConsultRequested":        true,
		"subjectAreaOptions": []models.TRBSubjectAreaOption{
			models.TRBSubjectAreaOptionAssistanceWithSystemConceptDev,
			models.TRBSubjectAreaOptionCloudMigration,
		},
		"subjectAreaOptionOther": "Rocket science",
	})
	if err != nil {
		return nil, err
	}

	_, err = s.updateTRBRequestFundingSources(inProgress.ID, "33311", []string{"meatloaf", "spaghetti", "cereal"})
	if err != nil {
		return nil, err
	}
	return resolvers.GetTRBRequestByID(s.ctx, inProgress.ID, s.store)
}

func (s *trbSeeder) makeTRBRequest(rType models.TRBRequestType, callbacks ...func(*models.TRBRequest)) (*models.TRBRequest, error) {
	trb, err := resolvers.CreateTRBRequest(s.ctx, rType, mocks.FetchUserInfoMock, s.store)
	if err != nil {
		return nil, err
	}
	for _, cb := range callbacks {
		cb(trb)
	}
	trb, err = s.store.UpdateTRBRequest(s.ctx, trb)
	if err != nil {
		return nil, err
	}
	return trb, nil
}

func (s *trbSeeder) updateTRBRequestForm(changes map[string]interface{}) (*models.TRBRequestForm, error) {
	form, err := resolvers.UpdateTRBRequestForm(s.ctx, s.store, nil, mocks.FetchUserInfoMock, changes)
	if err != nil {
		return nil, err
	}
	return form, nil
}

func (s *trbSeeder) updateTRBRequestFundingSources(trbID uuid.UUID, fundingNumber string, fundingSources []string) ([]*models.TRBFundingSource, error) {
	ctx := mocks.CtxWithLoggerAndPrincipal(s.logger, s.principalUser)
	sources, err := resolvers.UpdateTRBRequestFundingSources(
		ctx,
		s.store,
		trbID,
		fundingNumber,
		fundingSources,
	)

	if err != nil {
		return nil, err
	}
	return sources, nil
}

func (s *trbSeeder) addTRBFeedback(trb *models.TRBRequest) (*models.TRBRequestFeedback, error) {
	feedback := &models.TRBRequestFeedback{
		TRBRequestID:    trb.ID,
		FeedbackMessage: "This is the most excellent TRB request ever created",
		CopyTRBMailbox:  false,
		NotifyEUAIDs:    []string{},
		Action:          models.TRBFeedbackActionReadyForConsult,
	}

	feedback, err := resolvers.CreateTRBRequestFeedback(s.ctx, s.store, nil, mocks.FetchUserInfoMock, mocks.FetchUserInfosMock, feedback)
	if err != nil {
		return nil, err
	}

	return feedback, nil
}

func (s *trbSeeder) addTRBConsultMeeting(trb *models.TRBRequest, dateIsPast bool) (*models.TRBRequest, error) {
	var meetingDate time.Time
	if dateIsPast {
		meetingDate = time.Now().AddDate(0, 0, -7)
	} else {
		meetingDate = time.Now().AddDate(0, 0, 7)
	}

	updatedTRB, err := resolvers.UpdateTRBRequestConsultMeetingTime(
		s.ctx,
		s.store,
		nil,
		mocks.FetchUserInfoMock,
		mocks.FetchUserInfosMock,
		trb.ID,
		meetingDate,
		false,
		[]string{},
		"It's gonna be a blast!",
	)
	if err != nil {
		return nil, err
	}

	return updatedTRB, nil
}

func (s *trbSeeder) addAdviceLetter(trb *models.TRBRequest, isDraft bool) (*models.TRBAdviceLetter, error) {
	_, err := resolvers.CreateTRBAdviceLetter(s.ctx, s.store, trb.ID)
	if err != nil {
		return nil, err
	}

	adviceLetterChanges := map[string]interface{}{
		"trbRequestId":          trb.ID.String(),
		"meetingSummary":        "Talked about stuff",
		"isFollowupRecommended": false,
	}
	letter, err := resolvers.UpdateTRBAdviceLetter(s.ctx, s.store, adviceLetterChanges)
	if err != nil {
		return nil, err
	}

	if !isDraft {
		_, err = resolvers.RequestReviewForTRBAdviceLetter(s.ctx, s.store, nil, mocks.FetchUserInfoMock, letter.ID)
		if err != nil {
			return nil, err
		}

		_, err = resolvers.SendTRBAdviceLetter(s.ctx, s.store, letter.ID, nil, mocks.FetchUserInfoMock, mocks.FetchUserInfosMock)
		if err != nil {
			return nil, err
		}

		recommendation := &models.TRBAdviceLetterRecommendation{
			TRBRequestID:   trb.ID,
			Title:          "Restart your computer",
			Recommendation: "I recommend you restart your computer",
			Links:          pq.StringArray{"google.com", "askjeeves.com"},
		}

		_, err = resolvers.CreateTRBAdviceLetterRecommendation(s.ctx, s.store, recommendation)
		if err != nil {
			return nil, err
		}
	}

	letter, err = resolvers.GetTRBAdviceLetterByTRBRequestID(s.ctx, s.store, trb.ID)
	if err != nil {
		return nil, err
	}

	return letter, nil
}

func must(_ interface{}, err error) {
	if err != nil {
		panic(err)
	}
}
