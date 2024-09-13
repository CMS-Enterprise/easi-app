package storage

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"

	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlqueries"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
)

// CreateTRBRequestFeedback creates a new TRB request feedback record in the database
func (s *Store) CreateTRBRequestFeedback(ctx context.Context, feedback *models.TRBRequestFeedback, formToUpdate *models.TRBRequestForm) (*models.TRBRequestFeedback, error) {
	return sqlutils.WithTransactionRet[*models.TRBRequestFeedback](ctx, s.DB, func(tx *sqlx.Tx) (*models.TRBRequestFeedback, error) {
		if feedback.ID == uuid.Nil {
			feedback.ID = uuid.New()
		}
		if feedback.CreatedAt.IsZero() {
			feedback.CreatedAt = time.Now()
		}

		stmt, err := tx.PrepareNamed(`
		INSERT INTO trb_request_feedback (
			id,
			trb_request_id,
			feedback_message,
			copy_trb_mailbox,
			notify_eua_ids,
			action,
			created_at,
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
			:created_at,
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

	err := namedSelect(ctx, s.DB, &results, sqlqueries.TRBRequestFeedback.GetByID, args{
		"trb_request_id": trbRequestID,
	})

	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to fetch TRB request feedback by ID", zap.Error(err), zap.String("id", trbRequestID.String()))
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.TRBRequestFeedback{},
			Operation: apperrors.QueryFetch,
		}
	}
	return results, nil
}

// GetTRBRequestFeedbackByTRBRequestIDs queries the DB for all the TRB request feedback records
// matching the given TRB request IDs
func (s *Store) GetTRBRequestFeedbackByTRBRequestIDs(ctx context.Context, trbRequestIDs []uuid.UUID) ([]*models.TRBRequestFeedback, error) {
	results := []*models.TRBRequestFeedback{}

	err := namedSelect(ctx, s.DB, &results, sqlqueries.TRBRequestFeedback.GetByIDs, args{
		"trb_request_ids": pq.Array(trbRequestIDs),
	})

	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to fetch TRB request feedback by IDs", zap.Error(err))
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
	err := namedGet(ctx, s.DB, &feedback, sqlqueries.TRBRequestFeedback.GetByNewestByID, args{
		"trb_request_id": trbRequestID,
	})

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
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
	return &feedback, nil
}

// GetNewestTRBRequestFeedbackByTRBRequestIDs queries the DB the newest TRB request feedback records
// matching the given TRB request IDs
func (s *Store) GetNewestTRBRequestFeedbackByTRBRequestIDs(ctx context.Context, trbRequestIDs []uuid.UUID) ([]*models.TRBRequestFeedback, error) {
	feedback := []*models.TRBRequestFeedback{}
	err := namedSelect(ctx, s.DB, &feedback, sqlqueries.TRBRequestFeedback.GetByNewestsByIDs, args{
		"trb_request_ids": pq.Array(trbRequestIDs),
	})

	if err != nil {
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch latest TRB request feedback by IDs",
			zap.Error(err),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     feedback,
			Operation: apperrors.QueryFetch,
		}
	}
	return feedback, nil
}
