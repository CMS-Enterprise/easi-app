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
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
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
	defer stmt.Close()

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

	err := namedSelect(ctx, s, &results, sqlqueries.TRBRequestAttendees.GetByTRBID, args{
		"trb_request_id": trbRequestID,
	})

	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to fetch TRB request attendees", zap.Error(err), zap.String("id", trbRequestID.String()))
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.TRBRequestAttendee{},
			Operation: apperrors.QueryFetch,
		}
	}
	return results, nil
}

// GetTRBRequestAttendeesByTRBRequestIDs queries the DB for all the TRB request attendee records
// matching the given TRB request IDs
func (s *Store) GetTRBRequestAttendeesByTRBRequestIDs(ctx context.Context, trbRequestIDs []uuid.UUID) ([]*models.TRBRequestAttendee, error) {
	results := []*models.TRBRequestAttendee{}

	err := namedSelect(ctx, s, &results, sqlqueries.TRBRequestAttendees.GetByTRBIDs, args{
		"trb_request_ids": pq.Array(trbRequestIDs),
	})

	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to fetch TRB request attendees", zap.Error(err))
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
	defer stmt.Close()

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

// GetAttendeeByEUAIDAndTRBID attempts to retrieve an attendee of a given EUA user ID and TRB Request ID
func (s *Store) GetAttendeeByEUAIDAndTRBID(ctx context.Context, euaID string, trbRequestID uuid.UUID) (*models.TRBRequestAttendee, error) {
	attendee := models.TRBRequestAttendee{}
	err := namedGet(ctx, s, &attendee, sqlqueries.GetAttendeeByEUAIDAndTRBIDSQL, args{
		"trb_request_id": trbRequestID,
		"eua_user_id":    euaID,
	})

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}

		appcontext.ZLogger(ctx).Error(
			"Failed to fetch TRB attendee by EUA and TRB ID",
			zap.Error(err),
			zap.String("euaID", euaID),
			zap.String("trbRequestID", trbRequestID.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     attendee,
			Operation: apperrors.QueryFetch,
		}
	}
	return &attendee, nil
}

// GetAttendeesByEUAIDsAndTRBIDs attempts to retrieve a list of attendees given EUA user IDs and TRB Request IDs
func (s *Store) GetAttendeesByEUAIDsAndTRBIDs(ctx context.Context, euaIDs []string, trbRequestIDs []uuid.UUID) ([]*models.TRBRequestAttendee, error) {
	attendees := []*models.TRBRequestAttendee{}
	err := namedSelect(ctx, s, &attendees, sqlqueries.GetAttendeesByEUAIDsAndTRBIDsSQL, args{
		"trb_request_ids": pq.Array(trbRequestIDs),
		"eua_user_ids":    pq.Array(euaIDs),
	})

	if err != nil {
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch TRB attendees by EUA and TRB IDs",
			zap.Error(err),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.TRBRequestAttendee{},
			Operation: apperrors.QueryFetch,
		}
	}
	return attendees, nil
}
