package main

import (
	"bytes"
	"context"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/google/uuid"
	"github.com/guregu/null"
	"github.com/lib/pq"
	"golang.org/x/sync/errgroup"

	"github.com/cms-enterprise/easi-app/cmd/devdata/mock"
	"github.com/cms-enterprise/easi-app/pkg/easiencoding"
	"github.com/cms-enterprise/easi-app/pkg/graph/resolvers"
	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/local/cedarcoremock"
	"github.com/cms-enterprise/easi-app/pkg/models"
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
		s.seedTRBCase11,
		s.seedTRBCase12,
		s.seedTRBCase13,
		s.seedTRBCase14,
		s.seedTRBCase15,
		s.seedTRBCase16,
		s.seedTRBCase17,
		s.seedTRBCase18,
		s.seedTRBCase19,
		s.seedTRBCase20,
		s.seedTRBCase21, //closed requests loop
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
	trb, err := s.seedTRBWithForm(ctx, null.StringFrom("Case 6 - Draft guidance letter").Ptr(), true)
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

	_, err = s.addGuidanceLetter(ctx, trb, true, false, false)
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
	trb, err := s.seedTRBWithForm(ctx, null.StringFrom("Case 7 - Guidance letter in review").Ptr(), true)
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

	_, err = s.addGuidanceLetter(ctx, trb, false, false, false)
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
	trb, err := s.seedTRBWithForm(ctx, null.StringFrom("Case 8 - Guidance letter in review with document").Ptr(), true)
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

	_, err = s.addGuidanceLetter(ctx, trb, false, false, false)
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
	trb, err := s.seedTRBWithForm(ctx, null.StringFrom("Case 9 - Guidance letter sent").Ptr(), true)
	if err != nil {
		return err
	}

	_, err = s.addTRBFeedback(ctx, trb)
	if err != nil {
		return err
	}

	_, err = s.addTRBFeedback(ctx, trb, func(fb *models.TRBRequestFeedback) {
		fb.FeedbackMessage = "This is the earlier feedback"
		fb.CreatedAt = time.Now().AddDate(0, 0, -7)
	})
	if err != nil {
		return err
	}

	_, err = s.addTRBFeedback(ctx, trb, func(fb *models.TRBRequestFeedback) {
		fb.FeedbackMessage = "This is the earliest feedback"
		fb.CreatedAt = time.Now().AddDate(0, 0, -14)
	})
	if err != nil {
		return err
	}

	_, err = s.addTRBConsultMeeting(ctx, trb, true)
	if err != nil {
		return err
	}

	_, err = s.addGuidanceLetter(ctx, trb, false, true, false)
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
	trb, err := s.seedTRBWithForm(ctx, null.StringFrom("Case 10 - Guidance letter sent (follow up)").Ptr(), true)
	if err != nil {
		return err
	}

	_, err = s.addTRBFeedback(ctx, trb)
	if err != nil {
		return err
	}

	_, err = s.addTRBFeedback(ctx, trb, func(fb *models.TRBRequestFeedback) {
		fb.FeedbackMessage = "This is the earlier feedback"
		fb.CreatedAt = time.Now().AddDate(0, 0, -14)
	})
	if err != nil {
		return err
	}

	_, err = s.addTRBConsultMeeting(ctx, trb, true)
	if err != nil {
		return err
	}

	_, err = s.addGuidanceLetter(ctx, trb, false, true, true)
	if err != nil {
		return err
	}

	_, err = s.addTRBLead(ctx, trb, "GRTB")
	if err != nil {
		return err
	}

	return nil
}

// seed a TRB request with category-specific admin notes, including references to documents and insights
func (s *seederConfig) seedTRBCase11(ctx context.Context) error {
	trb, err := s.seedTRBWithForm(ctx, null.StringFrom("Case 11 - Admin notes w/ category-specific data").Ptr(), true)
	if err != nil {
		return err
	}

	_, err = s.addTRBFeedback(ctx, trb)
	if err != nil {
		return err
	}

	_, err = s.addTRBFeedback(ctx, trb, func(fb *models.TRBRequestFeedback) {
		fb.FeedbackMessage = "This is the newest feedback"
		fb.CreatedAt = time.Now().AddDate(0, 0, 7)
	})
	if err != nil {
		return err
	}
	_, err = s.addTRBFeedback(ctx, trb, func(fb *models.TRBRequestFeedback) {
		fb.FeedbackMessage = "This is the earlier feedback"
		fb.CreatedAt = time.Now().AddDate(0, 0, -7)
	})
	if err != nil {
		return err
	}

	_, err = s.addTRBFeedback(ctx, trb, func(fb *models.TRBRequestFeedback) {
		fb.FeedbackMessage = "This is more feedback"
		fb.CreatedAt = time.Now().AddDate(0, 0, -1)
	})
	if err != nil {
		return err
	}

	_, err = s.addTRBConsultMeeting(ctx, trb, true)
	if err != nil {
		return err
	}

	// draft guidance letter, not sent
	_, err = s.addGuidanceLetter(ctx, trb, true, false, false)
	if err != nil {
		return err
	}

	// create 3 documents we can reference in admin notes
	documentIDs := []uuid.UUID{}
	scanStatus := "CLEAN"
	for i := 0; i < 3; i++ {
		// new error variable to avoid issues with shadowing err from outer scope
		doc, errAddDocument := s.addDocument(ctx, trb, &scanStatus)
		if errAddDocument != nil {
			return err
		}
		documentIDs = append(documentIDs, doc.ID)
	}

	// create 3 insights we can reference in admin notes
	insights, err := s.addGuidanceLetterInsights(ctx, trb)
	if err != nil {
		return err
	}

	// create admin notes of all five categories

	generalRequestNoteInput := models.CreateTRBAdminNoteGeneralRequestInput{
		TrbRequestID: trb.ID,
		NoteText:     "This is a general request admin note from seed data",
	}
	_, err = resolvers.CreateTRBAdminNoteGeneralRequest(ctx, s.store, generalRequestNoteInput)
	if err != nil {
		return err
	}

	initialRequestFormNoteInput := models.CreateTRBAdminNoteInitialRequestFormInput{
		TrbRequestID:                 trb.ID,
		NoteText:                     "This is an initial request form admin note from seed data",
		AppliesToBasicRequestDetails: true,
		AppliesToSubjectAreas:        false,
		AppliesToAttendees:           true,
	}
	_, err = resolvers.CreateTRBAdminNoteInitialRequestForm(ctx, s.store, initialRequestFormNoteInput)
	if err != nil {
		return err
	}

	// link to 2 of the documents so we can check that it links to multiple docs *and* that it doesn't link to all the docs on the request
	supportingDocumentsNoteInput := models.CreateTRBAdminNoteSupportingDocumentsInput{
		TrbRequestID: trb.ID,
		NoteText:     "This is a supporting documents admin note from seed data",
		DocumentIDs: []uuid.UUID{
			documentIDs[0],
			documentIDs[1],
		},
	}
	_, err = resolvers.CreateTRBAdminNoteSupportingDocuments(ctx, s.store, supportingDocumentsNoteInput)
	if err != nil {
		return err
	}

	consultSessionNoteInput := models.CreateTRBAdminNoteConsultSessionInput{
		TrbRequestID: trb.ID,
		NoteText:     "This is a consult session admin note from seed data",
	}
	_, err = resolvers.CreateTRBAdminNoteConsultSession(ctx, s.store, consultSessionNoteInput)
	if err != nil {
		return err
	}

	// link to 2 of the insights so we can check that it links to multiple recs *and* that it doesn't link to all the recs on the request
	guidanceLetterNoteInput := models.CreateTRBAdminNoteGuidanceLetterInput{
		TrbRequestID:            trb.ID,
		NoteText:                "This is a guidance letter admin note from seed data",
		AppliesToMeetingSummary: true,
		AppliesToNextSteps:      false,
		InsightIDs: []uuid.UUID{
			insights[0].ID,
			insights[1].ID,
		},
	}
	_, err = resolvers.CreateTRBAdminNoteGuidanceLetter(ctx, s.store, guidanceLetterNoteInput)
	if err != nil {
		return err
	}

	return nil
}

func (s *seederConfig) seedTRBCase12(ctx context.Context) error {
	trbRequest, err := s.seedTRBWithForm(ctx, null.StringFrom("Case 12 - Completed request form with New System Relation").Ptr(), true)
	if err != nil {
		return err
	}
	_, err = s.addTRBNewSystemRelation(ctx, trbRequest.ID, []string{"12345", "67890"})
	if err != nil {
		return err
	}
	return nil
}

func (s *seederConfig) seedTRBCase13(ctx context.Context) error {
	trbRequest, err := s.seedTRBWithForm(ctx, null.StringFrom("Case 13 - Completed request form with Existing Service Relation").Ptr(), true)
	if err != nil {
		return err
	}
	_, err = s.addTRBExistingServiceRelation(ctx, trbRequest.ID, "Test Contract Name", []string{"12345", "67890"})
	if err != nil {
		return err
	}
	return nil
}

func (s *seederConfig) seedTRBCase14(ctx context.Context) error {
	trbRequest, err := s.seedTRBWithForm(ctx, null.StringFrom("Case 14 - Completed request form with Existing System Relation").Ptr(), true)
	if err != nil {
		return err
	}
	_, err = s.addTRBExistingSystemRelation(
		ctx,
		trbRequest.ID,
		[]string{"00001", "00002"}, // contract numbers
		[]string{ // cedar system IDs, these mock IDs are from the client helper
			"{11AB1A00-1234-5678-ABC1-1A001B00CC0A}",
			"{11AB1A00-1234-5678-ABC1-1A001B00CC1B}",
		},
	)
	if err != nil {
		return err
	}
	return nil
}

func (s *seederConfig) seedTRBCase15(ctx context.Context) error {
	trbRequest, err := s.seedTRBWithForm(ctx, null.StringFrom("Case 15 - Completed request form with Attendees").Ptr(), true)
	if err != nil {
		return err
	}
	err = s.seedTRBWithAttendees(ctx, trbRequest.ID)
	if err != nil {
		return err
	}
	return nil
}

func (s *seederConfig) seedTRBCase16(ctx context.Context) error {
	trbRequest, err := s.seedTRBWithForm(ctx, null.StringFrom("Case 16 - Completed request form with Existing Inactive System Relation").Ptr(), true)
	if err != nil {
		return err
	}
	_, err = s.addTRBExistingSystemRelation(
		ctx,
		trbRequest.ID,
		[]string{"ABC", "DEF"}, // contract numbers
		[]string{ // cedar system IDs, these mock IDs are from the client helper
			"{11AB1A00-1234-5678-ABC1-1A001B00CC6G}",
			"{11AB1A00-1234-5678-ABC1-1A001B00CC5F}",
		},
	)
	if err != nil {
		return err
	}
	return nil
}

func (s *seederConfig) seedTRBCase17(ctx context.Context) error {
	trbRequest, err := s.seedTRBWithForm(ctx, null.StringFrom("Case 17 - Completed request with related system (0A)").Ptr(), true)
	if err != nil {
		return err
	}
	_, err = s.addTRBExistingSystemRelation(
		ctx,
		trbRequest.ID,
		[]string{"00002", "00003"}, // contract numbers
		[]string{ // cedar system IDs, these mock IDs are from the client helper
			"{11AB1A00-1234-5678-ABC1-1A001B00CC0A}",
			"{11AB1A00-1234-5678-ABC1-1A001B00CC3D}",
		},
	)
	if err != nil {
		return err
	}
	return nil
}

func (s *seederConfig) seedTRBCase18(ctx context.Context) error {
	trbRequest, err := s.seedTRBWithForm(ctx, null.StringFrom("Case 18 - Completed request with related system (1B)").Ptr(), true)
	if err != nil {
		return err
	}
	_, err = s.addTRBExistingSystemRelation(
		ctx,
		trbRequest.ID,
		[]string{"00004", "00005"}, // contract numbers
		[]string{ // cedar system IDs, these mock IDs are from the client helper
			"{11AB1A00-1234-5678-ABC1-1A001B00CC1B}",
			"{11AB1A00-1234-5678-ABC1-1A001B00CC4E}",
		},
	)
	if err != nil {
		return err
	}
	return nil
}

func (s *seederConfig) seedTRBCase19(ctx context.Context) error {
	trbRequest, err := s.seedTRBWithForm(ctx, null.StringFrom("Case 19 - Completed request form with related contract (12345)").Ptr(), true)
	if err != nil {
		return err
	}
	_, err = s.addTRBExistingServiceRelation(ctx, trbRequest.ID, "Test Contract Name", []string{"12345", "00006"})
	if err != nil {
		return err
	}
	return nil
}

func (s *seederConfig) seedTRBCase20(ctx context.Context) error {
	trbRequest, err := s.seedTRBWithForm(ctx, null.StringFrom("Case 20 - Completed request form with related contract (67890)").Ptr(), true)
	if err != nil {
		return err
	}
	_, err = s.addTRBExistingServiceRelation(ctx, trbRequest.ID, "Test Contract Name", []string{"00007", "67890"})
	if err != nil {
		return err
	}
	return nil
}

func (s *seederConfig) seedTRBCase21(ctx context.Context) error {
	g, ctx := errgroup.WithContext(ctx)
	for i := range closedRequestCount {
		caseNum := i + 20 + 1
		g.Go(func() error {
			trbRequest, err := s.seedTRBWithForm(ctx, null.StringFrom(fmt.Sprintf("Case %d - Closed request", caseNum)).Ptr(), true)
			if err != nil {
				return err
			}

			_, err = s.addTRBFeedback(ctx, trbRequest)
			if err != nil {
				return err
			}
			_, err = s.addTRBFeedback(ctx, trbRequest, func(fb *models.TRBRequestFeedback) {
				fb.FeedbackMessage = "This is more feedback"
				fb.CreatedAt = time.Now().AddDate(0, 0, -1)
			})
			if err != nil {
				return err
			}

			err = s.seedTRBWithAttendees(ctx, trbRequest.ID)
			if err != nil {
				return err
			}

			_, err = s.addTRBConsultMeeting(ctx, trbRequest, true)
			if err != nil {
				return err
			}

			// draft guidance letter, not sent
			_, err = s.addGuidanceLetter(ctx, trbRequest, true, false, false)
			if err != nil {
				return err
			}

			// create 3 documents we can reference in admin notes
			documentIDs := []uuid.UUID{}
			scanStatus := "CLEAN"
			for i := 0; i < 3; i++ {
				// new error variable to avoid issues with shadowing err from outer scope
				doc, errAddDocument := s.addDocument(ctx, trbRequest, &scanStatus)
				if errAddDocument != nil {
					return err
				}
				documentIDs = append(documentIDs, doc.ID)
			}

			insights, err := s.addGuidanceLetterInsights(ctx, trbRequest)
			if err != nil {
				return err
			}

			guidanceLetterNoteInput := models.CreateTRBAdminNoteGuidanceLetterInput{
				TrbRequestID:            trbRequest.ID,
				NoteText:                "This is a guidance letter admin note from seed data",
				AppliesToMeetingSummary: true,
				AppliesToNextSteps:      false,
				InsightIDs: []uuid.UUID{
					insights[0].ID,
					insights[1].ID,
				},
			}

			_, err = resolvers.CreateTRBAdminNoteGuidanceLetter(ctx, s.store, guidanceLetterNoteInput)
			if err != nil {
				return err
			}

			supportingDocumentsNoteInput := models.CreateTRBAdminNoteSupportingDocumentsInput{
				TrbRequestID: trbRequest.ID,
				NoteText:     "This is a supporting documents admin note from seed data",
				DocumentIDs: []uuid.UUID{
					documentIDs[0],
					documentIDs[1],
				},
			}
			_, err = resolvers.CreateTRBAdminNoteSupportingDocuments(ctx, s.store, supportingDocumentsNoteInput)
			if err != nil {
				return err
			}

			_, err = s.addTRBExistingSystemRelation(
				ctx,
				trbRequest.ID,
				[]string{"11111", "11112"}, // contract numbers
				[]string{ // cedar system IDs, these mock IDs are from the client helper
					"{11AB1A00-1234-5678-ABC1-1A001B00CC5F}",
				},
			)
			if err != nil {
				return err
			}
			_, err = resolvers.CloseTRBRequest(
				ctx,
				s.store,
				nil,
				s.UserSearchClient.FetchUserInfo,
				s.UserSearchClient.FetchUserInfos,
				trbRequest.ID,
				models.HTML("Because it's done!"),
				false,
				[]string{},
			)
			if err != nil {
				return err
			}
			return nil
		})
	}
	if err := g.Wait(); err != nil {
		return err
	}
	return nil
}

func (s *seederConfig) seedTRBLeadOptions(ctx context.Context) ([]*models.UserInfo, error) {
	leadUsers := map[string]*models.UserInfo{
		"ABCD": {
			DisplayName: "Adeline Aarons",
			Email:       "adeline.aarons@local.fake",
			Username:    "ABCD",
		},
		"TEST": {
			DisplayName: "Terry Thompson",
			Email:       "terry.thompson@local.fake",
			Username:    "TEST",
		},
		"A11Y": {
			DisplayName: "Ally Anderson",
			Email:       "ally.anderson@local.fake",
			Username:    "A11Y",
		},
		"GRTB": {
			DisplayName: "Gary Gordon",
			Email:       "gary.gordon@local.fake",
			Username:    "GRTB",
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
		"trbRequestId":             trb.ID,
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
			models.TRBSubjectAreaOptionArtificialIntelligence,
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
	return resolvers.GetTRBRequestByID(ctx, s.store, trb.ID)
}

func (s *seederConfig) seedTRBWithAttendees(ctx context.Context, trbRequestID uuid.UUID) error {
	_, err := s.addAttendee(
		ctx,
		trbRequestID,
		mock.Batman,
		models.PersonRoleInformationSystemSecurityAdvisor,
		"Security Component",
	)
	if err != nil {
		return err
	}
	_, err = s.addAttendee(
		ctx,
		trbRequestID,
		mock.TestUser,
		models.PersonRoleBusinessOwner,
		"Business Component",
	)
	if err != nil {
		return err
	}
	_, err = s.addAttendee(
		ctx,
		trbRequestID,
		mock.AccessibilityUser,
		models.PersonRoleCRA,
		"Cyber Component",
	)
	if err != nil {
		return err
	}
	return nil
}
func (s *seederConfig) addTRBRequest(ctx context.Context, rType models.TRBRequestType, name *string) (*models.TRBRequest, error) {
	trb, err := resolvers.CreateTRBRequest(ctx, rType, s.store)
	if err != nil {
		return nil, err
	}
	attendee, err := s.store.GetAttendeeByEUAIDAndTRBID(ctx, trb.CreatedBy, trb.ID)
	if err != nil {
		return nil, err
	}
	attendee.Component = helpers.PointerTo("Center for Medicare (CM)")
	_, err = resolvers.UpdateTRBRequestAttendee(ctx, s.store, attendee)
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

func (s *seederConfig) addTRBFeedback(ctx context.Context, trb *models.TRBRequest, ops ...func(fb *models.TRBRequestFeedback)) (*models.TRBRequestFeedback, error) {
	feedback := &models.TRBRequestFeedback{
		TRBRequestID:    trb.ID,
		FeedbackMessage: "This is the most excellent TRB request ever created",
		CopyTRBMailbox:  false,
		NotifyEUAIDs:    []string{},
		Action:          models.TRBFeedbackActionReadyForConsult,
	}

	for _, op := range ops {
		op(feedback)
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

func (s *seederConfig) addGuidanceLetter(ctx context.Context, trb *models.TRBRequest, isDraft bool, shouldSend bool, isFollowUpRequested bool) (*models.TRBGuidanceLetter, error) {
	// declare a separate err outside the scope of the (if !isDraft) block, so there's no lint issues from errors inside the block shadowing this err
	_, outsideErr := resolvers.CreateTRBGuidanceLetter(ctx, s.store, trb.ID)
	if outsideErr != nil {
		return nil, outsideErr
	}

	guidanceLetterChanges := map[string]interface{}{
		"trbRequestId":          trb.ID,
		"meetingSummary":        "Talked about stuff",
		"isFollowupRecommended": isFollowUpRequested,
	}
	letter, outsideErr := resolvers.UpdateTRBGuidanceLetter(ctx, s.store, guidanceLetterChanges)
	if outsideErr != nil {
		return nil, outsideErr
	}

	if !isDraft {
		// declare a new err for use inside the (if !isDraft) block only
		_, err := resolvers.RequestReviewForTRBGuidanceLetter(ctx, s.store, nil, mock.FetchUserInfoMock, letter.ID)
		if err != nil {
			return nil, err
		}

		if shouldSend {
			_, err = resolvers.SendTRBGuidanceLetter(ctx, s.store, letter.ID, nil, mock.FetchUserInfoMock, mock.FetchUserInfosMock, false, nil)
			if err != nil {
				return nil, err
			}
		}

		// create three insights for testing manipulation of insights' positions
		_, err = s.addGuidanceLetterInsights(ctx, trb)
		if err != nil {
			return nil, err
		}
	}

	letter, outsideErr = resolvers.GetTRBGuidanceLetterByTRBRequestID(ctx, trb.ID)
	if outsideErr != nil {
		return nil, outsideErr
	}

	return letter, nil
}

// creates insights attached to a TRB request
func (s *seederConfig) addGuidanceLetterInsights(ctx context.Context, trb *models.TRBRequest) ([]*models.TRBGuidanceLetterInsight, error) {
	// create insights of consideration category
	consideration1ToCreate := &models.TRBGuidanceLetterInsight{
		TRBRequestID: trb.ID,
		Title:        "Try again",
		Insight:      "I'd consider all options at this point",
		Links:        pq.StringArray{"google.com", "askjeeves.com"},
		Category:     models.TRBGuidanceLetterInsightCategoryConsideration,
	}
	createdConsideration1, err := resolvers.CreateTRBGuidanceLetterInsight(ctx, s.store, consideration1ToCreate)
	if err != nil {
		return nil, err
	}

	consideration2ToCreate := &models.TRBGuidanceLetterInsight{
		TRBRequestID: trb.ID,
		Title:        "Turn it off and on",
		Insight:      "I'd consider a new computer",
		Links:        pq.StringArray{"google.com", "askjeeves.com"},
		Category:     models.TRBGuidanceLetterInsightCategoryConsideration,
	}
	createdConsideration2, err := resolvers.CreateTRBGuidanceLetterInsight(ctx, s.store, consideration2ToCreate)
	if err != nil {
		return nil, err
	}

	consideration3ToCreate := &models.TRBGuidanceLetterInsight{
		TRBRequestID: trb.ID,
		Title:        "Throw it out",
		Insight:      "Consider the garbage can as a solution",
		Links:        pq.StringArray{"google.com", "askjeeves.com"},
		Category:     models.TRBGuidanceLetterInsightCategoryConsideration,
	}
	createdConsideration3, err := resolvers.CreateTRBGuidanceLetterInsight(ctx, s.store, consideration3ToCreate)
	if err != nil {
		return nil, err
	}

	// create insights of recommendation category
	recommendation1ToCreate := &models.TRBGuidanceLetterInsight{
		TRBRequestID: trb.ID,
		Title:        "Restart your computer",
		Insight:      "I recommend you restart your computer",
		Links:        pq.StringArray{"google.com", "askjeeves.com"},
		Category:     models.TRBGuidanceLetterInsightCategoryRecommendation,
	}
	createdRecommendation1, err := resolvers.CreateTRBGuidanceLetterInsight(ctx, s.store, recommendation1ToCreate)
	if err != nil {
		return nil, err
	}

	recommendation2ToCreate := &models.TRBGuidanceLetterInsight{
		TRBRequestID: trb.ID,
		Title:        "Unplug it and plug it back in",
		Insight:      "I recommend you unplug your computer and plug it back in",
		Links:        pq.StringArray{"google.com", "askjeeves.com"},
		Category:     models.TRBGuidanceLetterInsightCategoryRecommendation,
	}
	createdRecommendation2, err := resolvers.CreateTRBGuidanceLetterInsight(ctx, s.store, recommendation2ToCreate)
	if err != nil {
		return nil, err
	}

	recommendation3ToCreate := &models.TRBGuidanceLetterInsight{
		TRBRequestID: trb.ID,
		Title:        "Get a new computer",
		Insight:      "Your computer is broken, you need a new one",
		Links:        pq.StringArray{"google.com", "askjeeves.com"},
		Category:     models.TRBGuidanceLetterInsightCategoryRecommendation,
	}
	createdRecommendation3, err := resolvers.CreateTRBGuidanceLetterInsight(ctx, s.store, recommendation3ToCreate)
	if err != nil {
		return nil, err
	}

	// create insights of requirement category
	requirement1ToCreate := &models.TRBGuidanceLetterInsight{
		TRBRequestID: trb.ID,
		Title:        "Buy a new one",
		Insight:      "You are required to buy a new computer",
		Links:        pq.StringArray{"google.com", "askjeeves.com"},
		Category:     models.TRBGuidanceLetterInsightCategoryRequirement,
	}
	createdRequirement1, err := resolvers.CreateTRBGuidanceLetterInsight(ctx, s.store, requirement1ToCreate)
	if err != nil {
		return nil, err
	}

	requirement2ToCreate := &models.TRBGuidanceLetterInsight{
		TRBRequestID: trb.ID,
		Title:        "Click more times",
		Insight:      "You are required to click more times for the computer to unfreeze",
		Links:        pq.StringArray{"google.com", "askjeeves.com"},
		Category:     models.TRBGuidanceLetterInsightCategoryRequirement,
	}
	createdRequirement2, err := resolvers.CreateTRBGuidanceLetterInsight(ctx, s.store, requirement2ToCreate)
	if err != nil {
		return nil, err
	}

	requirement3ToCreate := &models.TRBGuidanceLetterInsight{
		TRBRequestID: trb.ID,
		Title:        "Remove all files",
		Insight:      "You are required to delete everything",
		Links:        pq.StringArray{"google.com", "askjeeves.com"},
		Category:     models.TRBGuidanceLetterInsightCategoryRequirement,
	}
	createdRequirement3, err := resolvers.CreateTRBGuidanceLetterInsight(ctx, s.store, requirement3ToCreate)
	if err != nil {
		return nil, err
	}

	// Create some uncategorized
	uncategorized1ToCreate := &models.TRBGuidanceLetterInsight{
		TRBRequestID: trb.ID,
		Title:        "Come up with some categories",
		Insight:      "You'll really need to come up with some categories, or at least move this insight to a category!",
		Links:        pq.StringArray{"categories.com"},
		Category:     models.TRBGuidanceLetterInsightCategoryUncategorized,
	}
	createdUncategorized1, err := resolvers.CreateTRBGuidanceLetterInsight(ctx, s.store, uncategorized1ToCreate)
	if err != nil {
		return nil, err
	}

	uncategorized2ToCreate := &models.TRBGuidanceLetterInsight{
		TRBRequestID: trb.ID,
		Title:        "Organize your insights",
		Insight:      "Try moving these insights around to give them a category!",
		Links:        pq.StringArray{},
		Category:     models.TRBGuidanceLetterInsightCategoryUncategorized,
	}
	createdUncategorized2, err := resolvers.CreateTRBGuidanceLetterInsight(ctx, s.store, uncategorized2ToCreate)
	if err != nil {
		return nil, err
	}

	return []*models.TRBGuidanceLetterInsight{
		createdConsideration1,
		createdConsideration2,
		createdConsideration3,

		createdRecommendation1,
		createdRecommendation2,
		createdRecommendation3,

		createdRequirement1,
		createdRequirement2,
		createdRequirement3,

		createdUncategorized1,
		createdUncategorized2,
	}, nil
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

	fileStats, err := file.Stat()
	if err != nil {
		return nil, err
	}
	var buf bytes.Buffer
	_, err = buf.ReadFrom(file)
	if err != nil {
		return nil, err
	}
	encodedContents := easiencoding.EncodeBase64String(buf.String())
	fileToUpload := bytes.NewReader([]byte(encodedContents))

	otherDesc := "Some other type of doc"
	input := models.CreateTRBRequestDocumentInput{
		RequestID: trb.ID,
		FileData: graphql.Upload{
			File:        fileToUpload,
			Filename:    "sample.pdf",
			Size:        fileStats.Size(),
			ContentType: "application/pdf",
		},
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

func (s *seederConfig) addAttendee(
	ctx context.Context,
	trbRequestID uuid.UUID,
	euaID string,
	role models.PersonRole,
	component string,
) (*models.TRBRequestAttendee, error) {
	attendee := models.TRBRequestAttendee{
		TRBRequestID: trbRequestID,
		EUAUserID:    euaID,
		Role:         &role,
		Component:    &component,
	}
	attendee.CreatedBy = mock.PrincipalUser
	return resolvers.CreateTRBRequestAttendee(
		ctx,
		s.store,
		func(
			ctx context.Context,
			attendeeEmail models.EmailAddress,
			requestName string,
			requesterName string,
		) error {
			return nil
		},
		mock.FetchUserInfoMock,
		&attendee,
	)
}

func (s *seederConfig) addTRBNewSystemRelation(
	ctx context.Context,
	trbRequestID uuid.UUID,
	contractNumbers []string,
) (*models.TRBRequest, error) {
	return resolvers.SetTRBRequestRelationNewSystem(ctx, s.store, models.SetTRBRequestRelationNewSystemInput{
		TrbRequestID:    trbRequestID,
		ContractNumbers: contractNumbers,
	})
}

func (s *seederConfig) addTRBExistingServiceRelation(
	ctx context.Context,
	trbRequestID uuid.UUID,
	contractName string,
	contractNumbers []string,
) (*models.TRBRequest, error) {
	return resolvers.SetTRBRequestRelationExistingService(ctx, s.store, models.SetTRBRequestRelationExistingServiceInput{
		TrbRequestID:    trbRequestID,
		ContractName:    contractName,
		ContractNumbers: contractNumbers,
	})
}

func (s *seederConfig) addTRBExistingSystemRelation(
	ctx context.Context,
	trbRequestID uuid.UUID,
	contractNumbers []string,
	cedarSystemIDs []string,
) (*models.TRBRequest, error) {
	return resolvers.SetTRBRequestRelationExistingSystem(
		ctx,
		s.store,
		func(ctx context.Context, systemID string) (*models.CedarSystem, error) {
			return cedarcoremock.GetSystem(systemID), nil
		},
		models.SetTRBRequestRelationExistingSystemInput{
			TrbRequestID:    trbRequestID,
			ContractNumbers: contractNumbers,
			CedarSystemIDs:  cedarSystemIDs,
		},
	)
}
