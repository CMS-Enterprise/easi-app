package resolvers

import (
	"time"

	"github.com/cmsgov/easi-app/pkg/helpers"
	"github.com/cmsgov/easi-app/pkg/local/cedarcoremock"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *ResolverSuite) TestCedarSystemBookmarks() {
	ctx := s.testConfigs.Context

	mockSystems := cedarcoremock.GetSystems()
	s.Len(mockSystems, 5)

	cedarSystemID := mockSystems[0].ID.String
	s.NotEmpty(cedarSystemID)

	otherID := mockSystems[1].ID.String
	s.NotEmpty(otherID)

	s.Run("saves and retrieves a bookmark", func() {
		_, err := s.testConfigs.Store.CreateCedarSystemBookmark(ctx, &models.CedarSystemBookmark{
			CedarSystemID: cedarSystemID,
			CreatedAt:     helpers.PointerTo(time.Now()),
		})
		s.NoError(err)

		isBookmarked, err := CedarSystemIsBookmarked(ctx, cedarSystemID)
		s.NoError(err)
		s.True(isBookmarked)

		isOtherBookmarked, err := CedarSystemIsBookmarked(ctx, otherID)
		s.NoError(err)
		s.False(isOtherBookmarked)
	})
}
