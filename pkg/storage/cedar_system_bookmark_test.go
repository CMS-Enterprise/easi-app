package storage

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/models"
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
