package local

import (
	"encoding/json"
	"net/http"
	"strings"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/authn"
)


// DevUserConfig is the set of values that can be passed in a request header
type DevUserConfig struct {
	EUA      string   `json:"eua"`
	JobCodes []string `json:"jobCodes"`
}
// If you're developing interfaces with LDAP, you may need to set the LOCAL_TEST_EUAID variable to your a valid EUAID (such as your own)
const defaultTestEUAID = "ABCD"

func authorizeMiddleware(logger *zap.Logger, next http.Handler, testEUAID string) http.Handler {
	euaID := defaultTestEUAID
	if testEUAID != "" {
		euaID = testEUAID
	}
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		logger.Info("Using local authorization middleware")

		if len(r.Header["Authorization"]) == 0 {
			logger.Info("No Authentication header present")
			next.ServeHTTP(w, r)
		} else {
			tokenParts := strings.Split(r.Header["Authorization"][0], "Bearer ")
			if len(tokenParts) < 2 {
				logger.Fatal("invalid Bearer in auth header")
			}
			devUserConfigJSON := tokenParts[1]
			if devUserConfigJSON == "" {
				logger.Fatal("empty dev user config JSON")
			}

			config := DevUserConfig{}
			if parseErr := json.Unmarshal([]byte(devUserConfigJSON), &config); parseErr != nil {
				logger.Fatal("could not parse dev user config")

			}

			logger.Info("Using local authorization middleware and populating EUA ID")
		  ctx := appcontext.WithPrincipal(r.Context(), &authn.EUAPrincipal{EUAID: euaID, JobCodeEASi: true, JobCodeGRT: true})
		  next.ServeHTTP(w, r.WithContext(ctx))
		}
	})
}

// NewLocalAuthorizeMiddleware stubs out context info while ignoring remote authorization
func NewLocalAuthorizeMiddleware(logger *zap.Logger, testEUAID string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return authorizeMiddleware(logger, next, testEUAID)
	}
}
