// Package testconfig provides a reusable configuration shared when unit testing multiple packages.
package testconfig

import (
	"context"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/local"
	"github.com/cms-enterprise/easi-app/pkg/testconfig/dbtestconfigs"
	"github.com/cms-enterprise/easi-app/pkg/testconfig/emailtestconfigs"
	"github.com/cms-enterprise/easi-app/pkg/testconfig/uploadtestconfigs"
	"github.com/cms-enterprise/easi-app/pkg/testhelpers"
	"github.com/cms-enterprise/easi-app/pkg/usersearch"

	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/upload"

	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cms-enterprise/easi-app/pkg/storage"
)

// Base is a struct that contains all base dependencies needed to run a test. It is meant to be embedded to allow reusable testing dependencies,
// while leaving out dependencies that can be extended for a specific test suite to avoid import cycle issues.
type Base struct {
	DBConfig                 storage.DBConfig
	LDClient                 *ld.LDClient
	Logger                   *zap.Logger
	UserInfo                 *models.UserInfo
	Store                    *storage.Store
	S3Client                 *upload.S3Client
	Principal                *authentication.EUAPrincipal
	Context                  context.Context
	getTestPrincipalFunction GetTestPrincipalFunction
	EmailClient              *email.Client
	userSearchClient         usersearch.Client
	Sender                   *emailtestconfigs.MockSender
}

// GetDefaultTestConfigs returns a TestConfigs struct with all the dependencies needed to run a test
// Note, it does not return the principal as this needs to be updated for every test. This should only be called from setup tests!
func GetDefaultTestConfigs(getTestPrincipalFunction GetTestPrincipalFunction) *Base {
	tc := Base{}
	tc.GetDefaults()
	tc.getTestPrincipalFunction = getTestPrincipalFunction
	return &tc
}

// GetDefaults sets the dependencies for the TestConfigs struct
// The principal needs to be set before every test as the user account is removed between tests
func (config *Base) GetDefaults(ctxCallbacks ...func(context.Context) context.Context) {
	dbConfig, ldClient, logger, userInfo := getTestDependencies()
	store, _ := storage.NewStore(dbConfig, ldClient)
	emailClient, sender := emailtestconfigs.NewEmailClient()
	userSearchClient := local.NewOktaAPIClient()

	viperConfig := testhelpers.NewConfig()
	config.DBConfig = dbConfig
	config.LDClient = ldClient
	config.Logger = logger
	config.UserInfo = userInfo
	config.Store = store
	config.EmailClient = emailClient
	config.userSearchClient = userSearchClient
	config.Sender = sender

	config.Context = appcontext.WithLogger(context.Background(), config.Logger)
	for _, cb := range ctxCallbacks {
		config.Context = cb(config.Context)
	}

	s3Client := uploadtestconfigs.S3TestClient(config.Context, viperConfig)
	config.S3Client = &s3Client

}

func getTestDependencies() (storage.DBConfig, *ld.LDClient, *zap.Logger, *models.UserInfo) {
	config := dbtestconfigs.NewDBCTestConfig()
	ldClient, _ := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	logger := zap.NewNop()
	userInfo := &models.UserInfo{
		DisplayName: "Test User",
		FirstName:   "Test",
		LastName:    "User",
		Email:       "testuser@test.com",
		Username:    "TEST",
	}

	return config, ldClient, logger, userInfo
}

// GetTestPrincipalFunction either inserts a new user account record into the database, or returns the record already in the database
type GetTestPrincipalFunction func(store *storage.Store, userName string, isAdmin bool) (*authentication.EUAPrincipal, error)

// GetTestPrincipal is a wrapper function which allows us to conditional call store or user account helper methods to retrieve a test principal
func (config *Base) GetTestPrincipal(store *storage.Store, userName string, isAdmin bool) (*authentication.EUAPrincipal, error) {
	return config.getTestPrincipalFunction(store, userName, isAdmin)
}

// GenericSetupTests is a generic wrapper to setup tests for test suits
// it truncates all tables
func (config *Base) GenericSetupTests() error {
	err := config.Store.TruncateAllTablesDANGEROUS(config.Logger)
	if err != nil {
		return err
	}

	//GET USER ACCOUNT EACH TIME!
	princ, err := config.GetTestPrincipal(config.Store, config.UserInfo.Username, true)
	if err != nil {
		return err
	}

	config.Principal = princ
	return nil
}

// StubFetchUserInfo is a utility
func (config *Base) StubFetchUserInfo(_ context.Context, username string) (*models.UserInfo, error) {
	return &models.UserInfo{
		Username:    username,
		FirstName:   username,
		LastName:    "Doe",
		DisplayName: username + " Doe",
		Email:       models.EmailAddress(username + ".doe@local.fake"),
	}, nil
}

// StubFetchUserInfos is a utility to mock the user info fetcher
func (config *Base) StubFetchUserInfos(ctx context.Context, username []string) ([]*models.UserInfo, error) {
	var userInfos []*models.UserInfo
	for _, name := range username {
		info, err := config.StubFetchUserInfo(ctx, name)
		if err != nil {
			return nil, err
		}
		userInfos = append(userInfos, info)
	}
	return userInfos, nil

}
