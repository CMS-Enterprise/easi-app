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

// CreateTRBRequestAttendee creates a new TRB request attendee record in the database
func (s *Store) CreateTRBRequestAttendee(ctx context.Context, attendee *models.TRBRequestAttendee) (*models.TRBRequestAttendee, error) {
	attendee.ID = uuid.New()
	stmt, err := s.db.PrepareNamed(`
		INSERT INTO trb_request_attendees (
			id,
			eua_user_id,
			trb_request_id,
			role,
			component,
			created_by,
			modified_by
		)
		VALUES (
			:id,
			:eua_user_id,
			:trb_request_id,
			:role,
			:component,
			:created_by,
			:modified_by
		)
		RETURNING *;`)

	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to update TRB create attendee %s", err),
			zap.String("id", attendee.ID.String()),
		)
		return nil, err
	}

	created := models.TRBRequestAttendee{}
	err = stmt.Get(&created, attendee)

	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to create TRB request attendee with error %s", zap.Error(err))
		return nil, err
	}
	return &created, nil
}

// UpdateTRBRequestAttendee updates a TRB request attendee record in the database
func (s *Store) UpdateTRBRequestAttendee(ctx context.Context, attendee *models.TRBRequestAttendee) (*models.TRBRequestAttendee, error) {
	// return attendee, nil
	stmt, err := s.db.PrepareNamed(`
		UPDATE trb_request_attendees
		SET role = :role,
			component = :component,
			modified_by = :modified_by,
			modified_at = CURRENT_TIMESTAMP
		WHERE id = :id
		RETURNING *;
		`)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to update TRB request attendee %s", err),
			zap.String("id", attendee.ID.String()),
		)
		return nil, err
	}
	updated := models.TRBRequestAttendee{}

	err = stmt.Get(&updated, attendee)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to update TRB request attendee %s", err),
			zap.String("id", attendee.ID.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     attendee,
			Operation: apperrors.QueryUpdate,
		}
	}

	return &updated, err
}

// GetTRBRequestAttendeesByTRBRequestID queries the DB for all the TRB request attendee records
// matching the given TRB request ID
func (s *Store) GetTRBRequestAttendeesByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) ([]*models.TRBRequestAttendee, error) {
	results := []*models.TRBRequestAttendee{}

	err := s.db.Select(&results, `SELECT * FROM trb_request_attendees WHERE trb_request_id=$1`, trbRequestID)

	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		appcontext.ZLogger(ctx).Error("Failed to fetch TRB request attendees", zap.Error(err), zap.String("id", trbRequestID.String()))
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.TRBRequestAttendee{},
			Operation: apperrors.QueryFetch,
		}
	}
	return results, nil
}

// DeleteTRBRequestAttendee deletes an existing TRB request attendee record in the database
func (s *Store) DeleteTRBRequestAttendee(ctx context.Context, id uuid.UUID) (*models.TRBRequestAttendee, error) {
	stmt, err := s.db.PrepareNamed(`
		DELETE FROM trb_request_attendees
		WHERE id = $1
		RETURNING *;`)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to update TRB request attendee %s", err),
			zap.String("id", id.String()),
		)
		return nil, err
	}
	toDelete := models.TRBRequestAttendee{}
	toDelete.ID = id
	deleted := models.TRBRequestAttendee{}

	err = stmt.Get(&deleted, &toDelete)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to delete TRB request attendee %s", err),
			zap.String("id", id.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     toDelete,
			Operation: apperrors.QueryUpdate,
		}
	}

	return &deleted, err
}
