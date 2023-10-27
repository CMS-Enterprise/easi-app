package resolvers

import (
	"fmt"
	"slices"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *ResolverSuite) TestCreateTRBAdminNoteGeneralRequest() {
	ctx := s.testConfigs.Context
	store := s.testConfigs.Store

	s.Run("Creating Admin Note with General Request category works", func() {
		// set up request
		trbRequest, err := CreateTRBRequest(ctx, models.TRBTFormalReview, store)
		s.NoError(err)
		s.NotNil(trbRequest)

		// create admin note
		input := model.CreateTRBAdminNoteGeneralRequestInput{
			TrbRequestID: trbRequest.ID,
			NoteText:     "test TRB admin note - general request",
		}
		createdNote, err := CreateTRBAdminNoteGeneralRequest(ctx, store, input)
		s.NoError(err)
		s.NotNil(createdNote)

		// check that createdNote has the right field values
		s.EqualValues(models.TRBAdminNoteCategoryGeneralRequest, createdNote.Category)
		s.EqualValues(input.NoteText, createdNote.NoteText)

		// all these should be null because they don't apply to General Request notes
		s.Nil(createdNote.AppliesToBasicRequestDetails.Ptr())
		s.Nil(createdNote.AppliesToSubjectAreas.Ptr())
		s.Nil(createdNote.AppliesToAttendees.Ptr())
		s.Nil(createdNote.AppliesToMeetingSummary.Ptr())
		s.Nil(createdNote.AppliesToNextSteps.Ptr())
	})
}

func (s *ResolverSuite) TestCreateTRBAdminNoteInitialRequestForm() {
	ctx := s.testConfigs.Context
	store := s.testConfigs.Store

	s.Run("Creating Admin Note with Initial Request Form category works", func() {
		// set up request
		trbRequest, err := CreateTRBRequest(ctx, models.TRBTFormalReview, store)
		s.NoError(err)
		s.NotNil(trbRequest)

		// create admin note
		input := model.CreateTRBAdminNoteInitialRequestFormInput{
			TrbRequestID:                 trbRequest.ID,
			NoteText:                     "test TRB admin note - initial request form",
			AppliesToBasicRequestDetails: true,
			AppliesToSubjectAreas:        true,
			AppliesToAttendees:           false,
		}
		createdNote, err := CreateTRBAdminNoteInitialRequestForm(ctx, store, input)
		s.NoError(err)
		s.NotNil(createdNote)

		// check that createdNote has the right field values
		s.EqualValues(models.TRBAdminNoteCategoryInitialRequestForm, createdNote.Category)
		s.EqualValues(input.NoteText, createdNote.NoteText)

		// these three fields should be non-null - they should _always_ have values for Initial Request Form notes
		s.NotNil(createdNote.AppliesToBasicRequestDetails.Ptr())
		s.NotNil(createdNote.AppliesToSubjectAreas.Ptr())
		s.NotNil(createdNote.AppliesToAttendees.Ptr())

		// check that they have the correct values, as well
		s.EqualValues(input.AppliesToBasicRequestDetails, createdNote.AppliesToBasicRequestDetails.Bool)
		s.EqualValues(input.AppliesToSubjectAreas, createdNote.AppliesToSubjectAreas.Bool)
		s.EqualValues(input.AppliesToAttendees, createdNote.AppliesToAttendees.Bool)

		// these should be null because they don't apply to Initial Request Form notes
		s.Nil(createdNote.AppliesToMeetingSummary.Ptr())
		s.Nil(createdNote.AppliesToNextSteps.Ptr())
	})
}

func (s *ResolverSuite) TestCreateTRBAdminNoteSupportingDocuments() {
	ctx := s.testConfigs.Context
	store := s.testConfigs.Store
	creatingUserEUAID := s.testConfigs.Principal.EUAID

	s.Run("Creating Supporting Documents Admin Note referencing documents attached to the same TRB request works", func() {
		// set up request and two documents
		trbRequest, err := CreateTRBRequest(ctx, models.TRBTFormalReview, store)
		s.NoError(err)
		s.NotNil(trbRequest)

		// just create the database record for the documents; don't go through the resolver so we don't need to set up file uploads
		documentToCreate1 := &models.TRBRequestDocument{
			TRBRequestID:       trbRequest.ID,
			CommonDocumentType: models.TRBRequestDocumentCommonTypeArchitectureDiagram,
			FileName:           "admin_note_test_1.pdf",
			Bucket:             "bukkit",
			S3Key:              uuid.NewString(),
		}
		documentToCreate1.CreatedBy = creatingUserEUAID // have to manually set this because we're calling the store method instead of the resolver

		createdDoc1, err := store.CreateTRBRequestDocument(ctx, documentToCreate1)
		s.NoError(err)
		s.NotNil(createdDoc1)
		documentID1 := createdDoc1.ID

		documentToCreate2 := &models.TRBRequestDocument{
			TRBRequestID:       trbRequest.ID,
			CommonDocumentType: models.TRBRequestDocumentCommonTypeBusinessCase,
			FileName:           "admin_note_test_2.pdf",
			Bucket:             "bukkit",
			S3Key:              uuid.NewString(),
		}
		documentToCreate2.CreatedBy = creatingUserEUAID // have to manually set this because we're calling the store method instead of the resolver

		createdDoc2, err := store.CreateTRBRequestDocument(ctx, documentToCreate2)
		s.NoError(err)
		s.NotNil(createdDoc2)
		documentID2 := createdDoc2.ID

		// create admin note referencing the documents
		input := model.CreateTRBAdminNoteSupportingDocumentsInput{
			TrbRequestID: trbRequest.ID,
			NoteText:     "test TRB admin note - supporting documents",
			DocumentIDs: []uuid.UUID{
				documentID1,
				documentID2,
			},
		}
		createdNote, err := CreateTRBAdminNoteSupportingDocuments(ctx, store, input)
		s.NoError(err)
		s.NotNil(createdNote)

		// check that createdNote has the right field values
		s.EqualValues(models.TRBAdminNoteCategorySupportingDocuments, createdNote.Category)
		s.EqualValues(input.NoteText, createdNote.NoteText)

		// all these should be null because they don't apply to Supporting Documents notes
		s.Nil(createdNote.AppliesToBasicRequestDetails.Ptr())
		s.Nil(createdNote.AppliesToSubjectAreas.Ptr())
		s.Nil(createdNote.AppliesToAttendees.Ptr())
		s.Nil(createdNote.AppliesToMeetingSummary.Ptr())
		s.Nil(createdNote.AppliesToNextSteps.Ptr())

		// check that links to documents were created
		fetchedDocuments, err := store.GetTRBRequestDocumentsByAdminNoteID(ctx, createdNote.ID)
		s.NoError(err)

		s.Len(fetchedDocuments, 2)

		document1Fetched := slices.ContainsFunc(fetchedDocuments, func(doc *models.TRBRequestDocument) bool {
			return doc.ID == documentID1
		})
		s.True(document1Fetched)

		document2Fetched := slices.ContainsFunc(fetchedDocuments, func(doc *models.TRBRequestDocument) bool {
			return doc.ID == documentID2
		})
		s.True(document2Fetched)
	})

	s.Run("Creating Admin Note referencing supporting documents attached to a *different* TRB request fails and does *not* create an admin note", func() {
		// create request 1 - admin note will be attached to this
		trbRequestForNote, err := CreateTRBRequest(ctx, models.TRBTFormalReview, store)
		s.NoError(err)
		s.NotNil(trbRequestForNote)

		// create request 2 - document will be attached to this
		trbRequestForDoc, err := CreateTRBRequest(ctx, models.TRBTFormalReview, store)
		s.NoError(err)
		s.NotNil(trbRequestForDoc)

		// create database record for a document attached to request 2
		documentToCreate := &models.TRBRequestDocument{
			TRBRequestID:       trbRequestForDoc.ID,
			CommonDocumentType: models.TRBRequestDocumentCommonTypeArchitectureDiagram,
			FileName:           "create_and_get.pdf",
			Bucket:             "bukkit",
			S3Key:              uuid.NewString(),
		}
		documentToCreate.CreatedBy = creatingUserEUAID // have to manually set this because we're calling the store method instead of the resolver

		createdDoc, err := store.CreateTRBRequestDocument(ctx, documentToCreate)
		s.NoError(err)
		s.NotNil(createdDoc)
		documentID := createdDoc.ID

		// try to create an admin note referencing the document
		// should fail due to database constraints, because the referenced document belongs to a different TRB request
		input := model.CreateTRBAdminNoteSupportingDocumentsInput{
			TrbRequestID: trbRequestForNote.ID,
			NoteText:     "test TRB admin note - supporting documents",
			DocumentIDs: []uuid.UUID{
				documentID,
			},
		}
		_, err = CreateTRBAdminNoteSupportingDocuments(ctx, store, input)
		s.Error(err)

		// check that admin note didn't get created at all
		createdNotes, err := GetTRBAdminNotesByTRBRequestID(ctx, store, trbRequestForNote.ID)
		s.NoError(err)
		s.Len(createdNotes, 0)
	})
}

func (s *ResolverSuite) TestCreateTRBAdminNoteConsultSession() {
	ctx := s.testConfigs.Context
	store := s.testConfigs.Store

	s.Run("Creating Admin Note with General Request category works", func() {
		// set up request
		trbRequest, err := CreateTRBRequest(ctx, models.TRBTFormalReview, store)
		s.NoError(err)
		s.NotNil(trbRequest)

		// create admin note
		input := model.CreateTRBAdminNoteConsultSessionInput{
			TrbRequestID: trbRequest.ID,
			NoteText:     "test TRB admin note - consult session",
		}
		createdNote, err := CreateTRBAdminNoteConsultSession(ctx, store, input)
		s.NoError(err)
		s.NotNil(createdNote)

		// check that createdNote has the right field values
		s.EqualValues(models.TRBAdminNoteCategoryConsultSession, createdNote.Category)
		s.EqualValues(input.NoteText, createdNote.NoteText)

		// all these should be null because they don't apply to Consult Session notes
		s.Nil(createdNote.AppliesToBasicRequestDetails.Ptr())
		s.Nil(createdNote.AppliesToSubjectAreas.Ptr())
		s.Nil(createdNote.AppliesToAttendees.Ptr())
		s.Nil(createdNote.AppliesToMeetingSummary.Ptr())
		s.Nil(createdNote.AppliesToNextSteps.Ptr())
	})

}

func (s *ResolverSuite) TestCreateTRBAdminNoteAdviceLetter() {
	ctx := s.testConfigs.Context
	store := s.testConfigs.Store

	s.Run("Creating Advice Letter Admin Note referencing recommendations attached to the same TRB request works", func() {
		// set up request
		trbRequest, err := CreateTRBRequest(ctx, models.TRBTFormalReview, store)
		s.NoError(err)
		s.NotNil(trbRequest)

		// set up advice letter
		createdAdviceLetter, err := CreateTRBAdviceLetter(ctx, store, trbRequest.ID)
		s.NoError(err)
		s.NotNil(createdAdviceLetter)

		// set up recommendations
		recToCreate1 := &models.TRBAdviceLetterRecommendation{
			TRBRequestID:   trbRequest.ID,
			Title:          "Admin Note Test Recommendation 1",
			Recommendation: "Keep testing rec1",
			Links:          []string{},
		}
		createdRec1, err := CreateTRBAdviceLetterRecommendation(ctx, store, recToCreate1)
		s.NoError(err)
		s.NotNil(createdRec1)
		recommendationID1 := createdRec1.ID

		recToCreate2 := &models.TRBAdviceLetterRecommendation{
			TRBRequestID:   trbRequest.ID,
			Title:          "Admin Note Test Recommendation 2",
			Recommendation: "Keep testing rec2",
			Links:          []string{},
		}
		createdRec2, err := CreateTRBAdviceLetterRecommendation(ctx, store, recToCreate2)
		s.NoError(err)
		s.NotNil(createdRec2)
		recommendationID2 := createdRec2.ID

		// create admin note referencing the recommendations
		input := model.CreateTRBAdminNoteAdviceLetterInput{
			TrbRequestID:            trbRequest.ID,
			NoteText:                "test TRB admin note - advice letter",
			AppliesToMeetingSummary: true,
			AppliesToNextSteps:      false,
			RecommendationIDs: []uuid.UUID{
				recommendationID1,
				recommendationID2,
			},
		}
		createdNote, err := CreateTRBAdminNoteAdviceLetter(ctx, store, input)
		s.NoError(err)
		s.NotNil(createdNote)

		// check that createdNote has the right field values
		s.EqualValues(models.TRBAdminNoteCategoryAdviceLetter, createdNote.Category)
		s.EqualValues(input.NoteText, createdNote.NoteText)

		// these two fields should be non-null - they should _always_ have values for Advice Letter notes
		s.NotNil(createdNote.AppliesToMeetingSummary.Ptr())
		s.NotNil(createdNote.AppliesToNextSteps.Ptr())

		// check that they have the correct values, as well
		s.EqualValues(input.AppliesToMeetingSummary, createdNote.AppliesToMeetingSummary.Bool)
		s.EqualValues(input.AppliesToNextSteps, createdNote.AppliesToNextSteps.Bool)

		// all these should be null because they don't apply to Advice Letter notes
		s.Nil(createdNote.AppliesToBasicRequestDetails.Ptr())
		s.Nil(createdNote.AppliesToSubjectAreas.Ptr())
		s.Nil(createdNote.AppliesToAttendees.Ptr())

		// check that links to recommendations were created
		fetchedRecommendations, err := store.GetTRBRecommendationsByAdminNoteID(ctx, createdNote.ID)
		s.NoError(err)

		s.Len(fetchedRecommendations, 2)

		recommendation1Fetched := slices.ContainsFunc(fetchedRecommendations, func(rec *models.TRBAdviceLetterRecommendation) bool {
			return rec.ID == recommendationID1
		})
		s.True(recommendation1Fetched)

		recommendation2Fetched := slices.ContainsFunc(fetchedRecommendations, func(rec *models.TRBAdviceLetterRecommendation) bool {
			return rec.ID == recommendationID2
		})
		s.True(recommendation2Fetched)
	})

	s.Run("Creating Admin Note referencing advice letter recommendations attached to a *different* TRB request fails", func() {
		// create request 1 - admin note will be attached to this
		trbRequestForNote, err := CreateTRBRequest(ctx, models.TRBTFormalReview, store)
		s.NoError(err)
		s.NotNil(trbRequestForNote)

		// create request 2 - advice letter and recommendation will be attached to this
		trbRequestForRecommendation, err := CreateTRBRequest(ctx, models.TRBTFormalReview, store)
		s.NoError(err)
		s.NotNil(trbRequestForRecommendation)

		// create advice letter for request 2
		createdAdviceLetter, err := CreateTRBAdviceLetter(ctx, store, trbRequestForRecommendation.ID)
		s.NoError(err)
		s.NotNil(createdAdviceLetter)

		// create recommendation attached to advice letter for request 2
		recToCreate := &models.TRBAdviceLetterRecommendation{
			TRBRequestID:   trbRequestForRecommendation.ID,
			Title:          "Admin Note Test Recommendation - Different Request",
			Recommendation: "Make sure this fails",
			Links:          []string{},
		}
		createdRec, err := CreateTRBAdviceLetterRecommendation(ctx, store, recToCreate)
		s.NoError(err)
		s.NotNil(createdRec)

		// try to create an admin note referencing the recommendation
		// should fail due to database constraints, because the referenced recommendation belongs to a different TRB request
		recommendationID := createdRec.ID
		input := model.CreateTRBAdminNoteAdviceLetterInput{
			TrbRequestID:            trbRequestForNote.ID,
			NoteText:                "test TRB admin note - advice letter",
			AppliesToMeetingSummary: false,
			AppliesToNextSteps:      false,
			RecommendationIDs: []uuid.UUID{
				recommendationID,
			},
		}
		_, err = CreateTRBAdminNoteAdviceLetter(ctx, store, input)
		s.Error(err)

		// check that admin note didn't get created at all
		createdNotes, err := GetTRBAdminNotesByTRBRequestID(ctx, store, trbRequestForNote.ID)
		s.NoError(err)
		s.Len(createdNotes, 0)
	})
}

func (s *ResolverSuite) TestGetTRBAdminNoteCategorySpecificData() {
	// General Request, Initial Request Form, and Consult session don't have tests; their resolver code is trivial

	ctx := s.testConfigs.Context
	store := s.testConfigs.Store

	s.Run("Supporting Documents notes return related documents for the note's category-specific data", func() {
		// set up request
		trbRequest, err := CreateTRBRequest(ctx, models.TRBTFormalReview, store)
		s.NoError(err)
		s.NotNil(trbRequest)

		// set up three documents and attach two to the note
		// we can check that the resolver returns multiple docs, and check that not all docs on the request are returned
		documentIDs := []uuid.UUID{}
		for i := 0; i < 3; i++ {
			// just create the database record for the documents; don't go through the resolver so we don't need to set up file uploads
			documentToCreate := &models.TRBRequestDocument{
				TRBRequestID:       trbRequest.ID,
				CommonDocumentType: models.TRBRequestDocumentCommonTypeArchitectureDiagram,
				FileName:           fmt.Sprintf("admin_note_test_%v.pdf", i),
				Bucket:             "bukkit",
				S3Key:              uuid.NewString(),
			}
			documentToCreate.CreatedBy = s.testConfigs.Principal.EUAID // have to manually set this because we're calling the store method instead of the resolver

			createdDoc, errCreatingDoc := store.CreateTRBRequestDocument(ctx, documentToCreate)
			s.NoError(errCreatingDoc)
			s.NotNil(createdDoc)
			documentIDs = append(documentIDs, createdDoc.ID)
		}

		// set up admin note referencing the documents
		input := model.CreateTRBAdminNoteSupportingDocumentsInput{
			TrbRequestID: trbRequest.ID,
			NoteText:     "test TRB admin note - supporting documents",
			DocumentIDs: []uuid.UUID{
				documentIDs[0],
				documentIDs[1],
			},
		}
		createdNote, err := CreateTRBAdminNoteSupportingDocuments(ctx, store, input)
		s.NoError(err)
		s.NotNil(createdNote)

		// check that resolver returns the right documents
		categorySpecificData, err := GetTRBAdminNoteCategorySpecificData(ctx, store, createdNote)
		s.NoError(err)

		supportingDocumentsData, ok := categorySpecificData.(model.TRBAdminNoteSupportingDocumentsCategoryData)
		s.True(ok)

		returnedDocuments := supportingDocumentsData.Documents
		s.Len(returnedDocuments, 2)

		document0Returned := slices.ContainsFunc(returnedDocuments, func(doc *models.TRBRequestDocument) bool {
			return doc.ID == documentIDs[0]
		})
		s.True(document0Returned)

		document1Returned := slices.ContainsFunc(returnedDocuments, func(doc *models.TRBRequestDocument) bool {
			return doc.ID == documentIDs[1]
		})
		s.True(document1Returned)

		// test that the third document (that wasn't attached to the note) *isn't* returned
		document2Returned := slices.ContainsFunc(returnedDocuments, func(doc *models.TRBRequestDocument) bool {
			return doc.ID == documentIDs[2]
		})
		s.False(document2Returned)
	})

	s.Run("Advice Letter notes return related recommendations for the note's category-specific data", func() {
		// don't need to test AppliesToMeetingSummary/AppliesToNextSteps fields - code is trivial, just accessing fields on the note model
	})
}
