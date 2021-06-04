package storage

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
)

// CreateAccessibilityRequestStatusRecord creates a status record for a given accessibility request
func (s *Store) CreateAccessibilityRequestStatusRecord(ctx context.Context, statusRecord *models.AccessibilityRequestStatusRecord) (*models.AccessibilityRequestStatusRecord, error) {
	if statusRecord.ID == uuid.Nil {
		statusRecord.ID = uuid.New()
	}
	createdAt := s.clock.Now()
	if statusRecord.CreatedAt == nil {
		statusRecord.CreatedAt = &createdAt
	}

	//if statusRecord.Status
	//const createStatusRecordSQL = `
	//		INSERT INTO accessibility_request_status_records (
	//			id,
	//			request_id,
	//			status,
	//			created_at,
	//		)
	//		VALUES (
	//			:id,
	//			:request_id,
	//			:status,
	//		    :created_at,
	//		)`
	//	_, err := s.db.NamedExec(
	//		createStatusRecordSQL,
	//		statusRecord,
	//	)
	//	if err != nil {
	//		appcontext.ZLogger(ctx).Error("Failed to create accessibility request", zap.Error(err))
	//		return nil, err
	//	}
	//return s.FetchAccessibilityRequestStatusRecordByID(ctx, statusRecord.ID)
	return statusRecord, nil
}
