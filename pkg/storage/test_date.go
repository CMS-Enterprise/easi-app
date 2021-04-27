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

// CreateTestDate creates a new Test Date object in the database
func (s *Store) CreateTestDate(ctx context.Context, testDate *models.TestDate) (*models.TestDate, error) {
	testDate.ID = uuid.New()
	createAt := s.clock.Now()
	testDate.CreatedAt = &createAt
	testDate.UpdatedAt = &createAt
	const createTestDateSQL = `
		INSERT INTO test_dates (
			id,
		    request_id,
			test_type,
		    date,
		    score,
			created_at,
			updated_at
		)
		VALUES (
			:id,
			:request_id,
			:test_type,
			:date,
			:score,
		    :created_at,
			:updated_at
		)`
	_, err := s.db.NamedExecContext(
		ctx,
		createTestDateSQL,
		testDate,
	)
	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to create test date with error %s", zap.Error(err))
		return nil, err
	}
	return s.FetchTestDateByID(ctx, testDate.ID)
}

// FetchTestDateByID queries the DB for a test date matching the given ID
func (s *Store) FetchTestDateByID(ctx context.Context, id uuid.UUID) (*models.TestDate, error) {
	testDate := models.TestDate{}

	err := s.db.GetContext(ctx, &testDate, `SELECT * FROM test_dates WHERE id=$1 AND deleted_at IS NULL`, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &apperrors.ResourceNotFoundError{Err: err, Resource: models.SystemIntake{}}
		}
		appcontext.ZLogger(ctx).Error("Failed to fetch test date", zap.Error(err), zap.String("id", id.String()))
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     id,
			Operation: apperrors.QueryFetch,
		}
	}

	return &testDate, nil
}

// FetchTestDatesByRequestID queries the DB for all the test dates matching the given AccessibilityRequest ID
func (s *Store) FetchTestDatesByRequestID(ctx context.Context, requestID uuid.UUID) ([]*models.TestDate, error) {
	results := []*models.TestDate{}

	err := s.db.SelectContext(ctx, &results, `SELECT * FROM test_dates WHERE request_id=$1 AND deleted_at IS NULL`, requestID)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		appcontext.ZLogger(ctx).Error("Failed to fetch test dates", zap.Error(err), zap.String("requestID", requestID.String()))
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.TestDate{},
			Operation: apperrors.QueryFetch,
		}
	}
	return results, nil
}

// UpdateTestDate updates an existing Test Date object in the database
func (s *Store) UpdateTestDate(ctx context.Context, testDate *models.TestDate) (*models.TestDate, error) {
	updatedAt := s.clock.Now()
	testDate.UpdatedAt = &updatedAt
	const createTestDateSQL = `
		UPDATE test_dates
		SET
			test_type = :test_type,
		    date = :date,
		    score = :score,
			updated_at = :updated_at
		WHERE test_dates.id = :id`
	_, err := s.db.NamedExecContext(
		ctx,
		createTestDateSQL,
		testDate,
	)
	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to update test date with error %s", zap.Error(err))
		return nil, err
	}
	return s.FetchTestDateByID(ctx, testDate.ID)
}
