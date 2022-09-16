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
	const createTRBRequestAttendeeSQL = `
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
		)`
	_, err := s.db.NamedExecContext(
		ctx,
		createTRBRequestAttendeeSQL,
		attendee,
	)
	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to create TRB request attendee with error %s", zap.Error(err))
		return nil, err
	}
	return attendee, nil
}

// UpdateTRBRequestAttendee updates a TRB request attendee record in the database
func (s *Store) UpdateTRBRequestAttendee(ctx context.Context, attendee *models.TRBRequestAttendee) (*models.TRBRequestAttendee, error) {
	const sql = `
		UPDATE trb_request_attendees
		SET
			role = :role,
			component = :component,
			modified_by = :modified_by,
			modified_at = CURRENT_TIMESTAMP
		WHERE trb_request_attendees.id = :id
	`
	_, err := s.db.NamedExecContext(ctx, sql, attendee)

	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to create TRB request attendee with error %s", zap.Error(err))
		return nil, err
	}

	return attendee, nil
}

// GetTRBRequestAttendeesByTRBRequestID queries the DB for all the TRB request attendee records
// matching the given TRB request ID
func (s *Store) GetTRBRequestAttendeesByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) ([]*models.TRBRequestAttendee, error) {
	results := []*models.TRBRequestAttendee{}

	err := s.db.Select(&results, `SELECT * FROM trb_request_attendees WHERE trb_request_id=$1`, trbRequestID)

	fmt.Println("Number of results for attendees: ", len(results))
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
func (s *Store) DeleteTRBRequestAttendee(ctx context.Context, id uuid.UUID) error {
	const deleteTRBRequestAttendeeSQL = `
		DELETE FROM trb_request_attendees
		WHERE id = $1;`

	_, err := s.db.Exec(deleteTRBRequestAttendeeSQL, id)

	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to delete TRB request attendee with error %s", zap.Error(err))
		return err
	}

	return nil
}
