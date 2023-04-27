package main

import (
	"context"
	"os"
	"path/filepath"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/google/uuid"
	"github.com/lib/pq"

	"github.com/cmsgov/easi-app/cmd/devdata/mock"
	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/graph/resolvers"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *seederConfig) seedTRBRequests() error {
	must(s.seedTRBLeadOptions())

	cases := []func() error{
		s.seedTRBCase1,
		s.seedTRBCase2,
		s.seedTRBCase3,
		s.seedTRBCase4,
		s.seedTRBCase5,
		s.seedTRBCase6,
		s.seedTRBCase7,
		s.seedTRBCase8,
		s.seedTRBCase9,
	}

	for _, seedFunc := range cases {
		if err := seedFunc(); err != nil {
			return err
		}
	}
	return nil
}

func (s *seederConfig) seedTRBCase1() error {
	_, err := s.addTRBRequest(models.TRBTNeedHelp, "Case 1 - Draft request form")
	if err != nil {
		return err
	}
	return nil
}

func (s *seederConfig) seedTRBCase2() error {
	_, err := s.seedTRBWithForm("Case 2 - Request form complete", true)
	if err != nil {
		return err
	}

	return nil
}

func (s *seederConfig) seedTRBCase3() error {
	trb, err := s.seedTRBWithForm("Case 3 - Ready for consult", true)
	if err != nil {
		return err
	}

	_, err = s.addTRBFeedback(trb)
	if err != nil {
		return err
	}
	_, err = s.addTRBLead(trb, "TEST")
	if err != nil {
		return err
	}

	return nil
}

func (s *seederConfig) seedTRBCase4() error {
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

	_, err = s.addTRBLead(trb, "TEST")
	if err != nil {
		return err
	}

	return nil
}

func (s *seederConfig) seedTRBCase5() error {
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

	_, err = s.addTRBLead(trb, "TEST")
	if err != nil {
		return err
	}

	return nil
}

func (s *seederConfig) seedTRBCase6() error {
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

	_, err = s.addTRBLead(trb, "TEST")
	if err != nil {
		return err
	}

	return nil
}

func (s *seederConfig) seedTRBCase7() error {
	trb, err := s.seedTRBWithForm("Case 7 - Advice letter in review", true)
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

	_, err = s.addAdviceLetter(trb, false)
	if err != nil {
		return err
	}

	_, err = s.addTRBLead(trb, "TEST")
	if err != nil {
		return err
	}

	return nil
}

func (s *seederConfig) seedTRBCase8() error {
	trb, err := s.seedTRBWithForm("Case 8 - Advice letter in review with document", true)
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

	_, err = s.addAdviceLetter(trb, false)
	if err != nil {
		return err
	}

	_, err = s.addTRBLead(trb, "ABCD")
	if err != nil {
		return err
	}

	return nil
}

func (s *seederConfig) seedTRBCase9() error {
	trb, err := s.seedTRBWithForm("Case 9 - Advice letter reviewed", true)
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

	_, err = s.addTRBLead(trb, "GRTB")
	if err != nil {
		return err
	}

	return nil
}

func (s *seederConfig) seedTRBLeadOptions() ([]*models.UserInfo, error) {
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

func (s *seederConfig) seedTRBWithForm(trbName string, isSubmitted bool) (*models.TRBRequest, error) {
	trb, err := s.addTRBRequest(models.TRBTNeedHelp, trbName)
	if err != nil {
		return nil, err
	}

	_, err = s.updateTRBRequestForm(map[string]interface{}{
		"trbRequestId":             trb.ID.String(),
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

	_, err = s.updateTRBRequestFundingSources(trb.ID, "33311", []string{"meatloaf", "spaghetti", "cereal"})
	if err != nil {
		return nil, err
	}

	scanStatus := "CLEAN"
	_, err = s.addDocument(trb, &scanStatus)
	if err != nil {
		return nil, err
	}

	scanStatus = "INFECTED"
	_, err = s.addDocument(trb, &scanStatus)
	if err != nil {
		return nil, err
	}

	_, err = s.addDocument(trb, nil)
	if err != nil {
		return nil, err
	}
	return resolvers.GetTRBRequestByID(s.ctx, trb.ID, s.store)
}

func (s *seederConfig) addTRBRequest(rType models.TRBRequestType, name string) (*models.TRBRequest, error) {
	trb, err := resolvers.CreateTRBRequest(s.ctx, rType, mock.FetchUserInfoMock, s.store)
	if err != nil {
		return nil, err
	}

	trb.Name = name
	trb, err = s.store.UpdateTRBRequest(s.ctx, trb)
	if err != nil {
		return nil, err
	}

	return trb, nil
}

func (s *seederConfig) updateTRBRequestForm(changes map[string]interface{}) (*models.TRBRequestForm, error) {
	form, err := resolvers.UpdateTRBRequestForm(s.ctx, s.store, nil, mock.FetchUserInfoMock, changes)
	if err != nil {
		return nil, err
	}
	return form, nil
}

func (s *seederConfig) updateTRBRequestFundingSources(trbID uuid.UUID, fundingNumber string, fundingSources []string) ([]*models.TRBFundingSource, error) {
	ctx := mock.CtxWithLoggerAndPrincipal(s.logger, mock.PrincipalUser)
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

func (s *seederConfig) addTRBFeedback(trb *models.TRBRequest) (*models.TRBRequestFeedback, error) {
	feedback := &models.TRBRequestFeedback{
		TRBRequestID:    trb.ID,
		FeedbackMessage: "This is the most excellent TRB request ever created",
		CopyTRBMailbox:  false,
		NotifyEUAIDs:    []string{},
		Action:          models.TRBFeedbackActionReadyForConsult,
	}

	feedback, err := resolvers.CreateTRBRequestFeedback(s.ctx, s.store, nil, mock.FetchUserInfoMock, mock.FetchUserInfosMock, feedback)
	if err != nil {
		return nil, err
	}

	return feedback, nil
}

func (s *seederConfig) addTRBConsultMeeting(trb *models.TRBRequest, dateIsPast bool) (*models.TRBRequest, error) {
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
		mock.FetchUserInfoMock,
		mock.FetchUserInfosMock,
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

func (s *seederConfig) addTRBLead(trb *models.TRBRequest, leadEUA string) (*models.TRBRequest, error) {
	return resolvers.UpdateTRBRequestTRBLead(
		s.ctx,
		s.store,
		nil,
		mock.FetchUserInfoMock,
		trb.ID,
		leadEUA,
	)
}

func (s *seederConfig) addAdviceLetter(trb *models.TRBRequest, isDraft bool) (*models.TRBAdviceLetter, error) {
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
		_, err = resolvers.RequestReviewForTRBAdviceLetter(s.ctx, s.store, nil, mock.FetchUserInfoMock, letter.ID)
		if err != nil {
			return nil, err
		}

		_, err = resolvers.SendTRBAdviceLetter(s.ctx, s.store, letter.ID, nil, mock.FetchUserInfoMock, mock.FetchUserInfosMock)
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

func (s *seederConfig) addDocument(trb *models.TRBRequest, scanStatus *string) (*models.TRBRequestDocument, error) {
	path, err := filepath.Abs("cmd/devdata/data/sample.pdf")
	if err != nil {
		return nil, err
	}
	file, err := os.Open(path) // #nosec
	if err != nil {
		return nil, err
	}
	fileStats, err := file.Stat()
	if err != nil {
		return nil, err
	}

	otherDesc := "Some other type of doc"
	input := model.CreateTRBRequestDocumentInput{
		RequestID: trb.ID,
		FileData: graphql.Upload{
			File:        file,
			Filename:    "sample.pdf",
			Size:        fileStats.Size(),
			ContentType: "application/pdf",
		},
		DocumentType:         models.TRBRequestDocumentCommonTypeOther,
		OtherTypeDescription: &otherDesc,
	}
	document, err := resolvers.CreateTRBRequestDocument(s.ctx, s.store, s.s3Client, input)
	if err != nil {
		return nil, err
	}

	if scanStatus != nil {
		err = s.s3Client.SetTagValueForKey(document.S3Key, "av-status", *scanStatus)
		if err != nil {
			return nil, err
		}
	}

	return document, nil
}
