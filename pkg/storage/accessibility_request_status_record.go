package storage

import (
	"context"
	"errors"

	"go.uber.org/zap"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

// CreateAccessibilityRequestStatusRecord creates a status record for a given accessibility request
func (s *Store) CreateAccessibilityRequestStatusRecord(ctx context.Context, statusRecord *models.AccessibilityRequestStatusRecord) (*models.AccessibilityRequestStatusRecord, error) {
	if statusRecord.RequestID == uuid.Nil {
		return nil, errors.New("must include accessibility request id")
	}

	if statusRecord.Status == "" {
		statusRecord.Status = models.AccessibilityRequestStatusOpen
	}

	statusRecord.ID = uuid.New()

	const createStatusRecordSQL = `
			INSERT INTO accessibility_request_status_records (
				id,
				request_id,
				status,
				eua_user_id
			)
			VALUES (
				:id,
				:request_id,
				:status,
				:eua_user_id
			)`
	_, err := s.db.NamedExec(
		createStatusRecordSQL,
		statusRecord,
	)
	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to create accessibility request status record", zap.Error(err))
		return nil, err
	}
	return statusRecord, nil
}

// FetchLatestAccessibilityRequestStatusRecordByRequestID fetches the most recent status record for a given accessibilityRequest
func (s *Store) FetchLatestAccessibilityRequestStatusRecordByRequestID(ctx context.Context, accessibilityRequestID uuid.UUID) (*models.AccessibilityRequestStatusRecord, error) {
	var statusRecord models.AccessibilityRequestStatusRecord
	err := s.db.Get(
		&statusRecord, "SELECT * FROM accessibility_request_status_records WHERE request_id=$1 ORDER BY created_at DESC LIMIT 1;",
		accessibilityRequestID,
	)
	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to fetch accessibility request status record", zap.Error(err))
		return nil, err
	}
	return &statusRecord, nil
}
