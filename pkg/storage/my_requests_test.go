package storage

import (
	"context"
	"time"

	"github.com/guregu/null"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/authn"
	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func (s StoreTestSuite) TestMyRequests() {
	notRequesterID := "NOPE"
	requesterID := "BZOW"
	requester := &authn.EUAPrincipal{EUAID: requesterID, JobCodeEASi: true}
	ctx := appcontext.WithPrincipal(context.Background(), requester)

	s.Run("returns only 508 and intake requests tied to the current user", func() {
		intake := testhelpers.NewSystemIntake()
		_, err := s.store.CreateSystemIntake(ctx, &intake)
		s.NoError(err)

		newRequest := testhelpers.NewAccessibilityRequestForUser(intake.ID, requesterID)
		createdAt, _ := time.Parse("2006-1-2", "2015-1-1")
		newRequest.CreatedAt = &createdAt
		newRequest.Name = "My Accessibility Request"
		accessibilityRequestThatIsMine, err := s.store.CreateAccessibilityRequest(ctx, &newRequest)
		s.NoError(err)

		newRequest = testhelpers.NewAccessibilityRequestForUser(intake.ID, requesterID)
		createdAt, _ = time.Parse("2006-1-2", "2015-2-1")
		newRequest.CreatedAt = &createdAt
		accessibilityRequestThatIsDeleted, err := s.store.CreateAccessibilityRequest(ctx, &newRequest)
		s.NoError(err)

		err = s.store.DeleteAccessibilityRequest(ctx, accessibilityRequestThatIsDeleted.ID, models.AccessibilityRequestDeletionReasonOther)
		s.NoError(err)

		newRequest = testhelpers.NewAccessibilityRequestForUser(intake.ID, notRequesterID)
		createdAt, _ = time.Parse("2006-1-2", "2015-3-1")
		newRequest.CreatedAt = &createdAt
		_, err = s.store.CreateAccessibilityRequest(ctx, &newRequest)
		s.NoError(err)

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

		newIntake = testhelpers.NewSystemIntake()
		newIntake.EUAUserID = null.StringFrom(requesterID)
		createdAt, _ = time.Parse("2006-1-2", "2015-5-1")
		newIntake.CreatedAt = &createdAt
		newIntake.ProjectName = null.StringFrom("My Withdrawn Intake")
		intakeThatIsWithdrawn, err := s.store.CreateSystemIntake(ctx, &newIntake)
		s.NoError(err)

		newIntake = testhelpers.NewSystemIntake()
		newIntake.EUAUserID = null.StringFrom(notRequesterID)
		createdAt, _ = time.Parse("2006-1-2", "2015-6-1")
		newIntake.CreatedAt = &createdAt
		_, err = s.store.CreateSystemIntake(ctx, &newIntake)
		s.NoError(err)

		myRequests, err := s.store.FetchMyRequests(ctx)
		s.NoError(err)

		s.Len(myRequests, 3)
		s.Equal(myRequests[0].ID, intakeThatIsWithdrawn.ID)
		s.Equal(myRequests[0].Type, model.RequestType("GOVERNANCE_REQUEST"))
		s.Equal(myRequests[0].Name, null.StringFrom("My Withdrawn Intake"))
		s.Nil(myRequests[0].SubmittedAt)

		s.Equal(myRequests[1].ID, intakeThatIsMine.ID)
		s.Equal(myRequests[1].Type, model.RequestType("GOVERNANCE_REQUEST"))
		s.Equal(myRequests[1].Name, null.StringFrom("My Intake"))
		s.Equal(myRequests[1].SubmittedAt, intakeThatIsMine.SubmittedAt)

		s.Equal(myRequests[2].ID, accessibilityRequestThatIsMine.ID)
		s.Equal(myRequests[2].Type, model.RequestType("ACCESSIBILITY_REQUEST"))
		s.Equal(myRequests[2].Name, null.StringFrom("My Accessibility Request"))
		s.Equal(myRequests[2].SubmittedAt, accessibilityRequestThatIsMine.CreatedAt)
	})
}
