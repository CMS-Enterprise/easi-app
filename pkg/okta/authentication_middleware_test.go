package okta

import (
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	jwtverifier "github.com/okta/okta-jwt-verifier-golang"
	"github.com/spf13/viper"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/authentication"
	"github.com/cmsgov/easi-app/pkg/handlers"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

type AuthenticationMiddlewareTestSuite struct {
	suite.Suite
	logger *zap.Logger
	config *viper.Viper
}

func TestAuthenticationMiddlewareTestSuite(t *testing.T) {
	config := testhelpers.NewConfig()
	logger := zap.NewNop()

	testSuite := &AuthenticationMiddlewareTestSuite{
		Suite:  suite.Suite{},
		logger: logger,
		config: config,
	}

	suite.Run(t, testSuite)
}

func validJwt() *jwtverifier.Jwt {
	return &jwtverifier.Jwt{
		Claims: map[string]interface{}{
			"groups": []string{},
			"sub":    "EASI",
		},
	}
}

type TestJwtVerifier struct {
	verify func(jwt string) (*jwtverifier.Jwt, error)
}

func (tjv TestJwtVerifier) VerifyAccessToken(jwt string) (*jwtverifier.Jwt, error) {
	return tjv.verify(jwt)
}

func (s AuthenticationMiddlewareTestSuite) buildMiddleware(verify func(jwt string) (*jwtverifier.Jwt, error)) func(http.Handler) http.Handler {
	verifier := TestJwtVerifier{
		verify: verify,
	}

	return NewOktaAuthenticationMiddleware(
		handlers.NewHandlerBase(s.logger),
		verifier,
		false,
	)

}

func (s AuthenticationMiddlewareTestSuite) TestAuthorizeMiddleware() {

	s.Run("a valid token sets the principal", func() {
		authMiddleware := s.buildMiddleware(func(jwt string) (*jwtverifier.Jwt, error) {
			s.Equal("abcdefg", jwt)
			return validJwt(), nil
		})

		req := httptest.NewRequest("GET", "/systems/", nil)
		req.Header.Set("AUTHORIZATION", "Bearer abcdefg")
		rr := httptest.NewRecorder()

		handlerRun := false
		testHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			handlerRun = true

			principal := appcontext.Principal(r.Context())
			s.NotEqual(authentication.ANON, principal)
			s.Equal("EASI", principal.ID())
		})

		authMiddleware(testHandler).ServeHTTP(rr, req)

		s.True(handlerRun)
	})

	s.Run("an invalid token does not execute the handler", func() {
		authMiddleware := s.buildMiddleware(func(jwt string) (*jwtverifier.Jwt, error) {
			return nil, errors.New("invalid token")
		})

		req := httptest.NewRequest("GET", "/systems/", nil)
		req.Header.Set("AUTHORIZATION", "Bearer isNotABear")
		rr := httptest.NewRecorder()

		testHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			s.Fail("handler should not be run")
		})

		authMiddleware(testHandler).ServeHTTP(rr, req)
	})

	s.Run("allows requests without a token to be executed", func() {
		authMiddleware := s.buildMiddleware(func(jwt string) (*jwtverifier.Jwt, error) {
			s.FailNow("there should be no verification without a token")
			return nil, nil
		})

		req := httptest.NewRequest("GET", "/systems/", nil)
		rr := httptest.NewRecorder()

		handlerRun := false
		testHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			handlerRun = true
		})

		authMiddleware(testHandler).ServeHTTP(rr, req)

		s.True(handlerRun)
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
