package resolvers

import (
	"context"

	"github.com/guregu/null"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

// CreateSystemIntakeNote creates a system intake note.
func CreateSystemIntakeNote(
	ctx context.Context,
	store *storage.Store,
	input models.CreateSystemIntakeNoteInput,
) (*models.SystemIntakeNote, error) {
	systemIntakeNote := models.SystemIntakeNote{
		AuthorEUAID:    appcontext.Principal(ctx).ID(),
		AuthorName:     null.StringFrom(input.AuthorName),
		Content:        &input.Content,
		SystemIntakeID: input.IntakeID,
	}

	createdNote, err := store.CreateSystemIntakeNote(ctx, &systemIntakeNote)
	return createdNote, err
}

// UpdateSystemIntakeNote updates a system intake note.
func UpdateSystemIntakeNote(
	ctx context.Context,
	store *storage.Store,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	input models.UpdateSystemIntakeNoteInput,
) (*models.SystemIntakeNote, error) {
	userInfo, err := fetchUserInfo(ctx, appcontext.Principal(ctx).ID())
	if err != nil {
		return nil, err
	}

	systemIntakeNote, err := store.UpdateSystemIntakeNote(ctx, &models.SystemIntakeNote{
		Content:    &input.Content,
		IsArchived: input.IsArchived,
		ID:         input.ID,
		ModifiedBy: &userInfo.Username,
	})
	return systemIntakeNote, err
}

// SystemIntakeNotes fetches notes by System Intake ID
func SystemIntakeNotes(
	ctx context.Context,
	obj *models.SystemIntake,
) ([]*models.SystemIntakeNote, error) {
	return dataloaders.GetSystemIntakeNotesBySystemIntakeID(ctx, obj.ID)
}

// SystemIntakeNoteAuthor returns the system intake note author
func SystemIntakeNoteAuthor(obj *models.SystemIntakeNote) (*models.SystemIntakeNoteAuthor, error) {
	return &models.SystemIntakeNoteAuthor{
		Eua:  obj.AuthorEUAID,
		Name: obj.AuthorName.ValueOrZero(),
	}, nil
}

// SystemIntakeNoteEditor returns the system intake note editor
func SystemIntakeNoteEditor(ctx context.Context, obj *models.SystemIntakeNote) (*models.UserInfo, error) {
	var systemIntakeNoteEditorInfo *models.UserInfo
	if obj.ModifiedBy != nil {
		info, err := dataloaders.FetchUserInfoByEUAUserID(ctx, *obj.ModifiedBy)
		if err != nil {
			return nil, err
		}
		systemIntakeNoteEditorInfo = info
	}

	if systemIntakeNoteEditorInfo == nil {
		systemIntakeNoteEditorInfo = &models.UserInfo{}
	}

	return systemIntakeNoteEditorInfo, nil
}
