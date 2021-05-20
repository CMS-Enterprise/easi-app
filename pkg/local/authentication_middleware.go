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

func authenticateMiddleware(logger *zap.Logger, next http.Handler, testEUAID string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		logger.Info("Using local authorization middleware")

		if len(r.Header["Authorization"]) == 0 {
			next.ServeHTTP(w, r)
			return
		}

		// don't attempt to handle local auth if the Authorization Header doesn't start with "Local"
		if !strings.HasPrefix(r.Header["Authorization"][0], "Local") {
			next.ServeHTTP(w, r)
			return
		}

		tokenParts := strings.Split(r.Header["Authorization"][0], "Local ")
		if len(tokenParts) < 2 {
			logger.Error("invalid local auth header")
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

// NewLocalAuthenticationMiddleware stubs out context info for local (non-Okta) authentication
func NewLocalAuthenticationMiddleware(logger *zap.Logger, testEUAID string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return authenticateMiddleware(logger, next, testEUAID)
	}
}
