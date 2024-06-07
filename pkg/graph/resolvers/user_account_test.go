package resolvers

import (
	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/authentication"
)

func (suite *ResolverSuite) TestGetUserAccountByID() {
	store := suite.testConfigs.Store

	suite.Run("should get user accounts by id", func() {
		var (
			userID   = uuid.New()
			username = "1111"
		)
		// create user
		user := authentication.UserAccount{
			ID:          userID,
			Username:    username,
			CommonName:  "TestGetUserAccountByID",
			Locale:      "TestGetUserAccountByID",
			Email:       "TestGetUserAccountByID@oddball.io",
			GivenName:   "TestGetUserAccountByID",
			FamilyName:  "TestGetUserAccountByID",
			ZoneInfo:    "TestGetUserAccountByID",
			HasLoggedIn: false,
		}

		_, err := store.UserAccountCreate(store, &user)
		suite.NoError(err)

		// get that user
		data, err := GetUserAccountByID(suite.ctxWithNewDataloaders(), userID)
		suite.NoError(err)

		suite.Equal(data.ID, userID)

		// clean up
		suite.NoError(store.DeleteUserAccountDANGEROUS(username))
	})
}
