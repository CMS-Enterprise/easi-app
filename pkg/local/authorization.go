package local

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/go-openapi/swag"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/authn"
)

// DevUserConfig is the set of values that can be passed in a request header
type DevUserConfig struct {
	EUA      string   `json:"eua"`
	JobCodes []string `json:"jobCodes"`
}

func authorizeMiddleware(logger *zap.Logger, next http.Handler) http.Handler {
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

			logger.Info("Using local authorization middleware and populating EUA ID and job codes")
			ctx := appcontext.WithPrincipal(r.Context(), &authn.EUAPrincipal{
				EUAID:       config.EUA,
				JobCodeEASi: true,
				JobCodeGRT:  swag.ContainsStrings(config.JobCodes, "EASI_D_GOVTEAM")})
			next.ServeHTTP(w, r.WithContext(ctx))
		}
	})
}

// NewLocalAuthorizeMiddleware stubs out context info while ignoring remote authorization
func NewLocalAuthorizeMiddleware(logger *zap.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return authorizeMiddleware(logger, next)
	}
}
