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
	"github.com/cmsgov/easi-app/pkg/sqlutils"
)

// CreateTRBRequestAttendee creates a new TRB request attendee record in the database
// Note this will be refactored to not use the store, but is left now for organization
func (s *Store) CreateTRBRequestAttendee(ctx context.Context, np sqlutils.NamedPreparer, attendee *models.TRBRequestAttendee) (*models.TRBRequestAttendee, error) {
	attendee.ID = uuid.New()
	stmt, err := np.PrepareNamed(`
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
	defer stmt.Close()

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
		RETURNING *;`)
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
		WHERE id = :id
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

// GetAttendeeComponentByEUA attempts to retrieve the component of a given EUA user ID and TRB Request ID
func (s *Store) GetAttendeeComponentByEUA(ctx context.Context, euaID string, trbRequestID uuid.UUID) (*string, error) {
	attendee := models.TRBRequestAttendee{}
	stmt, err := s.db.PrepareNamed(`
		SELECT *
		FROM trb_request_attendees
		WHERE eua_user_id = :eua_user_id
		AND trb_request_id = :trb_request_id;
	`)

	if err != nil {
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch TRB attendee",
			zap.Error(err),
			zap.String("euaID", euaID),
		)
		return nil, err
	}
	arg := map[string]interface{}{
		"eua_user_id":    euaID,
		"trb_request_id": trbRequestID,
	}
	err = stmt.Get(&attendee, arg)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}

		appcontext.ZLogger(ctx).Error(
			"Failed to fetch TRB attendee",
			zap.Error(err),
			zap.String("euaID", euaID),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     attendee,
			Operation: apperrors.QueryFetch,
		}
	}
	return attendee.Component, nil
}
