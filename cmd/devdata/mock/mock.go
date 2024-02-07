package mock

import (
	"context"
	"fmt"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/authentication"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
	"github.com/cmsgov/easi-app/pkg/userhelpers"
)

// PrincipalUser is the "current user" when seeding the data
const PrincipalUser = "ABCD"

// FetchUserInfoMock mocks the fetch user info logic
func FetchUserInfoMock(ctx context.Context, eua string) (*models.UserInfo, error) {
	return &models.UserInfo{
		Username:    eua,
		FirstName:   eua,
		LastName:    "Doe",
		DisplayName: eua + "Doe",
		Email:       models.EmailAddress(eua + "@example.com"),
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

// CtxWithLoggerAndPrincipal makes a context with a mocked logger and principal
func CtxWithLoggerAndPrincipal(logger *zap.Logger, store *storage.Store, euaID string) context.Context {
	userAccount, err := userhelpers.GetOrCreateUserAccount(context.Background(), store, store, euaID, true, userhelpers.GetOktaAccountInfoWrapperFunction(userhelpers.GetUserInfoFromOktaLocal))
	if err != nil {
		panic(fmt.Errorf("failed to get or create user account for mock data"))
	}

	princ := &authentication.EUAPrincipal{
		EUAID:            euaID,
		JobCodeEASi:      true,
		JobCodeGRT:       true,
		JobCode508User:   true,
		JobCode508Tester: true,
		UserAccount:      userAccount,
	}
	ctx := appcontext.WithLogger(context.Background(), logger)
	ctx = appcontext.WithPrincipal(ctx, princ)
	return ctx
}
