package storage

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (s StoreTestSuite) TestCreateCedarSystemBookmark() {
	ctx := context.Background()

	s.Run("create a new cedar system bookmark", func() {
		cedarSystemID, _ := uuid.NewRandom()
		bookmark := models.CedarSystemBookmark{
			EUAUserID:     "ANON",
			CedarSystemID: cedarSystemID,
		}
		_, err := s.store.CreateCedarSystemBookmark(ctx, &bookmark)
		s.NoError(err)
	})

	s.Run("fetches cedar system bookmarks", func() {
		euaID := "ANON"
		fetched, err := s.store.FetchCedarSystemBookmarks(ctx, &euaID)
		s.NoError(err)
		s.True(len(fetched) > 0)
	})
}
