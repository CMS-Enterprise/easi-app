package storage

import (
	"context"
	"time"

	"github.com/guregu/null"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/authentication"
	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func (s StoreTestSuite) TestMyRequests() {
	notRequesterID := "NOPE"
	requesterID := "BZOW"
	requester := &authentication.EUAPrincipal{EUAID: requesterID, JobCodeEASi: true}
	ctx := appcontext.WithPrincipal(context.Background(), requester)

	s.Run("returns only 508 and intake requests tied to the current user", func() {
		intake := testhelpers.NewSystemIntake()
		_, err := s.store.CreateSystemIntake(ctx, &intake)
		s.NoError(err)

		// add an accessbility request belonging to the user
		newRequest := testhelpers.NewAccessibilityRequestForUser(intake.ID, requesterID)
		createdAt, _ := time.Parse("2006-1-2", "2015-1-1")
		newRequest.CreatedAt = &createdAt
		newRequest.Name = "My Accessibility Request"
		accessibilityRequestThatIsMine, err := s.store.CreateAccessibilityRequest(ctx, &newRequest)
		s.NoError(err)

		// create status of open
		status := models.AccessibilityRequestStatusRecord{
			Status:    models.AccessibilityRequestStatusOpen,
			RequestID: accessibilityRequestThatIsMine.ID,
			EUAUserID: requesterID,
		}
		_, err = s.store.CreateAccessibilityRequestStatusRecord(ctx, &status)
		s.NoError(err)

		// set status to in remediation
		status = models.AccessibilityRequestStatusRecord{
			Status:    models.AccessibilityRequestStatusInRemediation,
			RequestID: accessibilityRequestThatIsMine.ID,
			EUAUserID: requesterID,
		}
		_, err = s.store.CreateAccessibilityRequestStatusRecord(ctx, &status)
		s.NoError(err)

		// set status back to open
		status = models.AccessibilityRequestStatusRecord{
			Status:    models.AccessibilityRequestStatusOpen,
			RequestID: accessibilityRequestThatIsMine.ID,
			EUAUserID: requesterID,
		}
		_, err = s.store.CreateAccessibilityRequestStatusRecord(ctx, &status)
		s.NoError(err)

		// add an accessbility request belonging to the user, and then delete it
		newRequest = testhelpers.NewAccessibilityRequestForUser(intake.ID, requesterID)
		createdAt, _ = time.Parse("2006-1-2", "2015-2-1")
		newRequest.CreatedAt = &createdAt
		createdRequest, err := s.store.CreateAccessibilityRequest(ctx, &newRequest)
		s.NoError(err)

		status = models.AccessibilityRequestStatusRecord{
			Status:    models.AccessibilityRequestStatusOpen,
			RequestID: createdRequest.ID,
			EUAUserID: requesterID,
		}
		_, err = s.store.CreateAccessibilityRequestStatusRecord(ctx, &status)
		s.NoError(err)

		err = s.store.DeleteAccessibilityRequest(ctx, createdRequest.ID, models.AccessibilityRequestDeletionReasonOther)
		s.NoError(err)

		status = models.AccessibilityRequestStatusRecord{
			Status:    models.AccessibilityRequestStatusClosed,
			RequestID: createdRequest.ID,
			EUAUserID: requesterID,
		}
		_, err = s.store.CreateAccessibilityRequestStatusRecord(ctx, &status)
		s.NoError(err)

		// add an accessbility request that does not belong to the user
		newRequest = testhelpers.NewAccessibilityRequestForUser(intake.ID, notRequesterID)
		createdAt, _ = time.Parse("2006-1-2", "2015-3-1")
		newRequest.CreatedAt = &createdAt
		otherRequest, err := s.store.CreateAccessibilityRequest(ctx, &newRequest)
		s.NoError(err)

		status = models.AccessibilityRequestStatusRecord{
			Status:    models.AccessibilityRequestStatusOpen,
			RequestID: otherRequest.ID,
			EUAUserID: requesterID,
		}
		_, err = s.store.CreateAccessibilityRequestStatusRecord(ctx, &status)
		s.NoError(err)

		// add an intake belonging to the user
		newIntake := testhelpers.NewSystemIntake()
		newIntake.EUAUserID = null.StringFrom(requesterID)
		createdAt, _ = time.Parse("2006-1-2", "2015-4-1")
		newIntake.CreatedAt = &createdAt
		newIntake.ProjectName = null.StringFrom("My Intake")
		createdIntake, err := s.store.CreateSystemIntake(ctx, &newIntake)
		s.NoError(err)

		submittedAt, _ := time.Parse("2006-1-2", "2015-4-1")
		createdIntake.SubmittedAt = &submittedAt
		intakeThatIsMine, err := s.store.UpdateSystemIntake(ctx, createdIntake)
		s.NoError(err)

		// add an intake belonging to the user with a LifecycleID
		newIntake = testhelpers.NewSystemIntake()
		newIntake.EUAUserID = null.StringFrom(requesterID)
		createdAt, _ = time.Parse("2006-1-2", "2014-1-1")
		newIntake.CreatedAt = &createdAt
		newIntake.ProjectName = null.StringFrom("My Approved Intake")
		createdIntake, err = s.store.CreateSystemIntake(ctx, &newIntake)
		s.NoError(err)

		submittedAt, _ = time.Parse("2006-1-2", "2014-2-1")
		createdIntake.SubmittedAt = &submittedAt
		createdIntake.LifecycleID = null.StringFrom("B123456")
		createdIntake.Status = models.SystemIntakeStatusLCIDISSUED
		intakeWithLifecycleID, err := s.store.UpdateSystemIntake(ctx, createdIntake)
		s.NoError(err)

		// add an intake belonging to the user, and then archive it
		newIntake = testhelpers.NewSystemIntake()
		newIntake.EUAUserID = null.StringFrom(requesterID)
		createdAt, _ = time.Parse("2006-1-2", "2015-5-1")
		newIntake.CreatedAt = &createdAt
		newIntake.ProjectName = null.StringFrom("My Withdrawn Intake")
		createdIntake, err = s.store.CreateSystemIntake(ctx, &newIntake)
		s.NoError(err)

		archivedAt, _ := time.Parse("2006-1-2", "2015-4-1")
		createdIntake.ArchivedAt = &archivedAt
		_, err = s.store.UpdateSystemIntake(ctx, createdIntake)
		s.NoError(err)

		// add an intake that does not belong to the user
		newIntake = testhelpers.NewSystemIntake()
		newIntake.EUAUserID = null.StringFrom(notRequesterID)
		createdAt, _ = time.Parse("2006-1-2", "2015-6-1")
		newIntake.CreatedAt = &createdAt
		_, err = s.store.CreateSystemIntake(ctx, &newIntake)
		s.NoError(err)

		myRequests, err := s.store.FetchMyRequests(ctx)
		s.NoError(err)

		s.Len(myRequests, 3)
		s.Equal(myRequests[0].ID, intakeThatIsMine.ID)
		s.Equal(myRequests[0].Type, model.RequestType("GOVERNANCE_REQUEST"))
		s.Equal(myRequests[0].Name, null.StringFrom("My Intake"))
		s.Equal(myRequests[0].SubmittedAt, intakeThatIsMine.SubmittedAt)
		s.Equal(myRequests[0].Status, "INTAKE_DRAFT")
		s.Nil(myRequests[0].LifecycleID.Ptr())

		s.Equal(myRequests[1].ID, accessibilityRequestThatIsMine.ID)
		s.Equal(myRequests[1].Type, model.RequestType("ACCESSIBILITY_REQUEST"))
		s.Equal(myRequests[1].Name, null.StringFrom("My Accessibility Request"))
		s.Equal(myRequests[1].SubmittedAt, accessibilityRequestThatIsMine.CreatedAt)
		s.Equal(myRequests[1].Status, "OPEN")
		s.Nil(myRequests[1].LifecycleID.Ptr())

		s.Equal(myRequests[2].ID, intakeWithLifecycleID.ID)
		s.Equal(myRequests[2].Type, model.RequestType("GOVERNANCE_REQUEST"))
		s.Equal(myRequests[2].Name, null.StringFrom("My Approved Intake"))
		s.Equal(myRequests[2].SubmittedAt, intakeWithLifecycleID.SubmittedAt)
		s.Equal(myRequests[2].Status, "LCID_ISSUED")
		s.Equal(myRequests[2].LifecycleID, null.StringFrom("B123456"))
	})
}
