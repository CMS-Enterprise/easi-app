package okta

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/spf13/viper"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

type OktaTestSuite struct {
	suite.Suite
	logger *zap.Logger
	config *viper.Viper
}

func TestOktaTestSuite(t *testing.T) {
	config := viper.New()
	config.AutomaticEnv()

	testSuite := &OktaTestSuite{
		Suite:  suite.Suite{},
		logger: zap.NewNop(),
		config: config,
	}

	if !testing.Short() {
		suite.Run(t, testSuite)
	}
}

func (s OktaTestSuite) TestAuthorizeMiddleware() {
	oktaDomain := s.config.GetString("OKTA_DOMAIN")
	oktaIssuer := s.config.GetString("OKTA_ISSUER")
	oktaClientID := s.config.GetString("OKTA_CLIENT_ID")
	oktaRedirectURL := s.config.GetString("OKTA_REDIRECT_URI")
	username := s.config.GetString("OKTA_TEST_USERNAME")
	password := s.config.GetString("OKTA_TEST_PASSWORD")
	secret := s.config.GetString("OKTA_TEST_SECRET")
	accessToken, err := testhelpers.OktaAccessToken(
		oktaDomain,
		oktaIssuer,
		oktaClientID,
		oktaRedirectURL,
		username,
		password,
		secret,
	)
	s.NoError(err, "couldn't get access token")
	s.NotEmpty(accessToken, "empty access token")
	authMiddleware := NewOktaAuthorizeMiddleware(
		s.logger,
		oktaClientID,
		oktaIssuer,
	)

	s.Run("a valid token executes the handler", func() {
		req := httptest.NewRequest("GET", "/systems/", nil)
		req.Header.Set("AUTHORIZATION", fmt.Sprintf("Bearer %s", accessToken))
		rr := httptest.NewRecorder()
		handlerRun := false
		testHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			handlerRun = true
		})

		authMiddleware(testHandler).ServeHTTP(rr, req)

		s.True(handlerRun)
	})

	s.Run("a invalid token does not execute the handler", func() {
		req := httptest.NewRequest("GET", "/systems/", nil)
		req.Header.Set("AUTHORIZATION", fmt.Sprintf("Bearer isNotABear"))
		rr := httptest.NewRecorder()
		handlerRun := false
		testHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			handlerRun = true
		})

		authMiddleware(testHandler).ServeHTTP(rr, req)

		s.False(handlerRun)
	})

	s.Run("an empty token does not execute the handler", func() {
		req := httptest.NewRequest("GET", "/systems/", nil)
		rr := httptest.NewRecorder()
		handlerRun := false
		testHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			handlerRun = true
		})

		authMiddleware(testHandler).ServeHTTP(rr, req)

		s.False(handlerRun)
	})

	s.Run("valid token has an EUA ID in context", func() {
		req := httptest.NewRequest("GET", "/systems/", nil)
		req.Header.Set("AUTHORIZATION", fmt.Sprintf("Bearer %s", accessToken))
		rr := httptest.NewRecorder()
		testHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			euaID, ok := appcontext.EuaID(r.Context())
			s.True(ok)
			s.Equal(username, euaID)
		})

		authMiddleware(testHandler).ServeHTTP(rr, req)
	})

}
