package storage

import (
	"context"

	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/testhelpers"
)

func (s *StoreTestSuite) TestCreateSystemIntakeContact() {
	ctx := context.Background()
	intake := testhelpers.NewSystemIntake()
	_, err := s.store.CreateSystemIntake(ctx, &intake)
	s.NoError(err)

	s.Run("create a system intake contact", func() {
		contact := models.SystemIntakeContact{
			EUAUserID:      "ANON",
			SystemIntakeID: intake.ID,
		}
		createdContact, err := s.store.CreateSystemIntakeContact(ctx, &contact)
		s.NoError(err)

		createdContact.Role = "Supreme Overlord"
		_, err = s.store.UpdateSystemIntakeContact(ctx, createdContact)
		s.NoError(err)
	})

	s.Run("fetches system intake contacts", func() {
		fetched, err := s.store.FetchSystemIntakeContactsBySystemIntakeID(ctx, intake.ID)
		s.NoError(err)
		s.True(len(fetched) > 0)
	})
}
