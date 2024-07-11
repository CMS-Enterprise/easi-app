package mock

import (
	"context"
	"fmt"

	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/local"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
	"github.com/cms-enterprise/easi-app/pkg/userhelpers"
)

// PrincipalUser is the "current user" when seeding the data
const PrincipalUser = "ABCD"

// FetchUserInfoMock mocks the fetch user info logic
func FetchUserInfoMock(ctx context.Context, username string) (*models.UserInfo, error) {
	localOktaClient := local.NewOktaAPIClient()
	return localOktaClient.FetchUserInfo(ctx, username)
}

// FetchUserInfosMock mocks the fetch user info logic
func FetchUserInfosMock(ctx context.Context, usernames []string) ([]*models.UserInfo, error) {
	localOktaClient := local.NewOktaAPIClient()
	return localOktaClient.FetchUserInfos(ctx, usernames)
}

// CtxWithLoggerAndPrincipal makes a context with a mocked logger and principal
func CtxWithLoggerAndPrincipal(logger *zap.Logger, store *storage.Store, username string) context.Context {
	//Future Enhancement: Consider adding this to the seederConfig, and also emb
	if len(username) < 1 {
		username = PrincipalUser
	}

	//Future Enhancement: consider passing the context with the seeder, and using the seeder.UserSearchClient to return mocked data instead of needing to initialize a client for each mock call
	userAccount, err := userhelpers.GetOrCreateUserAccount(context.Background(), store, store, username, true, userhelpers.GetUserInfoAccountInfoWrapperFunc(FetchUserInfoMock))
	if err != nil {
		panic(fmt.Errorf("failed to get or create user account for mock data: %w", err))
	}

	princ := &authentication.EUAPrincipal{
		EUAID:       username,
		JobCodeEASi: true,
		JobCodeGRT:  true,
		UserAccount: userAccount,
	}
	ctx := appcontext.WithLogger(context.Background(), logger)
	ctx = appcontext.WithPrincipal(ctx, princ)
	return ctx
}
