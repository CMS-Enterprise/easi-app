package storage

import (
	"context"
	"database/sql"
	"errors"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// CreateGRTFeedback creates a new GRT Feedback object in the database
func (s *Store) CreateGRTFeedback(ctx context.Context, grtFeedback *models.GRTFeedback) (*models.GRTFeedback, error) {
	grtFeedback.ID = uuid.New()
	createAt := s.clock.Now()
	grtFeedback.CreatedAt = &createAt
	grtFeedback.UpdatedAt = &createAt
	const createGRTFeedbackSQL = `
		INSERT INTO grt_feedback (
			id,
		    intake_id,
		    feedback_type,
			feedback,
			created_at,
			updated_at
		)
		VALUES (
			:id,
			:intake_id,
			:feedback_type,
			:feedback,
		    :created_at,
			:updated_at
		)`
	_, err := s.db.NamedExecContext(
		ctx,
		createGRTFeedbackSQL,
		grtFeedback,
	)
	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to create GRT Feedback with error %s", zap.Error(err))
		return nil, err
	}
	return s.FetchGRTFeedbackByID(ctx, grtFeedback.ID)
}

// FetchGRTFeedbackByID queries the DB for GRT Feedback matching the given ID
func (s *Store) FetchGRTFeedbackByID(ctx context.Context, id uuid.UUID) (*models.GRTFeedback, error) {
	grtFeedback := models.GRTFeedback{}

	err := s.db.GetContext(ctx, &grtFeedback, `SELECT * FROM grt_feedback WHERE id=$1`, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &apperrors.ResourceNotFoundError{Err: err, Resource: models.SystemIntake{}}
		}
		appcontext.ZLogger(ctx).Error("Failed to fetch GRT Feedback", zap.Error(err), zap.String("id", id.String()))
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     id,
			Operation: apperrors.QueryFetch,
		}
	}

	return &grtFeedback, nil
}

// FetchGRTFeedbacksByIntakeID gets all GRT Feedback with a given Intake ID
func (s *Store) FetchGRTFeedbacksByIntakeID(ctx context.Context, intakeID uuid.UUID) ([]*models.GRTFeedback, error) {
	grtFeedbacks := []*models.GRTFeedback{}

	err := s.db.GetContext(ctx, &grtFeedbacks, `SELECT * FROM grt_feedback WHERE intake_id=$1 ORDER BY created_at`, intakeID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return grtFeedbacks, nil
		}
		appcontext.ZLogger(ctx).Error("Failed to fetch GRT Feedbacks", zap.Error(err), zap.String("intake id", intakeID.String()))
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     intakeID,
			Operation: apperrors.QueryFetch,
		}
	}

	return grtFeedbacks, nil
}
