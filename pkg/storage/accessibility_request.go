package storage

import (
	"context"
	"database/sql"
	"errors"
	"time"

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

	err := s.db.Get(&request, `SELECT * FROM accessibility_requests WHERE id=$1 AND deleted_at IS NULL`, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &apperrors.ResourceNotFoundError{Err: err, Resource: models.AccessibilityRequest{}}
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

// FetchAccessibilityRequestByIDIncludingDeleted queries the DB for an accessibility matching the given ID
func (s *Store) FetchAccessibilityRequestByIDIncludingDeleted(ctx context.Context, id uuid.UUID) (*models.AccessibilityRequest, error) {
	request := models.AccessibilityRequest{}

	err := s.db.Get(&request, `SELECT * FROM accessibility_requests WHERE id=$1`, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &apperrors.ResourceNotFoundError{Err: err, Resource: models.AccessibilityRequest{}}
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

// FetchAccessibilityRequests queries the DB for accessibility requests.
// TODO implement cursor pagination
func (s *Store) FetchAccessibilityRequests(ctx context.Context) ([]models.AccessibilityRequest, error) {
	requests := []models.AccessibilityRequest{}

	err := s.db.Select(&requests, `SELECT * FROM accessibility_requests WHERE deleted_at IS NULL`)
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

// DeleteAccessibilityRequest marks an accessibility request as deleted
func (s *Store) DeleteAccessibilityRequest(_ context.Context, id uuid.UUID, reason models.AccessibilityRequestDeletionReason) error {
	const archiveAccessibilityRequestSQL = `UPDATE accessibility_requests
		SET deleted_at = $1, deletion_reason = $2
		WHERE id = $3
`
	_, err := s.db.Exec(archiveAccessibilityRequestSQL, time.Now().UTC(), reason, id)
	return err
}

// CreateAccessibilityRequestAndInitialStatusRecord creates the new request and sets the status to OPEN
func (s *Store) CreateAccessibilityRequestAndInitialStatusRecord(ctx context.Context, request *models.AccessibilityRequest) (*models.AccessibilityRequest, error) {
	createdRequest, err := s.CreateAccessibilityRequest(ctx, request)
	if err != nil {
		return nil, err
	}

	_, err = s.CreateAccessibilityRequestStatusRecord(ctx, &models.AccessibilityRequestStatusRecord{
		RequestID: createdRequest.ID,
		Status:    models.AccessibilityRequestStatusOpen,
		EUAUserID: createdRequest.EUAUserID,
	})
	if err != nil {
		return nil, err
	}

	return createdRequest, nil
}

// FetchAccessibilityRequestMetrics gets a metrics digest for 508 requests
func (s *Store) FetchAccessibilityRequestMetrics(_ context.Context, startTime time.Time, endTime time.Time) (models.AccessibilityRequestMetrics, error) {
	type createdQueryResponse struct {
		CreatedAndOpenCount          int `db:"created_and_open_count"`
		CreatedAndClosedCount        int `db:"created_and_closed_count"`
		CreatedAndInRemediationCount int `db:"created_and_in_remediation_count"`
	}
	const startedCountSQL = `
		SELECT
 			COUNT(*) FILTER (WHERE status = 'OPEN') AS created_and_open_count,
 			COUNT(*) FILTER (WHERE status = 'CLOSED') AS created_and_closed_count,
 			COUNT(*) FILTER (WHERE status = 'IN_REMEDIATION') AS created_and_in_remediation_count
 		FROM (
			SELECT DISTINCT ON (request_id) request_id, status, created_at FROM accessibility_request_status_records
			WHERE request_id IN (
				SELECT id FROM accessibility_requests
				WHERE created_at >= $1 AND created_at < $2
			)
			ORDER BY request_id, created_at DESC
		) requests;
	`

	metrics := models.AccessibilityRequestMetrics{}

	var createdResponse createdQueryResponse
	err := s.db.Get(
		&createdResponse,
		startedCountSQL,
		&startTime,
		&endTime,
	)
	if err != nil {
		return metrics, err
	}
	metrics.CreatedAndOpen = createdResponse.CreatedAndOpenCount
	metrics.CreatedAndClosed = createdResponse.CreatedAndClosedCount
	metrics.CreatedAndInRemediation = createdResponse.CreatedAndInRemediationCount

	return metrics, nil
}

// FetchAccessibilityMetrics fetches data about accessibility requests
func (s *Store) FetchAccessibilityMetrics() ([]models.AccessibilityMetricsLine, error) {
	const accessibilityMetricsSQL = `
		SELECT aras.name, si.lcid, aras.status, aras.created_at, aras.status_created_at
		FROM accessibility_requests_and_statuses aras
		JOIN system_intakes si on aras.intake_id=si.id`

	var metrics []models.AccessibilityMetricsLine
	err := s.db.Select(&metrics, accessibilityMetricsSQL)

	return metrics, err
}
