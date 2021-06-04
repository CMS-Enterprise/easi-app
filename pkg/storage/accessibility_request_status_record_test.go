package storage

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (s StoreTestSuite) TestCreateAccessibilityRequestStatusRecord() {
	ctx := context.Background()
	// Call the create and ensure that a record was returned
	s.Run("create an accessibility request status record succeeds", func() {
		requestID := uuid.New()
		statusRecord := models.AccessibilityRequestStatusRecord{
			Status:    models.AccessibilityRequestStatusOpen,
			RequestID: requestID,
		}

		returnedRecord, err := s.store.CreateAccessibilityRequestStatusRecord(ctx, &statusRecord)
		s.NoError(err)
		s.Equal(statusRecord.Status, returnedRecord.Status)
		// fetch latest RequestStatusRecord with the requestID
		var storedRecord models.AccessibilityRequestStatusRecord
		err = s.db.Get(
			&storedRecord, "SELECT * FROM accessibility_request_status_record WHERE request_id=$1 ORDER BY created_at DESC LIMIT 1;",
			requestID,
		)
		s.NoError(err)
		s.Equal(statusRecord.Status, storedRecord.Status)
	})
	// Call the create with an error and make sure that an error was returned
	s.Run("create an accessibility request status record fails", func() {

	})
}
