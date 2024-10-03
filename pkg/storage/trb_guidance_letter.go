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

// CreateTRBGuidanceLetter creates a guidance letter for a TRB request, in the "In Progress" status
func (s *Store) CreateTRBGuidanceLetter(ctx context.Context, createdBy string, trbRequestID uuid.UUID) (*models.TRBGuidanceLetter, error) {
	guidanceLetter := models.TRBGuidanceLetter{
		TRBRequestID: trbRequestID,
		Status:       models.TRBGuidanceLetterStatusInProgress,
	}
	guidanceLetter.ID = uuid.New()
	guidanceLetter.CreatedBy = createdBy

	const trbGuidanceLetterCreateSQL = `
		INSERT INTO trb_guidance_letters (
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
	stmt, err := s.db.PrepareNamed(trbGuidanceLetterCreateSQL)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to prepare SQL statement for creating TRB guidance letter with error %s", err),
			zap.Error(err),
			zap.String("user", createdBy),
		)
		return nil, err
	}
	defer stmt.Close()

	retLetter := models.TRBGuidanceLetter{}

	err = stmt.Get(&retLetter, guidanceLetter)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to create TRB guidance letter with error %s", err),
			zap.Error(err),
			zap.String("user", createdBy),
		)
		return nil, err
	}

	return &retLetter, nil
}

// UpdateTRBGuidanceLetterStatus sets the status of a TRB guidance letter, for setting the letter as ready to review or sending the letter.
// When it sends the letter, it also updates the DateSent field.
func (s *Store) UpdateTRBGuidanceLetterStatus(ctx context.Context, id uuid.UUID, status models.TRBGuidanceLetterStatus) (*models.TRBGuidanceLetter, error) {
	const trbGuidanceLetterStatusUpdateSQL = `
	UPDATE trb_guidance_letters
	SET
		status = :status,
		date_sent = :date_sent,
		modified_by = :modified_by,
		modified_at = CURRENT_TIMESTAMP
	WHERE id = :id
	RETURNING *;
	`

	stmt, err := s.db.PrepareNamed(trbGuidanceLetterStatusUpdateSQL)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to prepare SQL statement for updating TRB guidance letter status with error %s", err),
			zap.Error(err),
			zap.String("id", id.String()),
			zap.String("status", string(status)),
		)
		return nil, err
	}
	defer stmt.Close()

	updated := models.TRBGuidanceLetter{}
	arg := map[string]interface{}{
		"id":          id,
		"status":      status,
		"modified_by": appcontext.Principal(ctx).ID(),
	}

	if status == models.TRBGuidanceLetterStatusCompleted {
		arg["date_sent"] = time.Now()
	} else {
		arg["date_sent"] = nil // need this to avoid errors from the ":date_sent" parameter being absent in the SQL statement
	}

	err = stmt.Get(&updated, arg)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to update TRB guidance letter status with error %s", err),
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

// UpdateTRBGuidanceLetter updates all of a TRB guidance letter's mutable fields.
// The letter's status _can_ be set, though UpdateTRBGuidanceLetterStatus() should be used when setting a letter ready for review or sending a letter.
func (s *Store) UpdateTRBGuidanceLetter(ctx context.Context, letter *models.TRBGuidanceLetter) (*models.TRBGuidanceLetter, error) {
	const trbGuidanceLetterUpdateSQL = `
		UPDATE trb_guidance_letters
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

	stmt, err := s.db.PrepareNamed(trbGuidanceLetterUpdateSQL)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to prepare SQL statement for updating TRB guidance letter with error %s", err),
			zap.Error(err),
			zap.String("id", letter.ID.String()),
		)
		return nil, err
	}
	defer stmt.Close()

	updated := models.TRBGuidanceLetter{}

	err = stmt.Get(&updated, letter)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to update TRB guidance letter with error %s", err),
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

// GetTRBGuidanceLetterByTRBRequestID fetches a TRB guidance letter record by its associated request's ID
func (s *Store) GetTRBGuidanceLetterByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) (*models.TRBGuidanceLetter, error) {
	letter := models.TRBGuidanceLetter{}

	err := namedGet(ctx, s, &letter, sqlqueries.TRBRequestGuidanceLetter.GetByTRBID, args{
		"trb_request_id": trbRequestID,
	})

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}

		appcontext.ZLogger(ctx).Error(
			"Failed to fetch TRB guidance letter",
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

// GetTRBGuidanceLettersByTRBRequestIDs fetches a TRB guidance letter records by associated request IDs
func (s *Store) GetTRBGuidanceLettersByTRBRequestIDs(ctx context.Context, trbRequestIDs []uuid.UUID) ([]*models.TRBGuidanceLetter, error) {
	letters := []*models.TRBGuidanceLetter{}

	err := namedSelect(ctx, s, &letters, sqlqueries.TRBRequestGuidanceLetter.GetByTRBIDs, args{
		"trb_request_ids": pq.Array(trbRequestIDs),
	})

	if err != nil {
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch TRB guidance letters",
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
