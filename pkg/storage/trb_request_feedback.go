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
func (s *Store) CreateTRBRequestFeedback(ctx context.Context, feedback *models.TRBRequestFeedback, formToUpdate *models.TRBRequestForm) (*models.TRBRequestFeedback, error) {
	tx := s.db.MustBegin()
	defer tx.Rollback()

	if feedback.ID == uuid.Nil {
		feedback.ID = uuid.New()
	}

	stmt, err := tx.PrepareNamed(`
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
		RETURNING *;
	`)

	createdFeedback := models.TRBRequestFeedback{}
	err = stmt.Get(&createdFeedback, feedback)

	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to create TRB feedback with error %s", err),
			zap.String("user", feedback.CreatedBy),
		)
		return nil, err
	}

	// If the feedback requests edits, update the form status to "in progress"
	if formToUpdate != nil {
		formStmt, err := tx.PrepareNamed(`
			UPDATE trb_request_forms
			SET
				status = :status,
				modified_by = :modified_by,
				modified_at = CURRENT_TIMESTAMP
			WHERE trb_request_id = :trb_request_id
			RETURNING *;
		`)

		updatedForm := models.TRBRequestForm{}
		err = formStmt.Get(&updatedForm, formToUpdate)

		if err != nil {
			appcontext.ZLogger(ctx).Error(
				fmt.Sprintf("Failed to update TRB request form when creating TRB request feedback, with error %s", err),
				zap.String("user", formToUpdate.CreatedBy),
			)
			return nil, err
		}
	}
	err = tx.Commit()

	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to create TRB request with error %s", zap.Error(err))
		return nil, err
	}

	return &createdFeedback, nil
}

// GetTRBRequestFeedbackByTRBRequestID queries the DB for all the TRB request feedback records
// matching the given TRB request ID
func (s *Store) GetTRBRequestFeedbackByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) ([]*models.TRBRequestFeedback, error) {
	results := []*models.TRBRequestFeedback{}

	err := s.db.Select(&results, `SELECT * FROM trb_request_feedback WHERE trb_request_id = $1`, trbRequestID)

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

// GetNewestTRBRequestFeedbackByTRBRequestID queries the DB for all the TRB request feedback records
// matching the given TRB request ID
func (s *Store) GetNewestTRBRequestFeedbackByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) (*models.TRBRequestFeedback, error) {
	feedback := models.TRBRequestFeedback{}
	stmt, err := s.db.PrepareNamed(`
		SELECT *
		FROM trb_request_feedback
		WHERE trb_request_id = :trb_request_id
		ORDER BY created_at DESC LIMIT 1
	`)

	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{"trb_request_id": trbRequestID}
	err = stmt.Get(&feedback, arg)

	hasFeedback := true
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			hasFeedback = false
		} else {
			appcontext.ZLogger(ctx).Error(
				"Failed to fetch latest TRB request feedback",
				zap.Error(err),
				zap.String("trbRequestID", trbRequestID.String()),
			)
			return nil, &apperrors.QueryError{
				Err:       err,
				Model:     feedback,
				Operation: apperrors.QueryFetch,
			}
		}
	}

	// If no rows, return nil
	var feedbackPtr *models.TRBRequestFeedback
	if hasFeedback {
		feedbackPtr = &feedback
	} else {
		feedbackPtr = nil
	}
	return feedbackPtr, err
}
