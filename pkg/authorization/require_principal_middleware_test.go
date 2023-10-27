package authorization

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/authentication"
)

type AuthorizationTestSuite struct {
	suite.Suite
	logger *zap.Logger
}

func TestAuthorizationTestSuite(t *testing.T) {
	testSuite := &AuthorizationTestSuite{
		Suite:  suite.Suite{},
		logger: zap.NewNop(),
	}

	suite.Run(t, testSuite)
}

func (s *AuthorizationTestSuite) TestAllowsAuthenticatedRequests() {
	principal := authentication.EUAPrincipal{EUAID: "QQQQ"}
	req := httptest.NewRequest("GET", "/", nil)
	req = req.WithContext(appcontext.WithPrincipal(req.Context(), &principal))

	rr := httptest.NewRecorder()
	hasHandlerRun := false
	testHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		hasHandlerRun = true
	})

	middleware := requirePrincipalMiddleware(testHandler)
	middleware.ServeHTTP(rr, req)

	s.True(hasHandlerRun) // middleware should have accepted the authenticated request and called testHandler
}

func (s *AuthorizationTestSuite) TestRejectsAnonymousRequests() {
	req := httptest.NewRequest("GET", "/", nil)

	rr := httptest.NewRecorder()
	hasHandlerRun := false
	testHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		hasHandlerRun = true
	})

	middleware := requirePrincipalMiddleware(testHandler)
	middleware.ServeHTTP(rr, req)

	s.False(hasHandlerRun) // middleware should have rejected the anonymous request and responded without calling testHandler

	var payload struct {
		Errors []struct {
			Message string
		}
	}

	result := rr.Result()

	s.Equal(http.StatusUnauthorized, result.StatusCode)

	decoder := json.NewDecoder(result.Body)
	decodeErr := decoder.Decode(&payload)
	s.Nil(decodeErr)

	s.Equal(1, len(payload.Errors))
	s.Equal("Unauthorized", payload.Errors[0].Message)
}
