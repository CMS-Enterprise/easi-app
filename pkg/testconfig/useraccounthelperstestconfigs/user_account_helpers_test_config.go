// Package useraccounthelperstestconfigs provides utility functions for getting user accounts using the user helper package
package useraccounthelperstestconfigs

import (
	"context"

	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/storage"
	"github.com/cms-enterprise/easi-app/pkg/userhelpers"
	"github.com/cms-enterprise/easi-app/pkg/usersearch"
)

// GetTestPrincipal is a utility function to return a principal for tests
func GetTestPrincipal(store *storage.Store, userName string, UserSearchClient usersearch.Client, isAdmin bool) *authentication.EUAPrincipal {

	userAccount, _ := userhelpers.GetOrCreateUserAccount(context.Background(), store, userName, true, userhelpers.GetUserInfoAccountInfoWrapperFunc(UserSearchClient.FetchUserInfo))

	princ := &authentication.EUAPrincipal{
		EUAID:           userName,
		JobCodeEASi:     true,
		JobCodeGRT:      isAdmin,
		JobCodeTRBAdmin: isAdmin,
		UserAccount:     userAccount,
	}
	return princ

}
