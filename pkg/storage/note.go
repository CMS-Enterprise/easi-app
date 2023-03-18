package storage

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// CreateNote inserts a new note into the database
func (s *Store) CreateNote(ctx context.Context, note *models.Note) (*models.Note, error) {
	note.ID = uuid.New()
	if note.CreatedAt == nil {
		ts := s.clock.Now()
		note.CreatedAt = &ts
	}
	const createNoteSQL = `	
		INSERT INTO notes (
			id,
			system_intake,
			created_at,
		    eua_user_id,
			author_name,
			content
		) 
		VALUES (
			:id,
			:system_intake,
		    :created_at,
			:eua_user_id,
		    :author_name,    
		    :content
		)`
	_, err := s.db.NamedExec(
		createNoteSQL,
		note,
	)

	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to create note with error %s", err),
			zap.String("user", appcontext.Principal(ctx).ID()),
		)
		return &models.Note{}, &apperrors.QueryError{
			Err:       err,
			Model:     note,
			Operation: apperrors.QueryPost,
		}
	}
	return s.FetchNoteByID(ctx, note.ID)
}

// UpdateNote updates all of a IT governance admin note's mutable fields.
// The note can also be archived (soft deleted) using this function by setting the IsArchived field
func (s *Store) UpdateNote(ctx context.Context, note *models.Note) (*models.Note, error) {
	stmt, err := s.db.PrepareNamed(`
	UPDATE notes
	SET
		content = :content,
		is_archived = :is_archived,
		modified_by = :modified_by,
		modified_at = CURRENT_TIMESTAMP
	WHERE id = :id
	RETURNING *;
`)

	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to update IT Governance admin note with error %s", err),
			zap.Error(err),
			zap.String("id", note.ID.String()),
		)
		return nil, err
	}

	updated := models.Note{}

	err = stmt.Get(&updated, note)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to update IT Governance admin note with error %s", err),
			zap.Error(err),
			zap.String("id", note.ID.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     note,
			Operation: apperrors.QueryUpdate,
		}
	}

	return &updated, nil
}

// FetchNoteByID retrieves a single Note by its primary key identifier
func (s *Store) FetchNoteByID(ctx context.Context, id uuid.UUID) (*models.Note, error) {
	note := models.Note{}
	err := s.db.Get(&note, "SELECT * FROM public.notes WHERE id=$1", id)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to fetch note %s", err),
			zap.String("id", id.String()),
		)
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &apperrors.ResourceNotFoundError{Err: err, Resource: models.SystemIntake{}}
		}
		return nil, err
	}
	return &note, nil
}

// FetchNotesBySystemIntakeID retrieves all (non archived/deleted) Notes associated with a specific SystemIntake
func (s *Store) FetchNotesBySystemIntakeID(ctx context.Context, id uuid.UUID) ([]*models.Note, error) {
	notes := []*models.Note{}
	err := s.db.Select(&notes, "SELECT * FROM notes WHERE system_intake=$1 AND is_archived=false ORDER BY created_at DESC", id)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to fetch notes %s", err),
			zap.String("systemIntakeID", id.String()),
		)
		return nil, err
	}
	return notes, nil
}
