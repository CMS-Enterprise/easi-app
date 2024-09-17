package resolvers

import (
	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/authentication"
)

func (s *ResolverSuite) TestGetUserAccountByID() {
	store := s.testConfigs.Store

	s.Run("should get user accounts by id", func() {
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

		_, err := store.UserAccountCreate(s.testConfigs.Context, store, &user)
		s.NoError(err)

		// get that user
		data, err := GetUserAccountByID(s.ctxWithNewDataloaders(), userID)
		s.NoError(err)

		s.Equal(data.ID, userID)

		// clean up
		s.NoError(store.DeleteUserAccountDANGEROUS(username))
	})
}
