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

// CreateTRBRequestFeedback creates a new TRB request feedback record in the database
func (s *Store) CreateTRBRequestFeedback(ctx context.Context, feedback *models.TRBRequestFeedback) (*models.TRBRequestFeedback, error) {
	feedback.ID = uuid.New()
	stmt, err := s.db.PrepareNamed(`
		INSERT INTO trb_request_feedback (
			id,
			trb_request_id,
			feedback_message,
			copy_trb_mailbox,
			notify_eua_ids,
			action,
			created_by,
			modified_by
		)
		VALUES (
			:id,
			:trb_request_id,
			:feedback_message,
			:copy_trb_mailbox,
			:notify_eua_ids,
			:action,
			:created_by,
			:modified_by
		)
		RETURNING *;`)

	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to create TRB request feedback %s", err),
			zap.String("id", feedback.ID.String()),
		)
		return nil, err
	}

	created := models.TRBRequestFeedback{}
	err = stmt.Get(&created, feedback)

	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to create TRB request feedback with error %s", zap.Error(err))
		return nil, err
	}
	return &created, nil
}

// GetTRBRequestFeedbackByTRBRequestID queries the DB for all the TRB request feedback records
// matching the given TRB request ID
func (s *Store) GetTRBRequestFeedbackByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) ([]*models.TRBRequestFeedback, error) {
	results := []*models.TRBRequestFeedback{}

	err := s.db.Select(&results, `SELECT * FROM trb_request_feedback WHERE trb_request_id=$1`, trbRequestID)

	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		appcontext.ZLogger(ctx).Error("Failed to fetch TRB request feedback", zap.Error(err), zap.String("id", trbRequestID.String()))
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.TRBRequestFeedback{},
			Operation: apperrors.QueryFetch,
		}
	}
	return results, nil
}
