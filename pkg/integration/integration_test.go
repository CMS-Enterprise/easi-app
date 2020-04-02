package integration

// integration is a package for testing application routes
// it should attempt to mock as few dependencies as possible
// and simulate production application use

import (
	"fmt"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/spf13/viper"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/server"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

// test user for authorization
type user struct {
	euaID       string
	accessToken string
}

type IntegrationTestSuite struct {
	suite.Suite
	environment string
	logger      *zap.Logger
	config      *viper.Viper
	server      *httptest.Server
	user        user
}

func TestIntegrationTestSuite(t *testing.T) {
	config := viper.New()
	config.AutomaticEnv()

	easiServer := server.NewServer(config)
	testServer := httptest.NewServer(easiServer)
	defer testServer.Close()

	oktaDomain := config.GetString("OKTA_DOMAIN")
	oktaIssuer := config.GetString("OKTA_ISSUER")
	oktaClientID := config.GetString("OKTA_CLIENT_ID")
	oktaRedirectURL := config.GetString("OKTA_REDIRECT_URI")
	username := config.GetString("OKTA_TEST_USERNAME")
	password := config.GetString("OKTA_TEST_PASSWORD")
	secret := config.GetString("OKTA_TEST_SECRET")
	accessToken := config.GetString("OKTA_ACCESS_TOKEN")

	var err error
	if accessToken == "" {
		accessToken, err = testhelpers.OktaAccessToken(
			oktaDomain,
			oktaIssuer,
			oktaClientID,
			oktaRedirectURL,
			username,
			password,
			secret,
		)
		if err != nil {
			fmt.Println("Failed to get access token for integration testing")
			t.Fail()
		}
		err = os.Setenv("OKTA_ACCESS_TOKEN", accessToken)
		if err != nil {
			fmt.Println("Failed to set okta access key in env")
		}
	}

	testSuite := &IntegrationTestSuite{
		Suite:       suite.Suite{},
		environment: config.GetString("ENVIRONMENT"),
		logger:      zap.NewNop(),
		config:      config,
		server:      testServer,
		user:        user{euaID: username, accessToken: accessToken},
	}

	if !testing.Short() && config.Get("ENVIRONMENT") == "local" {
		suite.Run(t, testSuite)
	}
}
