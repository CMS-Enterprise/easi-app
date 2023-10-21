package resolvers

import (
	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
)

// TODO - combine tests into one test suite, with each category grouped under an s.Run()?
// TODO - abstract out repeated setup code (like creating a TRB request? though that's pretty short)

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
		documentToCreate1.CreatedBy = creatingUserEUAID // have to manually set this because we're calling store method instead of resolver

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
		documentToCreate2.CreatedBy = creatingUserEUAID // have to manually set this because we're calling store method instead of resolver

		createdDoc2, err := store.CreateTRBRequestDocument(ctx, documentToCreate2)
		s.NoError(err)
		s.NotNil(createdDoc2)
		documentID2 := createdDoc2.ID

		// create admin note referencing the document
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

		// TODO - check that links to documents were created
	})

	s.Run("Creating Admin Note referencing supporting documents attached to a *different* TRB request fails", func() {
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
		documentToCreate.CreatedBy = creatingUserEUAID // have to manually set this because we're calling store method instead of resolver

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

		// TODO - set up advice letter and recommendation

		// create admin note referencing the recommendation
		input := model.CreateTRBAdminNoteAdviceLetterInput{
			TrbRequestID:            trbRequest.ID,
			NoteText:                "test TRB admin note - advice letter",
			AppliesToMeetingSummary: true,
			AppliesToNextSteps:      false,

			// TODO - add recommendation ID
			RecommendationIDs: []uuid.UUID{},
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

		// TODO - check that links to recommendations were created
	})
}
