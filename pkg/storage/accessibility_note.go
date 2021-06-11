package storage

import (
	"context"
	"time"

	"go.uber.org/zap"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

// CreateAccessibilityNote creates a note for a given accessibility request
func (s *Store) CreateAccessibilityNote(ctx context.Context, note *models.AccessibilityNote) (*models.AccessibilityNote, error) {
	note.ID = uuid.New()
	now := time.Now()
	note.CreatedAt = &now

	const createAccessibilityNoteSQL = `
			INSERT INTO accessibility_notes (
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
		createAccessibilityNoteSQL,
		note,
	)
	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to create accessibility note", zap.Error(err))
		return nil, err
	}
	return s.FetchAccessibilityNoteByID(ctx, note.ID)
}

// FetchAccessibilityNoteByID fetches an accessibility note by its ID
func (s *Store) FetchAccessibilityNoteByID(ctx context.Context, id uuid.UUID) (*models.AccessibilityNote, error) {
	var note models.AccessibilityNote
	err := s.db.Get(
		&note, "SELECT * FROM accessibility_request_status_records WHERE request_id=$1;",
		id,
	)
	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to fetch accessibility note", zap.Error(err))
		return nil, err
	}
	return &note, nil
}
