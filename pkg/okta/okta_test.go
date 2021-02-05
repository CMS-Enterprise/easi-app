package okta

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	jwtverifier "github.com/okta/okta-jwt-verifier-golang"
	"github.com/spf13/viper"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/handlers"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

type OktaTestSuite struct {
	suite.Suite
	logger *zap.Logger
	config *viper.Viper
}

func TestOktaTestSuite(t *testing.T) {
	config := testhelpers.NewConfig()

	testSuite := &OktaTestSuite{
		Suite:  suite.Suite{},
		logger: zap.NewNop(),
		config: config,
	}

	if false && !testing.Short() {
		suite.Run(t, testSuite)
	}
}

func (s OktaTestSuite) TestAuthenticationMiddleware() {
	accessToken, err := testhelpers.OktaAccessToken(s.config)
	s.NoError(err, "couldn't get access token")
	s.NotEmpty(accessToken, "empty access token")
	authMiddleware := NewOktaAuthorizeMiddleware(
		handlers.NewHandlerBase(s.logger),
		s.config.GetString("OKTA_CLIENT_ID"),
		s.config.GetString("OKTA_ISSUER"),
		false,
	)

	s.Run("a valid token executes the handler", func() {
		req := httptest.NewRequest("GET", "/systems/", nil)
		req.Header.Set("AUTHORIZATION", fmt.Sprintf("Bearer %s", accessToken))
		rr := httptest.NewRecorder()
		handlerRun := false
		authorized := false
		testHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			handlerRun = true
			authorized = appcontext.Principal(r.Context()).AllowEASi()
		})

		authMiddleware(testHandler).ServeHTTP(rr, req)

		s.True(handlerRun)
		s.True(authorized)
	})

	s.Run("a invalid token executes handler but not authorized", func() {
		req := httptest.NewRequest("GET", "/systems/", nil)
		req.Header.Set("AUTHORIZATION", fmt.Sprintf("Bearer isNotABear"))
		rr := httptest.NewRecorder()
		handlerRun := false
		authorized := false
		testHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			handlerRun = true
			authorized = appcontext.Principal(r.Context()).AllowEASi()
		})

		authMiddleware(testHandler).ServeHTTP(rr, req)

		s.True(handlerRun)
		s.False(authorized)
	})

	s.Run("an empty token executes handler but not authorized", func() {
		req := httptest.NewRequest("GET", "/systems/", nil)
		rr := httptest.NewRecorder()
		handlerRun := false
		authorized := false
		testHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			handlerRun = true
			authorized = appcontext.Principal(r.Context()).AllowEASi()
		})

		authMiddleware(testHandler).ServeHTTP(rr, req)

		s.True(handlerRun)
		s.False(authorized)
	})

	s.Run("valid token has an EUA ID in context", func() {
		req := httptest.NewRequest("GET", "/systems/", nil)
		req.Header.Set("AUTHORIZATION", fmt.Sprintf("Bearer %s", accessToken))
		rr := httptest.NewRecorder()
		testHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// ensure the Principal is has replaced the User
			principal := appcontext.Principal(r.Context())
			s.True(principal.AllowEASi(), "AllowEASi()")
			s.Equal(s.config.GetString("OKTA_TEST_USERNAME"), principal.ID(), "ID()")
		})

		authMiddleware(testHandler).ServeHTTP(rr, req)
	})

}

func TestJobCodes(t *testing.T) {
	payload := `
	{
		"sub":"NASA",
		"groups":[
			"EX_SPACE",
			"EX_HOUSTON",
			"EX_MARS"
		]
	}
	`
	claims := map[string]interface{}{}
	if err := json.Unmarshal([]byte(payload), &claims); err != nil {
		t.Fatalf("incorrect data: %v\n", err)
	}
	jwt := &jwtverifier.Jwt{Claims: claims}

	testCases := map[string]struct {
		jobCode  string
		expected bool
	}{
		"success": {
			jobCode:  "EX_HOUSTON",
			expected: true,
		},
		"failure": {
			jobCode:  "MARIANA_TRENCH",
			expected: false,
		},
	}

	for name, tc := range testCases {
		t.Run(name, func(t *testing.T) {
			result := jwtGroupsContainsJobCode(jwt, tc.jobCode)
			assert.Equal(t, tc.expected, result)
		})
	}
}
