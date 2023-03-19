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

// CreateTRBRequestLCID creates a new TRB request LCID record in the database
func (s *Store) CreateTRBRequestLCID(ctx context.Context, lcid *models.TRBRequestLCID) (*models.TRBRequestLCID, error) {
	lcid.ID = uuid.New()
	stmt, err := s.db.PrepareNamed(`
		INSERT INTO trb_request_lcids (
			id,
			trb_request_id,
			lcid,
			created_by,
			modified_by
		)
		VALUES (
			:id,
			:trb_request_id,
			:lcid,
			:created_by,
			:modified_by
		)
		RETURNING *;`)

	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to relate LCID to TRB request %s", err),
			zap.String("id", lcid.ID.String()),
		)
		return nil, err
	}

	created := models.TRBRequestLCID{}
	err = stmt.Get(&created, lcid)

	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to relate LCID to TRB request with error %s", zap.Error(err))
		return nil, err
	}
	return &created, nil
}

// GetTRBRequestLCIDsByTRBRequestID retrieves all LCIDs that have been related to a given TRB
// request ID
func (s *Store) GetTRBRequestLCIDsByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) ([]*models.TRBRequestLCID, error) {
	results := []*models.TRBRequestLCID{}

	err := s.db.Select(&results, `SELECT * FROM trb_request_lcids WHERE trb_request_id=$1`, trbRequestID)

	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		appcontext.ZLogger(ctx).Error("Failed to fetch TRB request lcids", zap.Error(err), zap.String("id", trbRequestID.String()))
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.TRBRequestLCID{},
			Operation: apperrors.QueryFetch,
		}
	}
	return results, nil
}

// DeleteTRBRequestLCID deletes an existing TRB request attendee record in the database
func (s *Store) DeleteTRBRequestLCID(ctx context.Context, trbRequestID uuid.UUID, lcid string) (*models.TRBRequestLCID, error) {
	toDelete := models.TRBRequestLCID{
		TRBRequestID: trbRequestID,
		LCID:         lcid,
	}
	deleted := models.TRBRequestLCID{}

	stmt, err := s.db.PrepareNamed(`
		DELETE FROM trb_request_lcids
		WHERE trb_request_id = :trb_request_id
		AND lcid = :lcid
		RETURNING *;`)

	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to delete TRB request LCID relationship %s", err),
			zap.String("trbRequestID", trbRequestID.String()),
			zap.String("lcid", lcid),
		)
		return nil, err
	}

	err = stmt.Get(&deleted, &toDelete)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to delete TRB request LCID relationship %s", err),
			zap.String("trbRequestID", trbRequestID.String()),
			zap.String("lcid", lcid),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     toDelete,
			Operation: apperrors.QueryUpdate,
		}
	}

	return &deleted, err
}
