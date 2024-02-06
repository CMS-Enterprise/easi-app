package resolvers

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

func CreateTRBAdminNoteGeneralRequest(ctx context.Context, store *storage.Store, input model.CreateTRBAdminNoteGeneralRequestInput) (*models.TRBAdminNote, error) {
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

func CreateTRBAdminNoteInitialRequestForm(ctx context.Context, store *storage.Store, input model.CreateTRBAdminNoteInitialRequestFormInput) (*models.TRBAdminNote, error) {
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

func CreateTRBAdminNoteSupportingDocuments(ctx context.Context, store *storage.Store, input model.CreateTRBAdminNoteSupportingDocumentsInput) (*models.TRBAdminNote, error) {
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

func CreateTRBAdminNoteConsultSession(ctx context.Context, store *storage.Store, input model.CreateTRBAdminNoteConsultSessionInput) (*models.TRBAdminNote, error) {
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

func CreateTRBAdminNoteAdviceLetter(ctx context.Context, store *storage.Store, input model.CreateTRBAdminNoteAdviceLetterInput) (*models.TRBAdminNote, error) {
	// it's valid for input.RecommendationIDs to be empty; see note in acceptance criteria in https://jiraent.cms.gov/browse/EASI-3362

	// check that the recommendations belong to the same TRB request
	// database constraints will prevent links being created to recommendations on a different request
	// but if we don't check, we'll still create an (invalid) admin note record

	allRecommendationsOnRequest, err := store.GetTRBAdviceLetterRecommendationsByTRBRequestID(ctx, input.TrbRequestID)
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
		Category:     models.TRBAdminNoteCategoryAdviceLetter,
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
		_, err = store.CreateTRBAdminNoteTRBRecommendationLinks(ctx, input.TrbRequestID, createdNote.ID, input.RecommendationIDs)
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
func GetTRBAdminNotesByTRBRequestID(ctx context.Context, store *storage.Store, trbRequestID uuid.UUID) ([]*models.TRBAdminNote, error) {
	notes, err := store.GetTRBAdminNotesByTRBRequestID(ctx, trbRequestID)
	if err != nil {
		return nil, err
	}

	return notes, nil
}

// GetTRBAdminNoteCategorySpecificData returns the category-specific data for TRB admin notes that can be loaded from the database;
// fields that require querying other data sources (such as documents' Status and URL fields, which require querying S3) are handled by other resolvers if they're requested
func GetTRBAdminNoteCategorySpecificData(ctx context.Context, store *storage.Store, note *models.TRBAdminNote) (model.TRBAdminNoteCategorySpecificData, error) {
	switch note.Category {
	case models.TRBAdminNoteCategoryGeneralRequest:
		return model.TRBAdminNoteGeneralRequestCategoryData{
			PlaceholderField: nil,
		}, nil
	case models.TRBAdminNoteCategoryInitialRequestForm:
		return model.TRBAdminNoteInitialRequestFormCategoryData{
			AppliesToBasicRequestDetails: note.AppliesToBasicRequestDetails.Bool,
			AppliesToSubjectAreas:        note.AppliesToSubjectAreas.Bool,
			AppliesToAttendees:           note.AppliesToAttendees.Bool,
		}, nil
	case models.TRBAdminNoteCategorySupportingDocuments:
		documents, err := store.GetTRBRequestDocumentsByAdminNoteID(ctx, note.ID)
		if err != nil {
			return nil, err
		}
		return model.TRBAdminNoteSupportingDocumentsCategoryData{
			Documents: documents,
		}, nil
	case models.TRBAdminNoteCategoryConsultSession:
		return model.TRBAdminNoteConsultSessionCategoryData{
			PlaceholderField: nil,
		}, nil
	case models.TRBAdminNoteCategoryAdviceLetter:
		recommendations, err := store.GetTRBRecommendationsByAdminNoteID(ctx, note.ID)
		if err != nil {
			return nil, err
		}
		return model.TRBAdminNoteAdviceLetterCategoryData{
			AppliesToMeetingSummary: note.AppliesToMeetingSummary.Bool,
			AppliesToNextSteps:      note.AppliesToNextSteps.Bool,
			Recommendations:         recommendations,
		}, nil
	}

	// this should never happen, all five categories should be handled, but in case it does, error and alert on it
	return nil, apperrors.NewInvalidEnumError(fmt.Errorf("admin note has an unrecognized category"), note.Category, "TRBAdminNoteCategory")
}

// UpdateTRBAdminNote handles general updates to a TRB admin note, without handling category-specific data
// If updating admin notes requires handling category-specific data, see note on UpdateTRBAdminNoteInput in GraphQL schema;
// break this up into separate resolvers
// Also, if updating with category-specific data allows changing a note's category, the resolvers will need to null out any previous category-specific data;
// as well as updating the fields on the admin note record, many-to-many links to documents/recommendations may need to be deleted
// (which would require implementing storage methods to delete those records)
func UpdateTRBAdminNote(ctx context.Context, store *storage.Store, input map[string]interface{}) (*models.TRBAdminNote, error) {
	idIface, idFound := input["id"]
	if !idFound {
		return nil, errors.New("missing required property id")
	}

	id, ok := idIface.(uuid.UUID)
	if !ok {
		return nil, fmt.Errorf("unable to convert incoming updateTRBAdminNote id to uuid: %v", idIface)
	}

	note, err := store.GetTRBAdminNoteByID(ctx, id)
	if err != nil {
		return nil, err
	}

	err = ApplyChangesAndMetaData(input, note, appcontext.Principal(ctx))
	if err != nil {
		return nil, err
	}

	updatedNote, err := store.UpdateTRBAdminNote(ctx, note)
	if err != nil {
		return nil, err
	}

	return updatedNote, nil
}

// SetTRBAdminNoteArchived sets whether a TRB admin note is archived (soft-deleted)
func SetTRBAdminNoteArchived(ctx context.Context, store *storage.Store, id uuid.UUID, isArchived bool) (*models.TRBAdminNote, error) {
	updatedNote, err := store.SetTRBAdminNoteArchived(ctx, id, isArchived, appcontext.Principal(ctx).ID())
	if err != nil {
		return nil, err
	}

	return updatedNote, nil
}
