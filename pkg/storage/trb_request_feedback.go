package storage

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/sqlutils"
)

// CreateTRBRequestFeedback creates a new TRB request feedback record in the database
func (s *Store) CreateTRBRequestFeedback(ctx context.Context, feedback *models.TRBRequestFeedback, formToUpdate *models.TRBRequestForm) (*models.TRBRequestFeedback, error) {
	return sqlutils.WithTransactionRet[models.TRBRequestFeedback](s.db, func(tx *sqlx.Tx) (*models.TRBRequestFeedback, error) {
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
		RETURNING *;`)
		if err != nil {
			appcontext.ZLogger(ctx).Error(
				fmt.Sprintf("Failed to create TRB feedback with error %s", err),
				zap.String("user", feedback.CreatedBy),
			)
			return nil, err
		}
		defer stmt.Close()

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
			formStmt, formErr := tx.PrepareNamed(`
			UPDATE trb_request_forms
			SET
				status = :status,
				modified_by = :modified_by,
				modified_at = CURRENT_TIMESTAMP
			WHERE trb_request_id = :trb_request_id
			RETURNING *;`)
			if formErr != nil {
				appcontext.ZLogger(ctx).Error(
					fmt.Sprintf("Failed to update TRB request form when creating TRB request feedback, with error %s", err),
					zap.String("user", formToUpdate.CreatedBy),
				)
				return nil, formErr
			}
			defer formStmt.Close()

			updatedForm := models.TRBRequestForm{}
			formErr = formStmt.Get(&updatedForm, formToUpdate)

			if formErr != nil {
				appcontext.ZLogger(ctx).Error(
					fmt.Sprintf("Failed to update TRB request form when creating TRB request feedback, with error %s", err),
					zap.String("user", formToUpdate.CreatedBy),
				)
				return nil, formErr
			}
		}

		return &createdFeedback, nil
	})
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

// GetNewestTRBRequestFeedbackByTRBRequestID queries the DB the newest TRB request feedback record
// matching the given TRB request ID
func (s *Store) GetNewestTRBRequestFeedbackByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) (*models.TRBRequestFeedback, error) {
	feedback := models.TRBRequestFeedback{}
	stmt, err := s.db.PrepareNamed(`
		SELECT *
		FROM trb_request_feedback
		WHERE trb_request_id = :trb_request_id
		ORDER BY created_at DESC LIMIT 1`)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch latest TRB request feedback",
			zap.Error(err),
			zap.String("trbRequestID", trbRequestID.String()),
		)
		return nil, err
	}
	defer stmt.Close()

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
	return feedbackPtr, nil
}
