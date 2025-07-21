// Package useraccountstoretestconfigs provides utility functions for getting user accounts using the storage package
package useraccountstoretestconfigs

import (
	"context"

	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

// GetTestPrincipal either inserts a new user account record into the database, or returns the record already in the database
// the common name of the inserted account is the username for simplicity
func GetTestPrincipal(store *storage.Store, userName string, isAdmin bool) (*authentication.EUAPrincipal, error) {
	userAccount, accErr := store.UserAccountGetByUsername(context.Background(), store, userName)
	if accErr != nil {
		return nil, accErr
	}
	if userAccount != nil {
		return &authentication.EUAPrincipal{
			EUAID:           userAccount.Username,
			JobCodeEASi:     true,
			JobCodeGRT:      isAdmin,
			JobCodeTRBAdmin: isAdmin,
			UserAccount:     userAccount,
		}, nil
	}

	// we mock a user account to the DB directly here
	userAccount = &authentication.UserAccount{
		Username:    userName,
		CommonName:  userName,
		Locale:      "testTestTest",
		Email:       "testTestTest",
		GivenName:   "testTestTest",
		FamilyName:  "testTestTest",
		ZoneInfo:    "testTestTest",
		HasLoggedIn: true,
	}

	newAccount, newErr := store.UserAccountCreate(context.Background(), store, userAccount)
	if newErr != nil {
		return nil, newErr
	}

	princ := &authentication.EUAPrincipal{
		EUAID:           userAccount.Username,
		JobCodeEASi:     true,
		JobCodeGRT:      isAdmin,
		JobCodeTRBAdmin: isAdmin,
		UserAccount:     newAccount,
	}
	return princ, nil

}
