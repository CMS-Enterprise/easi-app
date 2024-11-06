package resolvers

import (
	"github.com/cms-enterprise/easi-app/pkg/local/cedarcoremock"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *ResolverSuite) TestCedarSystemBookmarks() {
	ctx := s.testConfigs.Context

	mockSystems := cedarcoremock.GetActiveSystems()
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

		isBookmarked, err := GetCedarSystemIsBookmarked(s.ctxWithNewDataloaders(), cedarSystemID)
		s.NoError(err)
		s.True(isBookmarked)

		isOtherBookmarked, err := GetCedarSystemIsBookmarked(s.ctxWithNewDataloaders(), otherID)
		s.NoError(err)
		s.False(isOtherBookmarked)
	})
}
