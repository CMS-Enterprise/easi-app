package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// CreateTRBAdminNote creates a new TRB admin note in the database
func CreateTRBAdminNote(ctx context.Context, store *storage.Store, trbRequestID uuid.UUID, category models.TRBAdminNoteCategory, noteText string) (*models.TRBAdminNote, error) {
	noteToCreate := models.TRBAdminNote{
		TRBRequestID: trbRequestID,
		Category:     category,
		NoteText:     noteText,
	}
	noteToCreate.CreatedBy = appcontext.Principal(ctx).ID()

	createdNote, err := store.CreateTRBAdminNote(appcontext.ZLogger(ctx), &noteToCreate)
	if err != nil {
		return nil, err
	}

	return createdNote, nil
}

// GetTRBAdminNotesByTRBRequestID retrieves a list of admin notes associated with a TRB request
func GetTRBAdminNotesByTRBRequestID(ctx context.Context, store *storage.Store, trbRequestID uuid.UUID) ([]*models.TRBAdminNote, error) {
	notes, err := store.GetTRBAdminNotesByTRBRequestID(appcontext.ZLogger(ctx), trbRequestID)
	if err != nil {
		return nil, err
	}

	return notes, nil
}

// GetTRBAdminNoteAuthorInfo gets the full user info for the author of an admin note
func GetTRBAdminNoteAuthorInfo(ctx context.Context, authorEUAID string, fetchUserInfo func(context.Context, string) (*models.UserInfo, error)) (*models.UserInfo, error) {
	authorInfo, err := fetchUserInfo(ctx, authorEUAID)
	if err != nil {
		return nil, err
	}
	return authorInfo, nil
}
