package storage

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlqueries"
)

// CreateTRBAdviceLetter creates an advice letter for a TRB request, in the "In Progress" status
func (s *Store) CreateTRBAdviceLetter(ctx context.Context, createdBy string, trbRequestID uuid.UUID) (*models.TRBAdviceLetter, error) {
	adviceLetter := models.TRBAdviceLetter{
		TRBRequestID: trbRequestID,
		Status:       models.TRBAdviceLetterStatusInProgress,
	}
	adviceLetter.ID = uuid.New()
	adviceLetter.CreatedBy = createdBy

	const trbAdviceLetterCreateSQL = `
		INSERT INTO trb_advice_letters (
			id,
			trb_request_id,
			created_by,
			status
		) VALUES (
			:id,
			:trb_request_id,
			:created_by,
			:status
		) RETURNING *;
	`
	stmt, err := s.db.PrepareNamed(trbAdviceLetterCreateSQL)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to prepare SQL statement for creating TRB advice letter with error %s", err),
			zap.Error(err),
			zap.String("user", createdBy),
		)
		return nil, err
	}
	defer stmt.Close()

	retLetter := models.TRBAdviceLetter{}

	err = stmt.Get(&retLetter, adviceLetter)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to create TRB advice letter with error %s", err),
			zap.Error(err),
			zap.String("user", createdBy),
		)
		return nil, err
	}

	return &retLetter, nil
}

// UpdateTRBAdviceLetterStatus sets the status of a TRB advice letter, for setting the letter as ready to review or sending the letter.
// When it sends the letter, it also updates the DateSent field.
func (s *Store) UpdateTRBAdviceLetterStatus(ctx context.Context, id uuid.UUID, status models.TRBAdviceLetterStatus) (*models.TRBAdviceLetter, error) {
	const trbAdviceLetterStatusUpdateSQL = `
	UPDATE trb_advice_letters
	SET
		status = :status,
		date_sent = :date_sent,
		modified_by = :modified_by,
		modified_at = CURRENT_TIMESTAMP
	WHERE id = :id
	RETURNING *;
	`

	stmt, err := s.db.PrepareNamed(trbAdviceLetterStatusUpdateSQL)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to prepare SQL statement for updating TRB advice letter status with error %s", err),
			zap.Error(err),
			zap.String("id", id.String()),
			zap.String("status", string(status)),
		)
		return nil, err
	}
	defer stmt.Close()

	updated := models.TRBAdviceLetter{}
	arg := map[string]interface{}{
		"id":          id,
		"status":      status,
		"modified_by": appcontext.Principal(ctx).ID(),
	}

	if status == models.TRBAdviceLetterStatusCompleted {
		arg["date_sent"] = time.Now()
	} else {
		arg["date_sent"] = nil // need this to avoid errors from the ":date_sent" parameter being absent in the SQL statement
	}

	err = stmt.Get(&updated, arg)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to update TRB advice letter status with error %s", err),
			zap.String("id", id.String()),
			zap.String("status", string(status)),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     updated,
			Operation: apperrors.QueryUpdate,
		}
	}

	return &updated, nil
}

// UpdateTRBAdviceLetter updates all of a TRB advice letter's mutable fields.
// The letter's status _can_ be set, though UpdateTRBAdviceLetterStatus() should be used when setting a letter ready for review or sending a letter.
func (s *Store) UpdateTRBAdviceLetter(ctx context.Context, letter *models.TRBAdviceLetter) (*models.TRBAdviceLetter, error) {
	const trbAdviceLetterUpdateSQL = `
		UPDATE trb_advice_letters
		SET
			trb_request_id = :trb_request_id,
			status = :status,
			meeting_summary = :meeting_summary,
			next_steps = :next_steps,
			is_followup_recommended = :is_followup_recommended,
			date_sent = :date_sent,
			followup_point = :followup_point,
			modified_by = :modified_by,
			modified_at = CURRENT_TIMESTAMP
		WHERE id = :id
		RETURNING *;
	`

	stmt, err := s.db.PrepareNamed(trbAdviceLetterUpdateSQL)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to prepare SQL statement for updating TRB advice letter with error %s", err),
			zap.Error(err),
			zap.String("id", letter.ID.String()),
		)
		return nil, err
	}
	defer stmt.Close()

	updated := models.TRBAdviceLetter{}

	err = stmt.Get(&updated, letter)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to update TRB advice letter with error %s", err),
			zap.String("id", letter.ID.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     letter,
			Operation: apperrors.QueryUpdate,
		}
	}

	return &updated, nil
}

// GetTRBAdviceLetterByTRBRequestID fetches a TRB advice letter record by its associated request's ID
func (s *Store) GetTRBAdviceLetterByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) (*models.TRBAdviceLetter, error) {
	letter := models.TRBAdviceLetter{}

	err := namedGet(ctx, s, &letter, sqlqueries.TRBRequestAdviceLetter.GetByTRBID, args{
		"trb_request_id": trbRequestID,
	})

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}

		appcontext.ZLogger(ctx).Error(
			"Failed to fetch TRB advice letter",
			zap.Error(err),
			zap.String("trbRequestID", trbRequestID.String()),
		)

		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     letter,
			Operation: apperrors.QueryFetch,
		}
	}

	return &letter, nil
}

// GetTRBAdviceLettersByTRBRequestIDs fetches a TRB advice letter records by associated request IDs
func (s *Store) GetTRBAdviceLettersByTRBRequestIDs(ctx context.Context, trbRequestIDs []uuid.UUID) ([]*models.TRBAdviceLetter, error) {
	letters := []*models.TRBAdviceLetter{}

	err := namedSelect(ctx, s, &letters, sqlqueries.TRBRequestAdviceLetter.GetByTRBIDs, args{
		"trb_request_ids": pq.Array(trbRequestIDs),
	})

	if err != nil {
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch TRB advice letters",
			zap.Error(err),
		)

		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     letters,
			Operation: apperrors.QueryFetch,
		}
	}

	return letters, nil
}
