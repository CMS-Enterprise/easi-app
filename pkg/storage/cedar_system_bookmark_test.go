package storage

import (
	"context"
	"time"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"

	"github.com/facebookgo/clock"
)

func (s StoreTestSuite) TestCreateCedarSystemBookmark() {
	ctx := context.Background()

	s.Run("create a new cedar system bookmark", func() {
		cedarSystemID := "326-1556-0"
		bookmark := models.CedarSystemBookmark{
			EUAUserID:     "ANON",
			CedarSystemID: cedarSystemID,
		}
		_, err := s.store.CreateCedarSystemBookmark(ctx, &bookmark)
		s.NoError(err)
	})

	s.Run("fetches cedar system bookmarks", func() {
		fetched, err := s.store.FetchCedarSystemBookmarks(ctx)
		s.NoError(err)
		s.True(len(fetched) > 0)
	})
}

func (s StoreTestSuite) TestDuplicateCedarSystemBookmark() {
	ctx := context.Background()

	mockClock := clock.NewMock()
	settableClock := testhelpers.SettableClock{Mock: mockClock}
	s.store.clock = &settableClock

	s.Run("create a new cedar system bookmark", func() {
		cedarSystemID := "326-1556-2"
		bookmark := models.CedarSystemBookmark{
			EUAUserID:     "ANON",
			CedarSystemID: cedarSystemID,
		}
		created, err := s.store.CreateCedarSystemBookmark(ctx, &bookmark)
		createdAt := (*created.CreatedAt).Unix()
		s.NoError(err)

		mockClock.Add(time.Minute)

		duplicate, err2 := s.store.CreateCedarSystemBookmark(ctx, &bookmark)
		s.NoError(err2)
		s.Greater((*duplicate.CreatedAt).Unix(), createdAt)
	})
}
