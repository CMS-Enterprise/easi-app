package resolvers

import (
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
		})
		s.NoError(err)

		isBookmarked, err := GetCedarSystemIsBookmarked(ctx, cedarSystemID)
		s.NoError(err)
		s.True(isBookmarked)

		isOtherBookmarked, err := GetCedarSystemIsBookmarked(ctx, otherID)
		s.NoError(err)
		s.False(isOtherBookmarked)
	})
}
