package local

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/go-openapi/swag"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/authentication"
)

// If you're developing interfaces with CEDAR LDAP and you want to use Okta login on the frontend,
// you may need to set the LOCAL_TEST_EUAID variable to your a valid EUAID (such as your own)
const defaultTestEUAID = "ABCD"

// DevUserConfig is the set of values that can be passed in a request header
type DevUserConfig struct {
	EUA      string   `json:"euaId"`
	JobCodes []string `json:"jobCodes"`
}

func authorizeMiddleware(logger *zap.Logger, next http.Handler, testEUAID string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		logger.Info("Using local authorization middleware")

		if len(r.Header["Authorization"]) == 0 {
			logger.Info("No Authentication header present")
			next.ServeHTTP(w, r)
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		tokenParts := strings.Split(r.Header["Authorization"][0], "Bearer ")
		if len(tokenParts) < 2 {
			logger.Error("invalid Bearer in auth header")
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		devUserConfigJSON := tokenParts[1]
		if devUserConfigJSON == "" {
			logger.Error("empty dev user config JSON")
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		config := DevUserConfig{}
		if parseErr := json.Unmarshal([]byte(devUserConfigJSON), &config); parseErr != nil {
			// Assume at this point that we've opted for Okta login on the frontend.
			euaID := defaultTestEUAID
			if testEUAID != "" {
				euaID = testEUAID
			}
			logger.Info("Using local authorization middleware with Okta frontend login")
			ctx := appcontext.WithPrincipal(r.Context(), &authentication.EUAPrincipal{
				EUAID:            euaID,
				JobCodeEASi:      true,
				JobCodeGRT:       true,
				JobCode508Tester: true,
				JobCode508User:   true,
			})
			next.ServeHTTP(w, r.WithContext(ctx))
			return
		}

		logger.Info("Using local authorization middleware and populating EUA ID and job codes")
		ctx := appcontext.WithPrincipal(r.Context(), &authentication.EUAPrincipal{
			EUAID:            config.EUA,
			JobCodeEASi:      true,
			JobCodeGRT:       swag.ContainsStrings(config.JobCodes, "EASI_D_GOVTEAM"),
			JobCode508User:   swag.ContainsStrings(config.JobCodes, "EASI_D_508_USER"),
			JobCode508Tester: swag.ContainsStrings(config.JobCodes, "EASI_D_508_TESTER"),
		})
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// NewLocalAuthorizeMiddleware stubs out context info while ignoring remote authorization
func NewLocalAuthorizeMiddleware(logger *zap.Logger, testEUAID string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return authorizeMiddleware(logger, next, testEUAID)
	}
}
