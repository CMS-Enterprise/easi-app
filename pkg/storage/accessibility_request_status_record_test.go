package storage

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/testhelpers"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (s StoreTestSuite) TestCreateAccessibilityRequestStatusRecord() {
	ctx := context.Background()
	intake := testhelpers.NewSystemIntake()
	_, err := s.store.CreateSystemIntake(ctx, &intake)
	s.NoError(err)

	accessibilityRequest := testhelpers.NewAccessibilityRequest(intake.ID)
	_, err = s.store.CreateAccessibilityRequest(ctx, &accessibilityRequest)
	s.NoError(err)

	s.Run("create an accessibility request status record succeeds", func() {

		statusRecord := models.AccessibilityRequestStatusRecord{
			Status:    models.AccessibilityRequestStatusOpen,
			RequestID: accessibilityRequest.ID,
			EUAUserID: "ASDF",
		}

		returnedRecord, err := s.store.CreateAccessibilityRequestStatusRecord(ctx, &statusRecord)
		s.NoError(err)
		s.Equal(statusRecord.Status, returnedRecord.Status)
		// fetch latest RequestStatusRecord with the requestID
		var storedRecord models.AccessibilityRequestStatusRecord
		err = s.db.Get(
			&storedRecord, "SELECT * FROM accessibility_request_status_records WHERE request_id=$1 ORDER BY created_at DESC LIMIT 1;",
			accessibilityRequest.ID,
		)
		s.NoError(err)
		s.Equal(statusRecord.Status, storedRecord.Status)
	})

	s.Run("create an accessibility request status record fails", func() {
		statusRecord := models.AccessibilityRequestStatusRecord{
			Status: models.AccessibilityRequestStatusOpen,
		}

		_, err := s.store.CreateAccessibilityRequestStatusRecord(ctx, &statusRecord)
		s.Equal("must include accessibility request id", err.Error())

	})
}

func (s StoreTestSuite) TestFetchLatestAccessibilityRequestStatusRecordByRequestID() {
	ctx := context.Background()

	intake := testhelpers.NewSystemIntake()
	_, err := s.store.CreateSystemIntake(ctx, &intake)
	s.NoError(err)

	accessibilityRequest := testhelpers.NewAccessibilityRequest(intake.ID)
	_, err = s.store.CreateAccessibilityRequest(ctx, &accessibilityRequest)
	s.NoError(err)

	newStatusRecord := models.AccessibilityRequestStatusRecord{
		Status:    models.AccessibilityRequestStatusClosed,
		RequestID: accessibilityRequest.ID,
		EUAUserID: "ASDF",
	}
	_, err = s.store.CreateAccessibilityRequestStatusRecord(ctx, &newStatusRecord)
	s.NoError(err)

	statusRecord, err := s.store.FetchLatestAccessibilityRequestStatusRecordByRequestID(ctx, accessibilityRequest.ID)
	s.NoError(err)
	s.Equal(newStatusRecord.Status, statusRecord.Status)
}
