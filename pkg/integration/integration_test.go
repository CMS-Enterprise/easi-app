package integration

// integration is a package for testing application routes
// it should attempt to mock as few dependencies as possible
// and simulate production application use

import (
	"fmt"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/spf13/viper"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cms-enterprise/easi-app/pkg/appconfig"
	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/handlers"
	"github.com/cms-enterprise/easi-app/pkg/server"
	"github.com/cms-enterprise/easi-app/pkg/storage"
	"github.com/cms-enterprise/easi-app/pkg/testhelpers"
)

// test user for authorization
type user struct {
	euaID       string
	accessToken string
}

type IntegrationTestSuite struct {
	suite.Suite
	environment appconfig.Environment
	logger      *zap.Logger
	config      *viper.Viper
	server      *httptest.Server
	user        user
	store       *storage.Store
	base        handlers.HandlerBase
}

func TestIntegrationTestSuite(t *testing.T) {
	// TODO: Address this
	// Since, on 01/25/2024, the Okta API disabled the implicit auth flow, we need to identify another way to
	// fetch an access token for testing. For now, we need to skip these tests.
	t.Skip("integration tests are skipped")
	if testing.Short() {
		t.Skip("skipping integration tests in `-short` mode")
	}
	config := testhelpers.NewConfig()
	easiServer := server.NewServer(config)
	testServer := httptest.NewServer(easiServer)
	defer testServer.Close()

	// Make 3 attempts at getting a valid Okta Access Token
	// This requires multiple attempts to help fix test-flakiness when running
	// multiple of this test in parallel, as the One-Time-Password used to log in to Okta is.... one time!
	attempts := 1
	maxAttempts := 3
	var accessToken string
	var err error
	for attempts <= maxAttempts {
		accessToken, err = testhelpers.OktaAccessToken(config)
		if err != nil {
			t.Logf("[Attempt %d/%d] Failed to get access token for integration testing with error: %s", attempts, maxAttempts, err)
			attempts++
			time.Sleep(time.Second * 30) // Wait 30 seconds to make sure One-Time-Password is new
		} else {
			break
		}
	}

	// If we broke out of the loop with an error, we need to fail the test
	if err != nil {
		fmt.Printf("Failed to get access token for integration testing after %d attempts with error: %s", attempts, err)
		t.FailNow()
	}

	logger := zap.NewNop()

	ldClient, err := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	assert.NoError(t, err)

	dbConfig := storage.DBConfig{
		Host:           config.GetString(appconfig.DBHostConfigKey),
		Port:           config.GetString(appconfig.DBPortConfigKey),
		Database:       config.GetString(appconfig.DBNameConfigKey),
		Username:       config.GetString(appconfig.DBUsernameConfigKey),
		Password:       config.GetString(appconfig.DBPasswordConfigKey),
		SSLMode:        config.GetString(appconfig.DBSSLModeConfigKey),
		MaxConnections: config.GetInt(appconfig.DBMaxConnections),
	}
	store, err := storage.NewStore(dbConfig, ldClient)
	if err != nil {
		fmt.Printf("Failed to get new database: %v", err)
		t.Fail()
	}

	env, err := appconfig.NewEnvironment(config.GetString(appconfig.EnvironmentKey))
	if err != nil {
		fmt.Printf("Failed to get environment: %v", err)
		t.Fail()
	}
	testSuite := &IntegrationTestSuite{
		Suite:       suite.Suite{},
		environment: env,
		logger:      logger,
		config:      config,
		server:      testServer,
		user:        user{euaID: config.GetString("OKTA_TEST_USERNAME"), accessToken: accessToken},
		store:       store,
		base:        handlers.NewHandlerBase(),
	}
	createTestPrincipal(store, testSuite.user.euaID)

	suite.Run(t, testSuite)
}

// createTestPrincipal creates a test principal in the database. It bypasses a call to OKTA, and just creates mock data
func createTestPrincipal(store *storage.Store, userName string) *authentication.EUAPrincipal {

	// userAccount, _ := userhelpers.GetOrCreateUserAccount(context.Background(), store, store, userName, true, userhelpers.GetOktaAccountInfoWrapperFunction(userhelpers.GetUserInfoFromOktaLocal))
	tAccount := authentication.UserAccount{
		Username:    userName,
		CommonName:  userName + "Doe",
		Locale:      "en_US",
		Email:       userName + "@local.cms.gov",
		GivenName:   userName,
		FamilyName:  "Doe",
		ZoneInfo:    "America/Los_Angeles",
		HasLoggedIn: true,
	}

	userAccount, _ := store.UserAccountCreate(store, &tAccount) //swallow error
	princ := &authentication.EUAPrincipal{
		EUAID:       userName,
		JobCodeEASi: true,
		JobCodeGRT:  true,
		UserAccount: userAccount,
	}
	return princ

}
