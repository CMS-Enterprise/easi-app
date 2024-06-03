package resolvers

import (
	"fmt"
	"slices"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (suite *ResolverSuite) TestCreateTRBAdminNoteGeneralRequest() {
	ctx := suite.testConfigs.Context
	store := suite.testConfigs.Store

	suite.Run("Creating Admin Note with General Request category works", func() {
		// set up request
		trbRequest, err := CreateTRBRequest(ctx, models.TRBTFormalReview, store)
		suite.NoError(err)
		suite.NotNil(trbRequest)

		// create admin note
		input := models.CreateTRBAdminNoteGeneralRequestInput{
			TrbRequestID: trbRequest.ID,
			NoteText:     "test TRB admin note - general request",
		}
		createdNote, err := CreateTRBAdminNoteGeneralRequest(ctx, store, input)
		suite.NoError(err)
		suite.NotNil(createdNote)

		// check that createdNote has the right field values
		suite.EqualValues(models.TRBAdminNoteCategoryGeneralRequest, createdNote.Category)
		suite.EqualValues(input.NoteText, createdNote.NoteText)

		// all these should be null because they don't apply to General Request notes
		suite.Nil(createdNote.AppliesToBasicRequestDetails.Ptr())
		suite.Nil(createdNote.AppliesToSubjectAreas.Ptr())
		suite.Nil(createdNote.AppliesToAttendees.Ptr())
		suite.Nil(createdNote.AppliesToMeetingSummary.Ptr())
		suite.Nil(createdNote.AppliesToNextSteps.Ptr())
	})
}

func (suite *ResolverSuite) TestCreateTRBAdminNoteInitialRequestForm() {
	ctx := suite.testConfigs.Context
	store := suite.testConfigs.Store

	suite.Run("Creating Admin Note with Initial Request Form category works", func() {
		// set up request
		trbRequest, err := CreateTRBRequest(ctx, models.TRBTFormalReview, store)
		suite.NoError(err)
		suite.NotNil(trbRequest)

		// create admin note
		input := models.CreateTRBAdminNoteInitialRequestFormInput{
			TrbRequestID:                 trbRequest.ID,
			NoteText:                     "test TRB admin note - initial request form",
			AppliesToBasicRequestDetails: true,
			AppliesToSubjectAreas:        true,
			AppliesToAttendees:           false,
		}
		createdNote, err := CreateTRBAdminNoteInitialRequestForm(ctx, store, input)
		suite.NoError(err)
		suite.NotNil(createdNote)

		// check that createdNote has the right field values
		suite.EqualValues(models.TRBAdminNoteCategoryInitialRequestForm, createdNote.Category)
		suite.EqualValues(input.NoteText, createdNote.NoteText)

		// these three fields should be non-null - they should _always_ have values for Initial Request Form notes
		suite.NotNil(createdNote.AppliesToBasicRequestDetails.Ptr())
		suite.NotNil(createdNote.AppliesToSubjectAreas.Ptr())
		suite.NotNil(createdNote.AppliesToAttendees.Ptr())

		// check that they have the correct values, as well
		suite.EqualValues(input.AppliesToBasicRequestDetails, createdNote.AppliesToBasicRequestDetails.Bool)
		suite.EqualValues(input.AppliesToSubjectAreas, createdNote.AppliesToSubjectAreas.Bool)
		suite.EqualValues(input.AppliesToAttendees, createdNote.AppliesToAttendees.Bool)

		// these should be null because they don't apply to Initial Request Form notes
		suite.Nil(createdNote.AppliesToMeetingSummary.Ptr())
		suite.Nil(createdNote.AppliesToNextSteps.Ptr())
	})
}

func (suite *ResolverSuite) TestCreateTRBAdminNoteSupportingDocuments() {
	ctx := suite.testConfigs.Context
	store := suite.testConfigs.Store
	creatingUserEUAID := suite.testConfigs.Principal.EUAID

	suite.Run("Creating Supporting Documents Admin Note referencing documents attached to the same TRB request works", func() {
		// set up request and two documents
		trbRequest, err := CreateTRBRequest(ctx, models.TRBTFormalReview, store)
		suite.NoError(err)
		suite.NotNil(trbRequest)

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
		suite.NoError(err)
		suite.NotNil(createdDoc1)
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
		suite.NoError(err)
		suite.NotNil(createdDoc2)
		documentID2 := createdDoc2.ID

		// create admin note referencing the documents
		input := models.CreateTRBAdminNoteSupportingDocumentsInput{
			TrbRequestID: trbRequest.ID,
			NoteText:     "test TRB admin note - supporting documents",
			DocumentIDs: []uuid.UUID{
				documentID1,
				documentID2,
			},
		}
		createdNote, err := CreateTRBAdminNoteSupportingDocuments(ctx, store, input)
		suite.NoError(err)
		suite.NotNil(createdNote)

		// check that createdNote has the right field values
		suite.EqualValues(models.TRBAdminNoteCategorySupportingDocuments, createdNote.Category)
		suite.EqualValues(input.NoteText, createdNote.NoteText)

		// all these should be null because they don't apply to Supporting Documents notes
		suite.Nil(createdNote.AppliesToBasicRequestDetails.Ptr())
		suite.Nil(createdNote.AppliesToSubjectAreas.Ptr())
		suite.Nil(createdNote.AppliesToAttendees.Ptr())
		suite.Nil(createdNote.AppliesToMeetingSummary.Ptr())
		suite.Nil(createdNote.AppliesToNextSteps.Ptr())

		// check that links to documents were created
		fetchedDocuments, err := store.GetTRBRequestDocumentsByAdminNoteID(ctx, createdNote.ID)
		suite.NoError(err)

		suite.Len(fetchedDocuments, 2)

		document1Fetched := slices.ContainsFunc(fetchedDocuments, func(doc *models.TRBRequestDocument) bool {
			return doc.ID == documentID1
		})
		suite.True(document1Fetched)

		document2Fetched := slices.ContainsFunc(fetchedDocuments, func(doc *models.TRBRequestDocument) bool {
			return doc.ID == documentID2
		})
		suite.True(document2Fetched)
	})

	suite.Run("Creating Admin Note referencing supporting documents attached to a *different* TRB request fails and does *not* create an admin note", func() {
		// create request 1 - admin note will be attached to this
		trbRequestForNote, err := CreateTRBRequest(ctx, models.TRBTFormalReview, store)
		suite.NoError(err)
		suite.NotNil(trbRequestForNote)

		// create request 2 - document will be attached to this
		trbRequestForDoc, err := CreateTRBRequest(ctx, models.TRBTFormalReview, store)
		suite.NoError(err)
		suite.NotNil(trbRequestForDoc)

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
		suite.NoError(err)
		suite.NotNil(createdDoc)
		documentID := createdDoc.ID

		// try to create an admin note referencing the document
		// should fail due to database constraints, because the referenced document belongs to a different TRB request
		input := models.CreateTRBAdminNoteSupportingDocumentsInput{
			TrbRequestID: trbRequestForNote.ID,
			NoteText:     "test TRB admin note - supporting documents",
			DocumentIDs: []uuid.UUID{
				documentID,
			},
		}
		_, err = CreateTRBAdminNoteSupportingDocuments(ctx, store, input)
		suite.Error(err)

		// check that admin note didn't get created at all
		createdNotes, err := GetTRBAdminNotesByTRBRequestID(ctx, store, trbRequestForNote.ID)
		suite.NoError(err)
		suite.Len(createdNotes, 0)
	})
}

func (suite *ResolverSuite) TestCreateTRBAdminNoteConsultSession() {
	ctx := suite.testConfigs.Context
	store := suite.testConfigs.Store

	suite.Run("Creating Admin Note with General Request category works", func() {
		// set up request
		trbRequest, err := CreateTRBRequest(ctx, models.TRBTFormalReview, store)
		suite.NoError(err)
		suite.NotNil(trbRequest)

		// create admin note
		input := models.CreateTRBAdminNoteConsultSessionInput{
			TrbRequestID: trbRequest.ID,
			NoteText:     "test TRB admin note - consult session",
		}
		createdNote, err := CreateTRBAdminNoteConsultSession(ctx, store, input)
		suite.NoError(err)
		suite.NotNil(createdNote)

		// check that createdNote has the right field values
		suite.EqualValues(models.TRBAdminNoteCategoryConsultSession, createdNote.Category)
		suite.EqualValues(input.NoteText, createdNote.NoteText)

		// all these should be null because they don't apply to Consult Session notes
		suite.Nil(createdNote.AppliesToBasicRequestDetails.Ptr())
		suite.Nil(createdNote.AppliesToSubjectAreas.Ptr())
		suite.Nil(createdNote.AppliesToAttendees.Ptr())
		suite.Nil(createdNote.AppliesToMeetingSummary.Ptr())
		suite.Nil(createdNote.AppliesToNextSteps.Ptr())
	})

}

func (suite *ResolverSuite) TestCreateTRBAdminNoteAdviceLetter() {
	ctx := suite.testConfigs.Context
	store := suite.testConfigs.Store

	suite.Run("Creating Advice Letter Admin Note referencing recommendations attached to the same TRB request works", func() {
		// set up request
		trbRequest, err := CreateTRBRequest(ctx, models.TRBTFormalReview, store)
		suite.NoError(err)
		suite.NotNil(trbRequest)

		// set up advice letter
		createdAdviceLetter, err := CreateTRBAdviceLetter(ctx, store, trbRequest.ID)
		suite.NoError(err)
		suite.NotNil(createdAdviceLetter)

		// set up recommendations
		recToCreate1 := &models.TRBAdviceLetterRecommendation{
			TRBRequestID:   trbRequest.ID,
			Title:          "Admin Note Test Recommendation 1",
			Recommendation: "Keep testing rec1",
			Links:          []string{},
		}
		createdRec1, err := CreateTRBAdviceLetterRecommendation(ctx, store, recToCreate1)
		suite.NoError(err)
		suite.NotNil(createdRec1)
		recommendationID1 := createdRec1.ID

		recToCreate2 := &models.TRBAdviceLetterRecommendation{
			TRBRequestID:   trbRequest.ID,
			Title:          "Admin Note Test Recommendation 2",
			Recommendation: "Keep testing rec2",
			Links:          []string{},
		}
		createdRec2, err := CreateTRBAdviceLetterRecommendation(ctx, store, recToCreate2)
		suite.NoError(err)
		suite.NotNil(createdRec2)
		recommendationID2 := createdRec2.ID

		// create admin note referencing the recommendations
		input := models.CreateTRBAdminNoteAdviceLetterInput{
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
		suite.NoError(err)
		suite.NotNil(createdNote)

		// check that createdNote has the right field values
		suite.EqualValues(models.TRBAdminNoteCategoryAdviceLetter, createdNote.Category)
		suite.EqualValues(input.NoteText, createdNote.NoteText)

		// these two fields should be non-null - they should _always_ have values for Advice Letter notes
		suite.NotNil(createdNote.AppliesToMeetingSummary.Ptr())
		suite.NotNil(createdNote.AppliesToNextSteps.Ptr())

		// check that they have the correct values, as well
		suite.EqualValues(input.AppliesToMeetingSummary, createdNote.AppliesToMeetingSummary.Bool)
		suite.EqualValues(input.AppliesToNextSteps, createdNote.AppliesToNextSteps.Bool)

		// all these should be null because they don't apply to Advice Letter notes
		suite.Nil(createdNote.AppliesToBasicRequestDetails.Ptr())
		suite.Nil(createdNote.AppliesToSubjectAreas.Ptr())
		suite.Nil(createdNote.AppliesToAttendees.Ptr())

		// check that links to recommendations were created
		fetchedRecommendations, err := store.GetTRBRecommendationsByAdminNoteID(ctx, createdNote.ID)
		suite.NoError(err)

		suite.Len(fetchedRecommendations, 2)

		recommendation1Fetched := slices.ContainsFunc(fetchedRecommendations, func(rec *models.TRBAdviceLetterRecommendation) bool {
			return rec.ID == recommendationID1
		})
		suite.True(recommendation1Fetched)

		recommendation2Fetched := slices.ContainsFunc(fetchedRecommendations, func(rec *models.TRBAdviceLetterRecommendation) bool {
			return rec.ID == recommendationID2
		})
		suite.True(recommendation2Fetched)
	})

	suite.Run("Creating Admin Note referencing advice letter recommendations attached to a *different* TRB request fails", func() {
		// create request 1 - admin note will be attached to this
		trbRequestForNote, err := CreateTRBRequest(ctx, models.TRBTFormalReview, store)
		suite.NoError(err)
		suite.NotNil(trbRequestForNote)

		// create request 2 - advice letter and recommendation will be attached to this
		trbRequestForRecommendation, err := CreateTRBRequest(ctx, models.TRBTFormalReview, store)
		suite.NoError(err)
		suite.NotNil(trbRequestForRecommendation)

		// create advice letter for request 2
		createdAdviceLetter, err := CreateTRBAdviceLetter(ctx, store, trbRequestForRecommendation.ID)
		suite.NoError(err)
		suite.NotNil(createdAdviceLetter)

		// create recommendation attached to advice letter for request 2
		recToCreate := &models.TRBAdviceLetterRecommendation{
			TRBRequestID:   trbRequestForRecommendation.ID,
			Title:          "Admin Note Test Recommendation - Different Request",
			Recommendation: "Make sure this fails",
			Links:          []string{},
		}
		createdRec, err := CreateTRBAdviceLetterRecommendation(ctx, store, recToCreate)
		suite.NoError(err)
		suite.NotNil(createdRec)

		// try to create an admin note referencing the recommendation
		// should fail due to database constraints, because the referenced recommendation belongs to a different TRB request
		recommendationID := createdRec.ID
		input := models.CreateTRBAdminNoteAdviceLetterInput{
			TrbRequestID:            trbRequestForNote.ID,
			NoteText:                "test TRB admin note - advice letter",
			AppliesToMeetingSummary: false,
			AppliesToNextSteps:      false,
			RecommendationIDs: []uuid.UUID{
				recommendationID,
			},
		}
		_, err = CreateTRBAdminNoteAdviceLetter(ctx, store, input)
		suite.Error(err)

		// check that admin note didn't get created at all
		createdNotes, err := GetTRBAdminNotesByTRBRequestID(ctx, store, trbRequestForNote.ID)
		suite.NoError(err)
		suite.Len(createdNotes, 0)
	})
}

func (suite *ResolverSuite) TestGetTRBAdminNoteCategorySpecificData() {
	// General Request, Initial Request Form, and Consult session don't have tests; their resolver code is trivial

	ctx := suite.testConfigs.Context
	store := suite.testConfigs.Store

	suite.Run("Supporting Documents notes return related documents for the note's category-specific data", func() {
		// set up request
		trbRequest, err := CreateTRBRequest(ctx, models.TRBTFormalReview, store)
		suite.NoError(err)
		suite.NotNil(trbRequest)

		// set up three documents and attach two to the note
		// we can test that the resolver returns multiple docs
		// and test that not all docs on the request are returned
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
			documentToCreate.CreatedBy = suite.testConfigs.Principal.EUAID // have to manually set this because we're calling the store method instead of the resolver

			createdDoc, errCreatingDoc := store.CreateTRBRequestDocument(ctx, documentToCreate)
			suite.NoError(errCreatingDoc)
			suite.NotNil(createdDoc)
			documentIDs = append(documentIDs, createdDoc.ID)
		}

		// set up admin note referencing two of the documents
		input := models.CreateTRBAdminNoteSupportingDocumentsInput{
			TrbRequestID: trbRequest.ID,
			NoteText:     "test TRB admin note - supporting documents",
			DocumentIDs: []uuid.UUID{
				documentIDs[0],
				documentIDs[1],
			},
		}
		createdNote, err := CreateTRBAdminNoteSupportingDocuments(ctx, store, input)
		suite.NoError(err)
		suite.NotNil(createdNote)

		// call the resolver we're testing
		categorySpecificData, err := GetTRBAdminNoteCategorySpecificData(ctx, store, createdNote)
		suite.NoError(err)
		suite.NotNil(categorySpecificData)
		supportingDocumentsData, ok := categorySpecificData.(models.TRBAdminNoteSupportingDocumentsCategoryData)
		suite.True(ok) // test that categorySpecificData is of the right type

		// test that resolver returns the right documents
		returnedDocuments := supportingDocumentsData.Documents
		suite.Len(returnedDocuments, 2)

		document0Returned := slices.ContainsFunc(returnedDocuments, func(doc *models.TRBRequestDocument) bool {
			return doc.ID == documentIDs[0]
		})
		suite.True(document0Returned)

		document1Returned := slices.ContainsFunc(returnedDocuments, func(doc *models.TRBRequestDocument) bool {
			return doc.ID == documentIDs[1]
		})
		suite.True(document1Returned)

		// test that the third document (that wasn't attached to the note) *isn't* returned
		document2Returned := slices.ContainsFunc(returnedDocuments, func(doc *models.TRBRequestDocument) bool {
			return doc.ID == documentIDs[2]
		})
		suite.False(document2Returned)
	})

	suite.Run("Advice Letter notes return related recommendations for the note's category-specific data", func() {
		// don't need to test AppliesToMeetingSummary/AppliesToNextSteps fields - code is trivial, just accessing fields on the note model

		// set up request
		trbRequest, err := CreateTRBRequest(ctx, models.TRBTFormalReview, store)
		suite.NoError(err)
		suite.NotNil(trbRequest)

		// set up advice letter
		createdAdviceLetter, err := CreateTRBAdviceLetter(ctx, store, trbRequest.ID)
		suite.NoError(err)
		suite.NotNil(createdAdviceLetter)

		// set up three recommendations and attach two to the note
		// we can test that the resolver returns multiple recommendations
		// and test that not all recommendations on the request are returned
		recommendationIDs := []uuid.UUID{}
		for i := 0; i < 3; i++ {
			recToCreate := &models.TRBAdviceLetterRecommendation{
				TRBRequestID:   trbRequest.ID,
				Title:          fmt.Sprintf("Admin Note Test Recommendation %v", i),
				Recommendation: "Testing category-specific data query resolver",
				Links:          []string{},
			}
			createdRec, errCreatingRec := CreateTRBAdviceLetterRecommendation(ctx, store, recToCreate)
			suite.NoError(errCreatingRec)
			suite.NotNil(createdRec)
			recommendationIDs = append(recommendationIDs, createdRec.ID)
		}

		// set up admin note referencing two of the recommendations
		input := models.CreateTRBAdminNoteAdviceLetterInput{
			TrbRequestID: trbRequest.ID,
			NoteText:     "test TRB admin note - advice letter",
			RecommendationIDs: []uuid.UUID{
				recommendationIDs[0],
				recommendationIDs[1],
			},

			// values don't matter, we're not testing then
			AppliesToMeetingSummary: false,
			AppliesToNextSteps:      false,
		}
		createdNote, err := CreateTRBAdminNoteAdviceLetter(ctx, store, input)
		suite.NoError(err)
		suite.NotNil(createdNote)

		// call the resolver we're testing
		categorySpecificData, err := GetTRBAdminNoteCategorySpecificData(ctx, store, createdNote)
		suite.NoError(err)
		suite.NotNil(categorySpecificData)
		adviceLetterData, ok := categorySpecificData.(models.TRBAdminNoteAdviceLetterCategoryData)
		suite.True(ok) // test that categorySpecificData is of the right type

		// test that resolver returns the right recommendations
		returnedRecommendations := adviceLetterData.Recommendations
		suite.Len(returnedRecommendations, 2)

		recommendation0Returned := slices.ContainsFunc(returnedRecommendations, func(rec *models.TRBAdviceLetterRecommendation) bool {
			return rec.ID == recommendationIDs[0]
		})
		suite.True(recommendation0Returned)

		recommendation1Returned := slices.ContainsFunc(returnedRecommendations, func(rec *models.TRBAdviceLetterRecommendation) bool {
			return rec.ID == recommendationIDs[1]
		})
		suite.True(recommendation1Returned)

		// test that the third recommendation (that wasn't attached to the note) *isn't* returned
		recommendation2Returned := slices.ContainsFunc(returnedRecommendations, func(rec *models.TRBAdviceLetterRecommendation) bool {
			return rec.ID == recommendationIDs[2]
		})
		suite.False(recommendation2Returned)
	})
}
