package okta

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

type OktaTestSuite struct {
	suite.Suite
	logger *zap.Logger
}

func TestOktaTestSuite(t *testing.T) {
	// TODO: replace `os` with another package for handling env
	testSuite := &OktaTestSuite{
		Suite:  suite.Suite{},
		logger: zap.NewNop(),
	}

	if !testing.Short() {
		suite.Run(t, testSuite)
	}
}

func (s OktaTestSuite) TestAuthorizeMiddleware() {
	oktaDomain := os.Getenv("OKTA_DOMAIN")
	oktaIssuer := os.Getenv("OKTA_ISSUER")
	oktaClientID := os.Getenv("OKTA_CLIENT_ID")
	oktaRedirectURL := os.Getenv("OKTA_REDIRECT_URI")
	username := os.Getenv("OKTA_TEST_USERNAME")
	password := os.Getenv("OKTA_TEST_PASSWORD")
	secret := os.Getenv("OKTA_TEST_SECRET")
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

}
