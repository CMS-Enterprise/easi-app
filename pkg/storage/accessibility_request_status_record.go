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
				status
			)
			VALUES (
				:id,
				:request_id,
				:status
			)`
	_, err := s.db.NamedExec(
		createStatusRecordSQL,
		statusRecord,
	)
	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to create accessibility request", zap.Error(err))
		return nil, err
	}
	return statusRecord, nil
}
