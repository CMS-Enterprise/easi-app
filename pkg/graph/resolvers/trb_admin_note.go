package resolvers

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

func CreateTRBAdminNoteGeneralRequest(ctx context.Context, store *storage.Store, input models.CreateTRBAdminNoteGeneralRequestInput) (*models.TRBAdminNote, error) {
	noteToCreate := models.TRBAdminNote{
		TRBRequestID: input.TrbRequestID,
		Category:     models.TRBAdminNoteCategoryGeneralRequest,
		NoteText:     input.NoteText,
	}
	noteToCreate.CreatedBy = appcontext.Principal(ctx).ID()

	createdNote, err := store.CreateTRBAdminNote(ctx, &noteToCreate)
	if err != nil {
		return nil, err
	}

	return createdNote, nil
}

func CreateTRBAdminNoteInitialRequestForm(ctx context.Context, store *storage.Store, input models.CreateTRBAdminNoteInitialRequestFormInput) (*models.TRBAdminNote, error) {
	noteToCreate := models.TRBAdminNote{
		TRBRequestID: input.TrbRequestID,
		Category:     models.TRBAdminNoteCategoryInitialRequestForm,
		NoteText:     input.NoteText,

		AppliesToBasicRequestDetails: null.BoolFrom(input.AppliesToBasicRequestDetails),
		AppliesToSubjectAreas:        null.BoolFrom(input.AppliesToSubjectAreas),
		AppliesToAttendees:           null.BoolFrom(input.AppliesToAttendees),
	}
	noteToCreate.CreatedBy = appcontext.Principal(ctx).ID()

	createdNote, err := store.CreateTRBAdminNote(ctx, &noteToCreate)
	if err != nil {
		return nil, err
	}

	return createdNote, nil
}

func CreateTRBAdminNoteSupportingDocuments(ctx context.Context, store *storage.Store, input models.CreateTRBAdminNoteSupportingDocumentsInput) (*models.TRBAdminNote, error) {
	// it's valid for input.DocumentIDs to be empty; see note in acceptance criteria in https://jiraent.cms.gov/browse/EASI-3362

	// check that the documents belong to the same TRB request
	// database constraints will prevent links being created to docs on a different request
	// but if we don't check, we'll still create an (invalid) admin note record

	allDocsOnRequest, err := store.GetTRBRequestDocumentsByRequestID(ctx, input.TrbRequestID)
	if err != nil {
		return nil, err
	}

	if !models.ContainsAllIDs(allDocsOnRequest, input.DocumentIDs) {
		return nil, &apperrors.BadRequestError{
			Err: errors.New("all documents referenced in admin note must belong to the same TRB request as the admin note"),
		}
	}

	noteToCreate := models.TRBAdminNote{
		TRBRequestID: input.TrbRequestID,
		Category:     models.TRBAdminNoteCategorySupportingDocuments,
		NoteText:     input.NoteText,
	}
	noteToCreate.CreatedBy = appcontext.Principal(ctx).ID()

	// ideally, we'd create the admin note and any links to documents in a single transaction, but we don't currently have that capability
	// see Note [Database calls from resolvers aren't atomic]

	// create the admin note itself (and get the result, with the generated ID)
	createdNote, err := store.CreateTRBAdminNote(ctx, &noteToCreate)
	if err != nil {
		return nil, err
	}

	// create links to documents referenced by the admin note (if any are present)
	if len(input.DocumentIDs) > 0 {
		_, err = store.CreateTRBAdminNoteTRBDocumentLinks(ctx, input.TrbRequestID, createdNote.ID, input.DocumentIDs)
		if err != nil {
			return nil, err
		}
	}

	return createdNote, nil
}

func CreateTRBAdminNoteConsultSession(ctx context.Context, store *storage.Store, input models.CreateTRBAdminNoteConsultSessionInput) (*models.TRBAdminNote, error) {
	noteToCreate := models.TRBAdminNote{
		TRBRequestID: input.TrbRequestID,
		Category:     models.TRBAdminNoteCategoryConsultSession,
		NoteText:     input.NoteText,
	}
	noteToCreate.CreatedBy = appcontext.Principal(ctx).ID()

	createdNote, err := store.CreateTRBAdminNote(ctx, &noteToCreate)
	if err != nil {
		return nil, err
	}

	return createdNote, nil
}

func CreateTRBAdminNoteGuidanceLetter(ctx context.Context, store *storage.Store, input models.CreateTRBAdminNoteGuidanceLetterInput) (*models.TRBAdminNote, error) {
	// it's valid for input.RecommendationIDs to be empty; see note in acceptance criteria in https://jiraent.cms.gov/browse/EASI-3362

	// check that the recommendations belong to the same TRB request
	// database constraints will prevent links being created to recommendations on a different request
	// but if we don't check, we'll still create an (invalid) admin note record

	allRecommendationsOnRequest, err := store.GetTRBGuidanceLetterInsightsByTRBRequestID(ctx, input.TrbRequestID)
	if err != nil {
		return nil, err
	}

	if !models.ContainsAllIDs(allRecommendationsOnRequest, input.RecommendationIDs) {
		return nil, &apperrors.BadRequestError{
			Err: errors.New("all recommendations referenced in admin note must belong to the same TRB request as the admin note"),
		}
	}

	noteToCreate := models.TRBAdminNote{
		TRBRequestID: input.TrbRequestID,
		Category:     models.TRBAdminNoteCategoryGuidanceLetter,
		NoteText:     input.NoteText,

		AppliesToMeetingSummary: null.BoolFrom(input.AppliesToMeetingSummary),
		AppliesToNextSteps:      null.BoolFrom(input.AppliesToNextSteps),
	}
	noteToCreate.CreatedBy = appcontext.Principal(ctx).ID()

	// ideally, we'd create the admin note and any links to recommendations in a single transaction, but we don't currently have that capability
	// see Note [Database calls from resolvers aren't atomic]

	// create the admin note itself (and get the result, with the generated ID)
	createdNote, err := store.CreateTRBAdminNote(ctx, &noteToCreate)
	if err != nil {
		return nil, err
	}

	// create links to recommendations referenced the by the admin note (if any are present)
	if len(input.RecommendationIDs) > 0 {
		_, err = store.CreateTRBAdminNoteTRBInsightLinks(ctx, input.TrbRequestID, createdNote.ID, input.RecommendationIDs)
		if err != nil {
			return nil, err
		}
	}

	return createdNote, nil
}

// GetTRBAdminNoteByID retrieves a single admin note by its ID
func GetTRBAdminNoteByID(ctx context.Context, store *storage.Store, id uuid.UUID) (*models.TRBAdminNote, error) {
	note, err := store.GetTRBAdminNoteByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if note == nil {
		return nil, &apperrors.ResourceNotFoundError{
			Err:      err,
			Resource: models.TRBAdminNote{},
		}
	}

	return note, nil
}

// GetTRBAdminNotesByTRBRequestID retrieves a list of admin notes associated with a TRB request
func GetTRBAdminNotesByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) ([]*models.TRBAdminNote, error) {
	notes, err := dataloaders.GetTRBAdminNotesByTRBRequestID(ctx, trbRequestID)
	if err != nil {
		return nil, err
	}

	return notes, nil
}

// GetTRBAdminNoteCategorySpecificData returns the category-specific data for TRB admin notes that can be loaded from the database;
// fields that require querying other data sources (such as documents' Status and URL fields, which require querying S3) are handled by other resolvers if they're requested
func GetTRBAdminNoteCategorySpecificData(ctx context.Context, store *storage.Store, note *models.TRBAdminNote) (models.TRBAdminNoteCategorySpecificData, error) {
	switch note.Category {
	case models.TRBAdminNoteCategoryGeneralRequest:
		return models.TRBAdminNoteGeneralRequestCategoryData{
			PlaceholderField: nil,
		}, nil
	case models.TRBAdminNoteCategoryInitialRequestForm:
		return models.TRBAdminNoteInitialRequestFormCategoryData{
			AppliesToBasicRequestDetails: note.AppliesToBasicRequestDetails.Bool,
			AppliesToSubjectAreas:        note.AppliesToSubjectAreas.Bool,
			AppliesToAttendees:           note.AppliesToAttendees.Bool,
		}, nil
	case models.TRBAdminNoteCategorySupportingDocuments:
		documents, err := store.GetTRBRequestDocumentsByAdminNoteID(ctx, note.ID)
		if err != nil {
			return nil, err
		}
		return models.TRBAdminNoteSupportingDocumentsCategoryData{
			Documents: documents,
		}, nil
	case models.TRBAdminNoteCategoryConsultSession:
		return models.TRBAdminNoteConsultSessionCategoryData{
			PlaceholderField: nil,
		}, nil
	case models.TRBAdminNoteCategoryGuidanceLetter:
		recommendations, err := store.GetTRBInsightsByAdminNoteID(ctx, note.ID)
		if err != nil {
			return nil, err
		}
		return models.TRBAdminNoteGuidanceLetterCategoryData{
			AppliesToMeetingSummary: note.AppliesToMeetingSummary.Bool,
			AppliesToNextSteps:      note.AppliesToNextSteps.Bool,
			Insights:                recommendations,
		}, nil
	}

	// this should never happen, all five categories should be handled, but in case it does, error and alert on it
	return nil, apperrors.NewInvalidEnumError(fmt.Errorf("admin note has an unrecognized category"), note.Category, "TRBAdminNoteCategory")
}

// SetTRBAdminNoteArchived sets whether a TRB admin note is archived (soft-deleted)
func SetTRBAdminNoteArchived(ctx context.Context, store *storage.Store, id uuid.UUID, isArchived bool) (*models.TRBAdminNote, error) {
	updatedNote, err := store.SetTRBAdminNoteArchived(ctx, id, isArchived, appcontext.Principal(ctx).ID())
	if err != nil {
		return nil, err
	}

	return updatedNote, nil
}
