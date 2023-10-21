package resolvers

import (
	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *ResolverSuite) TestCreateTRBAdminNoteSupportingDocuments() {
	ctx := s.testConfigs.Context
	store := s.testConfigs.Store
	creatingUserEUAID := s.testConfigs.Principal.EUAID

	s.Run("Creating Admin Note referencing supporting documents attached to the same TRB request works", func() {
		// set up request and a document
		trbRequest, err := CreateTRBRequest(ctx, models.TRBTFormalReview, store)
		s.NoError(err)
		s.NotNil(trbRequest)
		trbRequestID := trbRequest.ID

		// just create the database record for the document; don't go through the resolver so we don't need to set up a file upload
		documentToCreate := &models.TRBRequestDocument{
			TRBRequestID:       trbRequestID,
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
		input := model.CreateTRBAdminNoteSupportingDocumentsInput{
			TrbRequestID: trbRequestID,
			NoteText:     "test TRB admin note",
			DocumentIDs: []uuid.UUID{
				documentID,
			},
		}

		createdNote, err := CreateTRBAdminNoteSupportingDocuments(ctx, store, input)
		s.NoError(err)
		s.NotNil(createdNote)

		// check that createdNote has the right field values
		s.EqualValues(models.TRBAdminNoteCategorySupportingDocuments, createdNote.Category)
		s.EqualValues(input.NoteText, createdNote.NoteText)

		// all these should be null because they don't apply to notes in the Supporting Documents category
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
		input := model.CreateTRBAdminNoteSupportingDocumentsInput{
			TrbRequestID: trbRequestForNote.ID,
			NoteText:     "test TRB admin note",
			DocumentIDs: []uuid.UUID{
				documentID,
			},
		}

		// should fail due to database constraints, because the referenced document belongs to a different TRB request
		_, err = CreateTRBAdminNoteSupportingDocuments(ctx, store, input)
		s.Error(err)
	})
}
