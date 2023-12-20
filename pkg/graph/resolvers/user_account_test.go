package resolvers

import (
	"context"
	"fmt"

	"golang.org/x/sync/errgroup"

	"github.com/cmsgov/easi-app/pkg/authentication"
)

// UserAccountGetByUsername returns a user account by it's EUAID
func (suite *ResolverSuite) TestUserAccountGetByUsername() {
	username := "USER NUMBER 1"

	princ1 := getTestPrincipal(suite.testConfigs.Store, username)

	account, err := UserAccountGetByUsername(suite.testConfigs.Store, username)
	suite.NoError(err)
	suite.EqualValues(princ1.UserAccount.CommonName, account.CommonName)
	suite.EqualValues(princ1.UserAccount.Email, account.Email)

}

// UserAccountGetByIDLOADER returns a user account by it's internal ID, utilizing a data loader
func (suite *ResolverSuite) TestUserAccountGetByIDLOADER() {
	princ1 := getTestPrincipal(suite.testConfigs.Store, "USER NUMBER 1")
	princ2 := getTestPrincipal(suite.testConfigs.Store, "USER NUMBER 2")
	princ3 := getTestPrincipal(suite.testConfigs.Store, "TEST")
	princ4 := getTestPrincipal(suite.testConfigs.Store, "COLB")
	princ5 := getTestPrincipal(suite.testConfigs.Store, "BTMN")

	princArray := []*authentication.EUAPrincipal{princ1, princ2, princ3, princ4, princ5}

	g, ctx := errgroup.WithContext(suite.testConfigs.Context)

	for _, princ := range princArray {
		theFunc := getUserAccountLoaderVerificationFunction(ctx, princ, verifyUserAccountLoader)
		g.Go(theFunc)
	}
	err := g.Wait()
	suite.NoError(err)

}

func verifyUserAccountLoader(ctx context.Context, princ *authentication.EUAPrincipal) error {

	retAccount, err := UserAccountGetByIDLOADER(ctx, princ.UserAccount.ID)
	if err != nil {
		return err
	}
	if retAccount.CommonName != princ.UserAccount.CommonName {
		return fmt.Errorf("name from DB (%s) loader doesn't match expected (%s)", retAccount.CommonName, princ.Account().CommonName)
	}
	return nil

}

func getUserAccountLoaderVerificationFunction(ctx context.Context, princ *authentication.EUAPrincipal, verifyAccountFunc func(ctx context.Context, princ *authentication.EUAPrincipal) error) func() error {
	return func() error {
		return verifyAccountFunc(ctx, princ)
	}
}
