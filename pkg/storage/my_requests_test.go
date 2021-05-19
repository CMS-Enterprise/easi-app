package storage

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/authn"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func (s StoreTestSuite) TestMyRequests() {
	notRequesterID := "NOPE"
	requesterID := "BZOW"
	requester := &authn.EUAPrincipal{EUAID: requesterID, JobCodeEASi: true}
	ctx := appcontext.WithPrincipal(context.Background(), requester)

	s.Run("returns only 508 requests tied to the current user", func() {
		intake := testhelpers.NewSystemIntake()
		_, err := s.store.CreateSystemIntake(ctx, &intake)
		s.NoError(err)

		accessibilityRequestThatIsMine := testhelpers.NewAccessibilityRequestForUser(intake.ID, requesterID)
		_, err = s.store.CreateAccessibilityRequest(ctx, &accessibilityRequestThatIsMine)
		s.NoError(err)

		accessibilityRequestThatIsDeleted := testhelpers.NewAccessibilityRequestForUser(intake.ID, requesterID)
		_, err = s.store.CreateAccessibilityRequest(ctx, &accessibilityRequestThatIsDeleted)
		s.NoError(err)

		err = s.store.DeleteAccessibilityRequest(ctx, accessibilityRequestThatIsDeleted.ID, models.AccessibilityRequestDeletionReasonOther)
		s.NoError(err)

		accessibilityRequestThatIsNotMine := testhelpers.NewAccessibilityRequestForUser(intake.ID, notRequesterID)
		_, err = s.store.CreateAccessibilityRequest(ctx, &accessibilityRequestThatIsNotMine)
		s.NoError(err)

		myRequests, err := s.store.FetchMyRequests(ctx)
		s.NoError(err)

		s.Len(myRequests, 1)
		s.Equal(myRequests[0].ID, accessibilityRequestThatIsMine.ID)
	})
}
