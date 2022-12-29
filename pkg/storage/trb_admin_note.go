package storage

import (
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// CreateTRBAdminNote creates a new TRB admin note record in the database
func (s *Store) CreateTRBAdminNote(logger *zap.Logger, note *models.TRBAdminNote) (*models.TRBAdminNote, error) {
	if note.ID == uuid.Nil {
		note.ID = uuid.New()
	}

	const trbAdminNoteCreateSQL = `
		INSERT INTO trb_admin_notes (
			id,
			trb_request_id,
			created_by,
			category,
			note_text
		) VALUES (
			:id,
			:trb_request_id,
			:created_by,
			:category,
			:note_text
		) RETURNING *;
	`
	stmt, err := s.db.PrepareNamed(trbAdminNoteCreateSQL)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to prepare SQL statement for creating TRB admin note with error %s", err),
			zap.Error(err),
			zap.String("user", note.CreatedBy),
		)
		return nil, err
	}

	retNote := models.TRBAdminNote{}

	err = stmt.Get(&retNote, note)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to create TRB admin note with error %s", err),
			zap.Error(err),
			zap.String("user", note.CreatedBy),
		)
		return nil, err
	}

	return &retNote, nil
}

// GetTRBAdminNotesByTRBRequestID returns all notes for a given TRB request
func (s *Store) GetTRBAdminNotesByTRBRequestID(logger *zap.Logger, trbRequestID uuid.UUID) ([]*models.TRBAdminNote, error) {
	notes := []*models.TRBAdminNote{}

	stmt, err := s.db.PrepareNamed(`SELECT * FROM trb_admin_notes WHERE trb_request_id = :trb_request_id`)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to prepare SQL statement for fetching TRB admin notes with error %s", err),
			zap.Error(err),
			zap.String("trbRequestID", trbRequestID.String()),
		)
		return nil, err
	}

	arg := map[string]interface{}{"trb_request_id": trbRequestID}

	err = stmt.Select(&notes, arg)
	if err != nil {
		logger.Error(
			"Failed to fetch TRB admin notes",
			zap.Error(err),
			zap.String("trbRequestID", trbRequestID.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     []*models.TRBAdminNote{},
			Operation: apperrors.QueryFetch,
		}
	}

	return notes, nil
}
