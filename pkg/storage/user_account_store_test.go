package storage

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/authentication"
)

func (s *StoreTestSuite) TestUserAccountByIDLOADER() {
	ctx := context.Background()

	var (
		userID1 = uuid.New()
		userID2 = uuid.New()
	)

	user1 := authentication.UserAccount{
		ID:          userID1,
		Username:    "1234",
		CommonName:  "TestUserAccountByIDLOADER1",
		Locale:      "TestUserAccountByIDLOADER1",
		Email:       "TestUserAccountByIDLOADER1",
		GivenName:   "TestUserAccountByIDLOADER1",
		FamilyName:  "TestUserAccountByIDLOADER1",
		ZoneInfo:    "TestUserAccountByIDLOADER1",
		HasLoggedIn: false,
	}

	user2 := authentication.UserAccount{
		ID:          userID2,
		Username:    "5678",
		CommonName:  "TestUserAccountByIDLOADER2",
		Locale:      "TestUserAccountByIDLOADER2",
		Email:       "TestUserAccountByIDLOADER2",
		GivenName:   "TestUserAccountByIDLOADER2",
		FamilyName:  "TestUserAccountByIDLOADER2",
		ZoneInfo:    "TestUserAccountByIDLOADER2",
		HasLoggedIn: false,
	}

	// create
	_, err := s.store.UserAccountCreate(s.store, &user1)
	s.NoError(err)

	_, err = s.store.UserAccountCreate(s.store, &user2)
	s.NoError(err)

	// get both
	data, err := s.store.UserAccountByIDLOADER(ctx, []uuid.UUID{userID1, userID2})
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
}
