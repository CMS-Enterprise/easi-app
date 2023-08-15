package main

import (
	"bytes"
	"context"
	"os"
	"path/filepath"
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
	"github.com/lib/pq"

	"github.com/cmsgov/easi-app/cmd/devdata/mock"
	"github.com/cmsgov/easi-app/pkg/easiencryption"
	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/graph/resolvers"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *seederConfig) seedTRBRequests(ctx context.Context) error {
	must(s.seedTRBLeadOptions(ctx))

	cases := []func(context.Context) error{
		s.seedTRBCase1,
		s.seedTRBCase2,
		s.seedTRBCase3,
		s.seedTRBCase4,
		s.seedTRBCase5,
		s.seedTRBCase6,
		s.seedTRBCase7,
		s.seedTRBCase8,
		s.seedTRBCase9,
		s.seedTRBCase10,
	}

	for _, seedFunc := range cases {
		if err := seedFunc(ctx); err != nil {
			return err
		}
	}
	return nil
}

func (s *seederConfig) seedTRBCase1(ctx context.Context) error {
	_, err := s.addTRBRequest(ctx, models.TRBTNeedHelp, null.StringFrom("Case 1 - Draft request form").Ptr())
	if err != nil {
		return err
	}
	return nil
}

func (s *seederConfig) seedTRBCase2(ctx context.Context) error {
	_, err := s.seedTRBWithForm(ctx, null.StringFrom("Case 2 - Request form complete").Ptr(), true)
	if err != nil {
		return err
	}

	return nil
}

func (s *seederConfig) seedTRBCase3(ctx context.Context) error {
	trb, err := s.seedTRBWithForm(ctx, null.StringFrom("Case 3 - Ready for consult").Ptr(), true)
	if err != nil {
		return err
	}

	_, err = s.addTRBFeedback(ctx, trb)
	if err != nil {
		return err
	}
	_, err = s.addTRBLead(ctx, trb, "TEST")
	if err != nil {
		return err
	}

	return nil
}

func (s *seederConfig) seedTRBCase4(ctx context.Context) error {
	trb, err := s.seedTRBWithForm(ctx, null.StringFrom("Case 4 - Consult scheduled").Ptr(), true)
	if err != nil {
		return err
	}

	_, err = s.addTRBFeedback(ctx, trb)
	if err != nil {
		return err
	}

	_, err = s.addTRBConsultMeeting(ctx, trb, false)
	if err != nil {
		return err
	}

	_, err = s.addTRBLead(ctx, trb, "TEST")
	if err != nil {
		return err
	}

	return nil
}

func (s *seederConfig) seedTRBCase5(ctx context.Context) error {
	trb, err := s.seedTRBWithForm(ctx, null.StringFrom("Case 5 - Consult complete").Ptr(), true)
	if err != nil {
		return err
	}

	_, err = s.addTRBFeedback(ctx, trb)
	if err != nil {
		return err
	}

	_, err = s.addTRBConsultMeeting(ctx, trb, true)
	if err != nil {
		return err
	}

	_, err = s.addTRBLead(ctx, trb, "TEST")
	if err != nil {
		return err
	}

	return nil
}

func (s *seederConfig) seedTRBCase6(ctx context.Context) error {
	trb, err := s.seedTRBWithForm(ctx, null.StringFrom("Case 6 - Draft advice letter").Ptr(), true)
	if err != nil {
		return err
	}

	_, err = s.addTRBFeedback(ctx, trb)
	if err != nil {
		return err
	}

	_, err = s.addTRBConsultMeeting(ctx, trb, true)
	if err != nil {
		return err
	}

	_, err = s.addAdviceLetter(ctx, trb, true, false, false)
	if err != nil {
		return err
	}

	_, err = s.addTRBLead(ctx, trb, "TEST")
	if err != nil {
		return err
	}

	return nil
}

func (s *seederConfig) seedTRBCase7(ctx context.Context) error {
	trb, err := s.seedTRBWithForm(ctx, null.StringFrom("Case 7 - Advice letter in review").Ptr(), true)
	if err != nil {
		return err
	}

	_, err = s.addTRBFeedback(ctx, trb)
	if err != nil {
		return err
	}

	_, err = s.addTRBConsultMeeting(ctx, trb, true)
	if err != nil {
		return err
	}

	_, err = s.addAdviceLetter(ctx, trb, false, false, false)
	if err != nil {
		return err
	}

	_, err = s.addTRBLead(ctx, trb, "TEST")
	if err != nil {
		return err
	}

	return nil
}

func (s *seederConfig) seedTRBCase8(ctx context.Context) error {
	trb, err := s.seedTRBWithForm(ctx, null.StringFrom("Case 8 - Advice letter in review with document").Ptr(), true)
	if err != nil {
		return err
	}

	_, err = s.addTRBFeedback(ctx, trb)
	if err != nil {
		return err
	}

	_, err = s.addTRBConsultMeeting(ctx, trb, true)
	if err != nil {
		return err
	}

	_, err = s.addAdviceLetter(ctx, trb, false, false, false)
	if err != nil {
		return err
	}

	_, err = s.addTRBLead(ctx, trb, "ABCD")
	if err != nil {
		return err
	}

	return nil
}

func (s *seederConfig) seedTRBCase9(ctx context.Context) error {
	trb, err := s.seedTRBWithForm(ctx, null.StringFrom("Case 9 - Advice letter sent").Ptr(), true)
	if err != nil {
		return err
	}

	_, err = s.addTRBFeedback(ctx, trb)
	if err != nil {
		return err
	}

	_, err = s.addTRBConsultMeeting(ctx, trb, true)
	if err != nil {
		return err
	}

	_, err = s.addAdviceLetter(ctx, trb, false, true, false)
	if err != nil {
		return err
	}

	_, err = s.addTRBLead(ctx, trb, "GRTB")
	if err != nil {
		return err
	}

	return nil
}

func (s *seederConfig) seedTRBCase10(ctx context.Context) error {
	trb, err := s.seedTRBWithForm(ctx, null.StringFrom("Case 10 - Advice letter sent (follow up)").Ptr(), true)
	if err != nil {
		return err
	}

	_, err = s.addTRBFeedback(ctx, trb)
	if err != nil {
		return err
	}

	_, err = s.addTRBConsultMeeting(ctx, trb, true)
	if err != nil {
		return err
	}

	_, err = s.addAdviceLetter(ctx, trb, false, true, true)
	if err != nil {
		return err
	}

	_, err = s.addTRBLead(ctx, trb, "GRTB")
	if err != nil {
		return err
	}

	return nil
}

func (s *seederConfig) seedTRBLeadOptions(ctx context.Context) ([]*models.UserInfo, error) {
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

func (s *seederConfig) seedTRBWithForm(ctx context.Context, trbName *string, isSubmitted bool) (*models.TRBRequest, error) {
	trb, err := s.addTRBRequest(ctx, models.TRBTNeedHelp, trbName)
	if err != nil {
		return nil, err
	}

	_, err = s.updateTRBRequestForm(ctx, map[string]interface{}{
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

	_, err = s.updateTRBRequestFundingSources(ctx, trb.ID, "33311", []string{"meatloaf", "spaghetti", "cereal"})
	if err != nil {
		return nil, err
	}

	scanStatus := "CLEAN"
	_, err = s.addDocument(ctx, trb, &scanStatus)
	if err != nil {
		return nil, err
	}

	scanStatus = "INFECTED"
	_, err = s.addDocument(ctx, trb, &scanStatus)
	if err != nil {
		return nil, err
	}

	_, err = s.addDocument(ctx, trb, nil)
	if err != nil {
		return nil, err
	}
	return resolvers.GetTRBRequestByID(ctx, trb.ID, s.store)
}

func (s *seederConfig) addTRBRequest(ctx context.Context, rType models.TRBRequestType, name *string) (*models.TRBRequest, error) {
	trb, err := resolvers.CreateTRBRequest(ctx, rType, s.store)
	if err != nil {
		return nil, err
	}

	trb.Name = name
	trb, err = s.store.UpdateTRBRequest(ctx, trb)
	if err != nil {
		return nil, err
	}

	return trb, nil
}

func (s *seederConfig) updateTRBRequestForm(ctx context.Context, changes map[string]interface{}) (*models.TRBRequestForm, error) {
	form, err := resolvers.UpdateTRBRequestForm(ctx, s.store, nil, mock.FetchUserInfoMock, changes)
	if err != nil {
		return nil, err
	}
	return form, nil
}

func (s *seederConfig) updateTRBRequestFundingSources(ctx context.Context, trbID uuid.UUID, fundingNumber string, fundingSources []string) ([]*models.TRBFundingSource, error) {
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

func (s *seederConfig) addTRBFeedback(ctx context.Context, trb *models.TRBRequest) (*models.TRBRequestFeedback, error) {
	feedback := &models.TRBRequestFeedback{
		TRBRequestID:    trb.ID,
		FeedbackMessage: "This is the most excellent TRB request ever created",
		CopyTRBMailbox:  false,
		NotifyEUAIDs:    []string{},
		Action:          models.TRBFeedbackActionReadyForConsult,
	}

	feedback, err := resolvers.CreateTRBRequestFeedback(ctx, s.store, nil, mock.FetchUserInfoMock, mock.FetchUserInfosMock, feedback)
	if err != nil {
		return nil, err
	}

	return feedback, nil
}

func (s *seederConfig) addTRBConsultMeeting(ctx context.Context, trb *models.TRBRequest, dateIsPast bool) (*models.TRBRequest, error) {
	var meetingDate time.Time
	if dateIsPast {
		meetingDate = time.Now().AddDate(0, 0, -7)
	} else {
		meetingDate = time.Now().AddDate(0, 0, 7)
	}

	updatedTRB, err := resolvers.UpdateTRBRequestConsultMeetingTime(
		ctx,
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

func (s *seederConfig) addTRBLead(ctx context.Context, trb *models.TRBRequest, leadEUA string) (*models.TRBRequest, error) {
	return resolvers.UpdateTRBRequestTRBLead(
		ctx,
		s.store,
		nil,
		mock.FetchUserInfoMock,
		trb.ID,
		leadEUA,
	)
}

func (s *seederConfig) addAdviceLetter(ctx context.Context, trb *models.TRBRequest, isDraft bool, shouldSend bool, isFollowUpRequested bool) (*models.TRBAdviceLetter, error) {
	_, err := resolvers.CreateTRBAdviceLetter(ctx, s.store, trb.ID)
	if err != nil {
		return nil, err
	}

	adviceLetterChanges := map[string]interface{}{
		"trbRequestId":          trb.ID.String(),
		"meetingSummary":        "Talked about stuff",
		"isFollowupRecommended": isFollowUpRequested,
	}
	letter, err := resolvers.UpdateTRBAdviceLetter(ctx, s.store, adviceLetterChanges)
	if err != nil {
		return nil, err
	}

	if !isDraft {
		_, err = resolvers.RequestReviewForTRBAdviceLetter(ctx, s.store, nil, mock.FetchUserInfoMock, letter.ID)
		if err != nil {
			return nil, err
		}

		if shouldSend {
			_, err = resolvers.SendTRBAdviceLetter(ctx, s.store, letter.ID, nil, mock.FetchUserInfoMock, mock.FetchUserInfosMock)
			if err != nil {
				return nil, err
			}
		}

		recommendation := &models.TRBAdviceLetterRecommendation{
			TRBRequestID:   trb.ID,
			Title:          "Restart your computer",
			Recommendation: "I recommend you restart your computer",
			Links:          pq.StringArray{"google.com", "askjeeves.com"},
		}

		_, err = resolvers.CreateTRBAdviceLetterRecommendation(ctx, s.store, recommendation)
		if err != nil {
			return nil, err
		}
	}

	letter, err = resolvers.GetTRBAdviceLetterByTRBRequestID(ctx, s.store, trb.ID)
	if err != nil {
		return nil, err
	}

	return letter, nil
}

func (s *seederConfig) addDocument(ctx context.Context, trb *models.TRBRequest, scanStatus *string) (*models.TRBRequestDocument, error) {
	path, err := filepath.Abs("cmd/devdata/data/sample.pdf")
	if err != nil {
		return nil, err
	}
	file, err := os.Open(path) // #nosec
	if err != nil {
		return nil, err
	}

	var buf bytes.Buffer
	_, err = buf.ReadFrom(file)
	if err != nil {
		return nil, err
	}
	encoded := easiencryption.EncodeBase64String(buf.String())

	otherDesc := "Some other type of doc"
	input := model.CreateTRBRequestDocumentInput{
		RequestID: trb.ID,
		FileData: &model.EncodedDocumentUpload{
			File:        encoded,
			Filename:    "sample.pdf",
			Size:        25, //arbitrary
			ContentType: "application/pdf",
		},
		// FileData: graphql.Upload{
		// 	File:        file,
		// 	Filename:    "sample.pdf",
		// 	Size:        fileStats.Size(),
		// 	ContentType: "application/pdf",
		// },
		DocumentType:         models.TRBRequestDocumentCommonTypeOther,
		OtherTypeDescription: &otherDesc,
	}
	document, err := resolvers.CreateTRBRequestDocument(ctx, s.store, s.s3Client, input)
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
