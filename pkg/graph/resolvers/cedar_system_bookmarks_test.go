package resolvers

// func (suite *ResolverSuite) TestCedarSystemBookmarks() {
// 	ctx := suite.testConfigs.Context

// 	mockSystems := cedarcoremock.GetActiveSystems()
// 	suite.Len(mockSystems, 5)

// 	cedarSystemID := mockSystems[0].ID.String
// 	suite.NotEmpty(cedarSystemID)

// 	otherID := mockSystems[1].ID.String
// 	suite.NotEmpty(otherID)

// 	suite.Run("saves and retrieves a bookmark", func() {
// 		_, err := suite.testConfigs.Store.CreateCedarSystemBookmark(ctx, &models.CedarSystemBookmark{
// 			CedarSystemID: cedarSystemID,
// 		})
// 		suite.NoError(err)

// 		isBookmarked, err := GetCedarSystemIsBookmarked(ctx, cedarSystemID)
// 		suite.NoError(err)
// 		suite.True(isBookmarked)

// 		isOtherBookmarked, err := GetCedarSystemIsBookmarked(ctx, otherID)
// 		suite.NoError(err)
// 		suite.False(isOtherBookmarked)
// 	})
// }
