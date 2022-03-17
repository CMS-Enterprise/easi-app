package storage

import (
	"context"
	"time"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"

	"github.com/facebookgo/clock"
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

func (s StoreTestSuite) TestDuplicateSystemIntakeContact() {
	ctx := context.Background()
	intake := testhelpers.NewSystemIntake()
	_, err := s.store.CreateSystemIntake(ctx, &intake)
	s.NoError(err)

	mockClock := clock.NewMock()
	settableClock := testhelpers.SettableClock{Mock: mockClock}
	s.store.clock = &settableClock

	s.Run("create a duplicate system intake contact and verify created_at updates", func() {
		contact := models.SystemIntakeContact{
			EUAUserID:      "ANON",
			SystemIntakeID: intake.ID,
		}
		created, err := s.store.CreateSystemIntakeContact(ctx, &contact)
		createdAt := (*created.CreatedAt).Unix()
		s.NoError(err)

		mockClock.Add(time.Minute)

		duplicate, dupeErr := s.store.CreateSystemIntakeContact(ctx, &contact)
		s.NoError(dupeErr)
		s.Greater((*duplicate.CreatedAt).Unix(), createdAt)
	})
}
