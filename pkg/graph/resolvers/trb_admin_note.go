package resolvers

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// CreateTRBAdminNote creates a new TRB admin note in the database
// TODO - EASI-3458 - remove
func CreateTRBAdminNote(ctx context.Context, store *storage.Store, trbRequestID uuid.UUID, category models.TRBAdminNoteCategory, noteText models.HTML) (*models.TRBAdminNote, error) {
	// TODO - EASI-3362 - potentially set category-specific fields for the note's category to the default values for existing data
	// i.e., if category is Initial Request Form, set all the checkboxes for that category to false
	// that way admin notes created before we fully deploy this feature will have the correct default values

	noteToCreate := models.TRBAdminNote{
		TRBRequestID: trbRequestID,
		Category:     category,
		NoteText:     noteText,
	}
	noteToCreate.CreatedBy = appcontext.Principal(ctx).ID()

	createdNote, err := store.CreateTRBAdminNote(ctx, &noteToCreate)
	if err != nil {
		return nil, err
	}

	return createdNote, nil
}

// functions to convert inputs to models.TRBAdminNote
// TODO - is there an easy way to abstract the logic in these, then use in the public resolvers? (if not, delete this code)
// TODO - maybe move that common logic into a business logic package
// TODO - if I extract that logic, instead of passing in context, just pass createdBy as string param?

/*
func convertGeneralRequestInputToAdminNote(ctx context.Context, input model.CreateTRBAdminNoteGeneralRequestInput) models.TRBAdminNote {
	noteToCreate := models.TRBAdminNote{
		TRBRequestID: input.TrbRequestID,
		Category:     models.TRBAdminNoteCategoryGeneralRequest,
		NoteText:     input.NoteText,
	}
	noteToCreate.CreatedBy = appcontext.Principal(ctx).ID()

	return noteToCreate
}

func convertInitialRequestFormInputToAdminNote(ctx context.Context, input model.CreateTRBAdminNoteInitialRequestFormInput) models.TRBAdminNote {
	noteToCreate := models.TRBAdminNote{
		TRBRequestID: input.TrbRequestID,
		Category:     models.TRBAdminNoteCategoryInitialRequestForm,
		NoteText:     input.NoteText,

		AppliesToBasicRequestDetails: null.BoolFrom(input.AppliesToBasicRequestDetails),
		AppliesToSubjectAreas:        null.BoolFrom(input.AppliesToSubjectAreas),
		AppliesToAttendees:           null.BoolFrom(input.AppliesToAttendees),
	}
	noteToCreate.CreatedBy = appcontext.Principal(ctx).ID()

	return noteToCreate
}

func convertSupportingDocumentsInputToAdminNote(ctx context.Context, input model.CreateTRBAdminNoteSupportingDocumentsInput) models.TRBAdminNote {
	noteToCreate := models.TRBAdminNote{
		TRBRequestID: input.TrbRequestID,
		Category:     models.TRBAdminNoteCategorySupportingDocuments,
		NoteText:     input.NoteText,
	}
	noteToCreate.CreatedBy = appcontext.Principal(ctx).ID()

	return noteToCreate
}

func convertAdviceLetterInputToAdminNote(ctx context.Context, input model.CreateTRBAdminNoteAdviceLetterInput) models.TRBAdminNote {
	noteToCreate := models.TRBAdminNote{
		TRBRequestID: input.TrbRequestID,
		Category:     models.TRBAdminNoteCategoryAdviceLetter,
		NoteText:     input.NoteText,

		AppliesToMeetingSummary: null.BoolFrom(input.AppliesToMeetingSummary),
		AppliesToNextSteps:      null.BoolFrom(input.AppliesToNextSteps),
	}
	noteToCreate.CreatedBy = appcontext.Principal(ctx).ID()

	return noteToCreate
}

func convertConsultSessionInputToAdminNote(ctx context.Context, input model.CreateTRBAdminNoteConsultSessionInput) models.TRBAdminNote {
	noteToCreate := models.TRBAdminNote{
		TRBRequestID: input.TrbRequestID,
		Category:     models.TRBAdminNoteCategoryConsultSession,
		NoteText:     input.NoteText,
	}
	noteToCreate.CreatedBy = appcontext.Principal(ctx).ID()

	return noteToCreate
}
*/

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
	// it's valid for input.DocumentIDs to be empty, we don't need to do any validation checks
	// see note in acceptance criteria in https://jiraent.cms.gov/browse/EASI-3362

	// TODO - should we validate that documents belong to the same request?
	// would require querying the database for documents, unless we changed the GQL schema to include the request ID for each document

	adminEUAID := appcontext.Principal(ctx).ID()

	noteToCreate := models.TRBAdminNote{
		TRBRequestID: input.TrbRequestID,
		Category:     models.TRBAdminNoteCategorySupportingDocuments,
		NoteText:     input.NoteText,
	}
	noteToCreate.CreatedBy = adminEUAID

	// ideally, we'd create the admin note and any links to documents in a single transaction, but we don't currently have code for that
	// see Note [Database calls from resolvers aren't atomic]

	createdNote, err := store.CreateTRBAdminNote(ctx, &noteToCreate)
	if err != nil {
		return nil, err
	}

	// create links to documents referenced by the admin note (if any are present)
	if len(input.DocumentIDs) > 0 {
		_, err = store.CreateTRBAdminNoteTRBDocumentLinks(ctx, createdNote.ID, input.DocumentIDs)
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
	// it's valid for input.RecommendationIDs to be empty, we don't need to do any validation checks
	// see note in acceptance criteria in https://jiraent.cms.gov/browse/EASI-3362

	noteToCreate := models.TRBAdminNote{
		TRBRequestID: input.TrbRequestID,
		Category:     models.TRBAdminNoteCategoryAdviceLetter,
		NoteText:     input.NoteText,

		AppliesToMeetingSummary: null.BoolFrom(input.AppliesToMeetingSummary),
		AppliesToNextSteps:      null.BoolFrom(input.AppliesToNextSteps),
	}
	noteToCreate.CreatedBy = appcontext.Principal(ctx).ID()

	createdNote, err := store.CreateTRBAdminNote(ctx, &noteToCreate)
	if err != nil {
		return nil, err
	}

	// TODO - create links to recommendations
	// TODO - reference note on wanting to wrap this in transaction

	return createdNote, nil
}

func CreateTRBAdminNoteWithCategorySpecificData(ctx context.Context, store *storage.Store) (*models.TRBAdminNote, error) {
	// universal function for saving notes in all categories, called by five separate resolvers
	// TODO - does this work?
	// TODO - probably want separate functions; at the least, Supporting Documents and Advice Letter need their own code

	var noteModel *models.TRBAdminNote
	createdNote, err := store.CreateTRBAdminNote(ctx, noteModel)
	if err != nil {
		return nil, err
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

// UpdateTRBAdminNote handles general updates to a TRB admin note, without handling category-specific data
// If updating admin notes requires handling category-specific data, see note on UpdateTRBAdminNoteInput in GraphQL schema;
// break this up into separate resolvers
// Also, if updating with category-specific data allows changing a note's category, the resolvers will need to null out any previous category-specific data
func UpdateTRBAdminNote(ctx context.Context, store *storage.Store, input map[string]interface{}) (*models.TRBAdminNote, error) {
	idStr, idFound := input["id"]
	if !idFound {
		return nil, errors.New("missing required property id")
	}

	id, err := uuid.Parse(idStr.(string))
	if err != nil {
		return nil, err
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
