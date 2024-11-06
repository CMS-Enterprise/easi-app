package storage

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlqueries"
)

// CreateTRBAdminNote creates a new TRB admin note record in the database
func (s *Store) CreateTRBAdminNote(ctx context.Context, note *models.TRBAdminNote) (*models.TRBAdminNote, error) {
	if note.ID == uuid.Nil {
		note.ID = uuid.New()
	}

	const trbAdminNoteCreateSQL = `
		INSERT INTO trb_admin_notes (
			id,
			trb_request_id,
			created_by,
			category,
			note_text,
			applies_to_basic_request_details,
			applies_to_subject_areas,
			applies_to_attendees,
			applies_to_meeting_summary,
			applies_to_next_steps
		) VALUES (
			:id,
			:trb_request_id,
			:created_by,
			:category,
			:note_text,
			:applies_to_basic_request_details,
			:applies_to_subject_areas,
			:applies_to_attendees,
			:applies_to_meeting_summary,
			:applies_to_next_steps
		) RETURNING *;
	`
	stmt, err := s.db.PrepareNamed(trbAdminNoteCreateSQL)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to create TRB admin note with error %s", err),
			zap.Error(err),
			zap.String("user", note.CreatedBy),
		)
		return nil, err
	}
	defer stmt.Close()

	retNote := models.TRBAdminNote{}

	err = stmt.Get(&retNote, note)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to create TRB admin note with error %s", err),
			zap.Error(err),
			zap.String("user", note.CreatedBy),
		)
		return nil, err
	}

	return &retNote, nil
}

// GetTRBAdminNotesByTRBRequestID returns all notes for a given TRB request
func (s *Store) GetTRBAdminNotesByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) ([]*models.TRBAdminNote, error) {
	notes := []*models.TRBAdminNote{}
	err := namedSelect(ctx, s.db, &notes, sqlqueries.TRBRequestAdminNotes.GetByTRBID, args{
		"trb_request_id": trbRequestID,
	})
	if err != nil {
		appcontext.ZLogger(ctx).Error(
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

// GetTRBAdminNotesByTRBRequestIDs returns all notes for a given TRB request
func (s *Store) GetTRBAdminNotesByTRBRequestIDs(ctx context.Context, trbRequestIDs []uuid.UUID) ([]*models.TRBAdminNote, error) {
	notes := []*models.TRBAdminNote{}
	err := namedSelect(ctx, s.db, &notes, sqlqueries.TRBRequestAdminNotes.GetByTRBIDs, args{
		"trb_request_ids": pq.Array(trbRequestIDs),
	})
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch TRB admin notes",
			zap.Error(err),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     []*models.TRBAdminNote{},
			Operation: apperrors.QueryFetch,
		}
	}

	return notes, nil
}

// GetTRBAdminNoteByID retrieves a single admin note by its ID
func (s *Store) GetTRBAdminNoteByID(ctx context.Context, id uuid.UUID) (*models.TRBAdminNote, error) {
	note := models.TRBAdminNote{}

	stmt, err := s.db.PrepareNamed(`SELECT * FROM trb_admin_notes WHERE id = :id`)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch admin note",
			zap.Error(err),
			zap.String("id", id.String()),
		)
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{"id": id}

	err = stmt.Get(&note, arg)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}

		appcontext.ZLogger(ctx).Error(
			"Failed to fetch admin note",
			zap.Error(err),
			zap.String("id", id.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     id,
			Operation: apperrors.QueryFetch,
		}
	}

	return &note, nil
}

// SetTRBAdminNoteArchived sets whether a TRB admin note is archived (soft-deleted)
// It takes a modifiedBy argument because it doesn't take a full TRBAdminNote as an argument, and ModifiedBy fields are usually set by the resolver.
func (s *Store) SetTRBAdminNoteArchived(ctx context.Context, id uuid.UUID, isArchived bool, modifiedBy string) (*models.TRBAdminNote, error) {
	stmt, err := s.db.PrepareNamed(`
		UPDATE trb_admin_notes
		SET
			is_archived = :is_archived,
			modified_by = :modified_by,
			modified_at = CURRENT_TIMESTAMP
		WHERE id = :id
		RETURNING *;`)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to archive TRB admin note with error %s", err),
			zap.Error(err),
			zap.String("id", id.String()),
		)
		return nil, err
	}
	defer stmt.Close()

	updated := models.TRBAdminNote{}
	arg := map[string]interface{}{
		"id":          id,
		"is_archived": isArchived,
		"modified_by": modifiedBy,
	}

	err = stmt.Get(&updated, arg)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to archive TRB admin note with error %s", err),
			zap.Error(err),
			zap.String("id", id.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     updated,
			Operation: apperrors.QueryUpdate,
		}
	}

	return &updated, nil
}
