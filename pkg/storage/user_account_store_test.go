package storage

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/authentication"
)

func (s *StoreTestSuite) TestUserAccountsByIDs() {
	ctx := context.Background()

	var (
		userID1 = uuid.New()
		userID2 = uuid.New()

		username1 = "1234"
		username2 = "4321"
	)

	user1 := authentication.UserAccount{
		ID:          userID1,
		Username:    username1,
		CommonName:  "TestUserAccountByIDLOADER1",
		Locale:      "TestUserAccountByIDLOADER1",
		Email:       "TestUserAccountByIDLOADER1@oddball.io",
		GivenName:   "TestUserAccountByIDLOADER1",
		FamilyName:  "TestUserAccountByIDLOADER1",
		ZoneInfo:    "TestUserAccountByIDLOADER1",
		HasLoggedIn: false,
	}

	user2 := authentication.UserAccount{
		ID:          userID2,
		Username:    username2,
		CommonName:  "TestUserAccountByIDLOADER2",
		Locale:      "TestUserAccountByIDLOADER2",
		Email:       "TestUserAccountByIDLOADER2@oddball.io",
		GivenName:   "TestUserAccountByIDLOADER2",
		FamilyName:  "TestUserAccountByIDLOADER2",
		ZoneInfo:    "TestUserAccountByIDLOADER2",
		HasLoggedIn: false,
	}

	// create
	_, err := s.store.UserAccountCreate(ctx, s.store, &user1)
	s.NoError(err)

	_, err = s.store.UserAccountCreate(ctx, s.store, &user2)
	s.NoError(err)

	// get both
	data, err := s.store.UserAccountsByIDs(ctx, []uuid.UUID{userID1, userID2})
	s.NoError(err)
	s.Len(data, 2)

	var (
		found1 = false
		found2 = false
	)

	for _, user := range data {
		if user.ID == userID1 {
			found1 = true
		}

		if user.ID == userID2 {
			found2 = true
		}
	}

	s.True(found1)
	s.True(found2)

	s.NoError(s.store.DeleteUserAccountDANGEROUS(username1))
	s.NoError(s.store.DeleteUserAccountDANGEROUS(username2))
}
