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

// These represent some users who have mocked okta data
const (
	// PrincipalUser is the "current user" when seeding the data (Adeline Aarons)
	PrincipalUser = "ABCD"

	// TestUser is the "TEST user" when seeding the data (Terry Thompson)
	TestUser = "TEST"

	// EndToEnd1User is the username of the user for some end to end testing
	EndToEnd1User = "E2E1"

	// EndToEnd2User is the username of the user for some end to end testing
	EndToEnd2User = "E2E2"

	AllyUser  = "A11Y"
	GaryUser  = "GRTB"
	AubryUser = "ADMI"
	User1User = "USR1"
	User2User = "USR2"
	User3User = "USR3"
	User4User = "USR4"
	User5User = "USR5"
	TheoUser  = "CJRW"
)

var UserNamesForCedarSystemRoles = []string{
	PrincipalUser, TestUser, EndToEnd1User, EndToEnd2User, AllyUser, GaryUser, AubryUser, User1User, User2User, User3User, User4User, User5User, TheoUser,
	// Duplicate so we don't run out of users for roles
	PrincipalUser, TestUser, EndToEnd1User, EndToEnd2User, AllyUser, GaryUser, AubryUser, User1User, User2User, User3User, User4User, User5User, TheoUser,
	PrincipalUser, TestUser, EndToEnd1User, EndToEnd2User, AllyUser, GaryUser, AubryUser, User1User, User2User, User3User, User4User, User5User, TheoUser}

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
