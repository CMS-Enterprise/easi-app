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

		accessibilityRequestThatIsMine := testhelpers.NewAccessibilityRequestForUser(intake.ID, requesterID)
		createdAt, _ := time.Parse("2006-1-2", "2015-1-1")
		accessibilityRequestThatIsMine.CreatedAt = &createdAt
		_, err = s.store.CreateAccessibilityRequest(ctx, &accessibilityRequestThatIsMine)
		s.NoError(err)

		accessibilityRequestThatIsDeleted := testhelpers.NewAccessibilityRequestForUser(intake.ID, requesterID)
		createdAt, _ = time.Parse("2006-1-2", "2015-2-1")
		accessibilityRequestThatIsDeleted.CreatedAt = &createdAt
		_, err = s.store.CreateAccessibilityRequest(ctx, &accessibilityRequestThatIsDeleted)
		s.NoError(err)

		err = s.store.DeleteAccessibilityRequest(ctx, accessibilityRequestThatIsDeleted.ID, models.AccessibilityRequestDeletionReasonOther)
		s.NoError(err)

		accessibilityRequestThatIsNotMine := testhelpers.NewAccessibilityRequestForUser(intake.ID, notRequesterID)
		createdAt, _ = time.Parse("2006-1-2", "2015-3-1")
		accessibilityRequestThatIsNotMine.CreatedAt = &createdAt
		_, err = s.store.CreateAccessibilityRequest(ctx, &accessibilityRequestThatIsNotMine)
		s.NoError(err)

		intakeThatIsMine := testhelpers.NewSystemIntake()
		intakeThatIsMine.EUAUserID = null.StringFrom(requesterID)
		createdAt, _ = time.Parse("2006-1-2", "2015-4-1")
		intakeThatIsMine.CreatedAt = &createdAt
		_, err = s.store.CreateSystemIntake(ctx, &intakeThatIsMine)
		s.NoError(err)

		intakeThatIsWithdrawn := testhelpers.NewSystemIntake()
		intakeThatIsWithdrawn.EUAUserID = null.StringFrom(requesterID)
		createdAt, _ = time.Parse("2006-1-2", "2015-5-1")
		intakeThatIsWithdrawn.CreatedAt = &createdAt
		_, err = s.store.CreateSystemIntake(ctx, &intakeThatIsWithdrawn)
		s.NoError(err)

		intakeThatIsNotMine := testhelpers.NewSystemIntake()
		intakeThatIsNotMine.EUAUserID = null.StringFrom(notRequesterID)
		createdAt, _ = time.Parse("2006-1-2", "2015-6-1")
		intakeThatIsNotMine.CreatedAt = &createdAt
		_, err = s.store.CreateSystemIntake(ctx, &intakeThatIsNotMine)
		s.NoError(err)

		myRequests, err := s.store.FetchMyRequests(ctx)
		s.NoError(err)

		s.Len(myRequests, 3)
		s.Equal(myRequests[0].ID, intakeThatIsWithdrawn.ID)
		s.Equal(myRequests[0].Type, model.RequestType("GOVERNANCE_REQUEST"))

		s.Equal(myRequests[1].ID, intakeThatIsMine.ID)
		s.Equal(myRequests[1].Type, model.RequestType("GOVERNANCE_REQUEST"))

		s.Equal(myRequests[2].ID, accessibilityRequestThatIsMine.ID)
		s.Equal(myRequests[2].Type, model.RequestType("ACCESSIBILITY_REQUEST"))
	})
}
