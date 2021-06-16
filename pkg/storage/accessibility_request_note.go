package storage

import (
	"context"
	"time"

	"go.uber.org/zap"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

// CreateAccessibilityRequestNote creates a note for a given accessibility request
func (s *Store) CreateAccessibilityRequestNote(ctx context.Context, note *models.AccessibilityRequestNote) (*models.AccessibilityRequestNote, error) {
	note.ID = uuid.New()
	now := time.Now()
	note.CreatedAt = &now

	const createAccessibilityRequestNoteSQL = `
			INSERT INTO accessibility_request_notes (
				id,
				request_id,
				created_at,
				note,
			    eua_user_id
			)
			VALUES (
				:id,
				:request_id,
				:created_at,
				:note,
				:eua_user_id
			)`
	_, err := s.db.NamedExec(
		createAccessibilityRequestNoteSQL,
		note,
	)
	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to create accessibility request note", zap.Error(err))
		return nil, err
	}
	return s.FetchAccessibilityRequestNoteByID(ctx, note.ID)
}

// FetchAccessibilityRequestNoteByID fetches an accessibility request note by its ID
func (s *Store) FetchAccessibilityRequestNoteByID(ctx context.Context, id uuid.UUID) (*models.AccessibilityRequestNote, error) {
	var note models.AccessibilityRequestNote
	err := s.db.Get(
		&note, "SELECT * FROM accessibility_request_notes WHERE id=$1;",
		id,
	)
	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to fetch accessibility request note", zap.Error(err))
		return nil, err
	}
	return &note, nil
}

// FetchAccessibilityRequestsByRequestID fetches all the notes for a given in descending order
func (s *Store) FetchAccessibilityRequestsByRequestID(ctx context.Context, requestID uuid.UUID) (*[]models.AccessibilityRequestNote, error) {
	var notes []models.AccessibilityRequestNote
	err := s.db.Select(
		&notes, "SELECT * FROM accessibility_request_notes WHERE request_id=$1 ORDER BY created_at DESC;", requestID,
	)
	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to fetch accessibility request notes", zap.Error(err))
		return nil, err
	}
	return &notes, nil
}
