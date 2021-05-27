package integration

// integration is a package for testing application routes
// it should attempt to mock as few dependencies as possible
// and simulate production application use

import (
	"fmt"
	"net/http/httptest"
	"testing"

	"github.com/spf13/viper"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cmsgov/easi-app/pkg/appconfig"
	"github.com/cmsgov/easi-app/pkg/handlers"
	"github.com/cmsgov/easi-app/pkg/server"
	"github.com/cmsgov/easi-app/pkg/storage"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
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
	if testing.Short() {
		t.Skip("skipping integration tests in `-short` mode")
	}
	config := testhelpers.NewConfig()
	easiServer := server.NewServer(config)
	testServer := httptest.NewServer(easiServer)
	defer testServer.Close()

	accessToken, err := testhelpers.OktaAccessToken(config)
	if err != nil {
		fmt.Printf("Failed to get access token for integration testing with error: %s", err)
		t.Fail()
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
	store, err := storage.NewStore(logger, dbConfig, ldClient)
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
		base:        handlers.NewHandlerBase(logger),
	}

	suite.Run(t, testSuite)
}
