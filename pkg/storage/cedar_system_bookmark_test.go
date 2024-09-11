package storage

import (
	"context"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/testhelpers"

	"github.com/facebookgo/clock"
)

func (s *StoreTestSuite) TestCreateCedarSystemBookmark() {
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

func (s *StoreTestSuite) TestDuplicateCedarSystemBookmark() {
	ctx := context.Background()

	mockClock := clock.NewMock()
	settableClock := testhelpers.SettableClock{Mock: mockClock}
	s.store.clock = &settableClock

	s.Run("create a duplicate cedar system bookmark and verify created_at updates", func() {
		cedarSystemID := "326-1556-2"
		bookmark := models.CedarSystemBookmark{
			EUAUserID:     "ANON",
			CedarSystemID: cedarSystemID,
		}
		created, err := s.store.CreateCedarSystemBookmark(ctx, &bookmark)
		createdAt := created.CreatedAt.Unix()
		s.NoError(err)

		mockClock.Add(time.Minute)

		duplicate, err2 := s.store.CreateCedarSystemBookmark(ctx, &bookmark)
		s.NoError(err2)
		s.Greater(duplicate.CreatedAt.Unix(), createdAt)
	})
}

func (s *StoreTestSuite) TestFetchCedarSystemIsBookmarkedByCedarSystemIDs() {
	ctx := context.Background()

	cedarSystemID := uuid.New().String()
	s.NotEmpty(cedarSystemID)

	otherID := uuid.New().String()
	s.NotEmpty(otherID)

	s.Run("saves and retrieves a bookmark", func() {
		_, err := s.store.CreateCedarSystemBookmark(ctx, &models.CedarSystemBookmark{
			CedarSystemID: cedarSystemID,
		})
		s.NoError(err)

		req := models.BookmarkRequest{
			CedarSystemID: cedarSystemID,
			EuaUserID:     appcontext.Principal(ctx).ID(),
		}

		bookmarks, err := s.store.FetchCedarSystemIsBookmarkedByCedarSystemIDs(ctx, []models.BookmarkRequest{req})
		s.NoError(err)
		s.NotEmpty(bookmarks)
		s.Len(bookmarks, 1)
		s.True(bookmarks[0])
	})
}
