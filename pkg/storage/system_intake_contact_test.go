package storage

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func (s StoreTestSuite) TestCreateSystemIntakeContact() {
	ctx := context.Background()
	intake := testhelpers.NewSystemIntake()
	_, err := s.store.CreateSystemIntake(ctx, &intake)
	s.NoError(err)

	s.Run("create a system intake contact", func() {
		contact := models.SystemIntakeContact{
			EUAUserID:      "ANON",
			SystemIntakeID: intake.ID,
		}
		_, err := s.store.CreateSystemIntakeContact(ctx, &contact)
		s.NoError(err)
	})

	s.Run("fetches system intake contacts", func() {
		fetched, err := s.store.FetchSystemIntakeContactsBySystemIntakeID(ctx, intake.ID)
		s.NoError(err)
		s.True(len(fetched) > 0)
	})
}
