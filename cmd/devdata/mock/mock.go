package mock

import (
	"context"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/authentication"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
	"github.com/cmsgov/easi-app/pkg/storage/loaders"
	"github.com/cmsgov/easi-app/pkg/userhelpers"
)

// PrincipalUser is the "current user" when seeding the data
const PrincipalUser = "ABCD"

// FetchUserInfoMock mocks the fetch user info logic
func FetchUserInfoMock(ctx context.Context, eua string) (*models.UserInfo, error) {
	return &models.UserInfo{
		Username:    eua,
		DisplayName: "Test Man",
		Email:       "testman@example.com",
	}, nil
}

// FetchUserInfosMock mocks the fetch user info logic
func FetchUserInfosMock(ctx context.Context, euas []string) ([]*models.UserInfo, error) {
	userInfos := make([]*models.UserInfo, 0, len(euas))
	for _, eua := range euas {
		userInfo, err := FetchUserInfoMock(ctx, eua)
		if err != nil {
			return nil, err
		}
		userInfos = append(userInfos, userInfo)
	}
	return userInfos, nil
}

// CtxWithLoggerAndPrincipalAndLoaders makes a context with a mocked logger and principal
func CtxWithLoggerAndPrincipalAndLoaders(store *storage.Store, logger *zap.Logger, euaID string) context.Context {
	princ := getTestPrincipal(store, euaID)

	ctx := appcontext.WithLogger(context.Background(), logger)

	dataLoaders := loaders.NewDataLoaders(store)
	ctx = loaders.CTXWithLoaders(ctx, dataLoaders)

	ctx = appcontext.WithPrincipal(ctx, princ)
	return ctx
}

func getTestPrincipal(store *storage.Store, userName string) *authentication.EUAPrincipal {

	userAccount, _ := userhelpers.GetOrCreateUserAccount(context.Background(), store, store, userName, true, userhelpers.GetOktaAccountInfoWrapperFunction(userhelpers.GetUserInfoFromOktaLocal))

	princ := &authentication.EUAPrincipal{
		EUAID:            userName,
		JobCodeEASi:      true,
		JobCodeGRT:       true,
		JobCode508User:   true,
		JobCode508Tester: true,
		UserAccount:      userAccount,
	}
	return princ

}
