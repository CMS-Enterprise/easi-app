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

// CreateAccessibilityRequest adds a new accessibility request in the database
func (s *Store) CreateAccessibilityRequest(ctx context.Context, request *models.AccessibilityRequest) (*models.AccessibilityRequest, error) {
	if request.ID == uuid.Nil {
		request.ID = uuid.New()
	}
	createAt := s.clock.Now()
	if request.CreatedAt == nil {
		request.CreatedAt = &createAt
	}
	if request.UpdatedAt == nil {
		request.UpdatedAt = &createAt
	}
	const createRequestSQL = `
		INSERT INTO accessibility_requests (
			id,
			name,
			intake_id,
			created_at,
			updated_at,
			eua_user_id
		)
		VALUES (
			:id,
			:name,
			:intake_id,
		    :created_at,
			:updated_at,
			:eua_user_id
		)`
	_, err := s.db.NamedExec(
		createRequestSQL,
		request,
	)
	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to create accessibility request", zap.Error(err))
		return nil, err
	}
	return s.FetchAccessibilityRequestByID(ctx, request.ID)
}

// FetchAccessibilityRequestByID queries the DB for an accessibility matching the given ID
func (s *Store) FetchAccessibilityRequestByID(ctx context.Context, id uuid.UUID) (*models.AccessibilityRequest, error) {
	request := models.AccessibilityRequest{}

	err := s.db.Get(&request, `SELECT * FROM accessibility_requests WHERE id=$1`, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &apperrors.ResourceNotFoundError{Err: err, Resource: models.SystemIntake{}}
		}
		appcontext.ZLogger(ctx).Error("Failed to fetch accessibility request", zap.Error(err), zap.String("id", id.String()))
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     id,
			Operation: apperrors.QueryFetch,
		}
	}

	return &request, nil
}

// FetchAccessibilityRequests queries the DB for an accessibility requests.
// TODO implement cursor pagination
func (s *Store) FetchAccessibilityRequests(ctx context.Context) ([]models.AccessibilityRequest, error) {
	requests := []models.AccessibilityRequest{}

	err := s.db.Select(&requests, `SELECT * FROM accessibility_requests`)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return requests, nil
		}
		appcontext.ZLogger(ctx).Error("Failed to fetch accessibility requests", zap.Error(err))
		return nil, &apperrors.QueryError{
			Err:       err,
			Operation: apperrors.QueryFetch,
		}
	}

	return requests, nil
}
