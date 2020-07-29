package local

import (
	"net/http"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

// If you're developing interfaces with LDAP, you may need to change this to your own EUA ID for testing purposes
const testEUAID = "ABCD"

func authorizeMiddleware(logger *zap.Logger, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		logger.Info("Using local authorization middleware and populating EUA ID")
		ctx := appcontext.WithUser(r.Context(), models.User{EUAUserID: testEUAID})
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// NewLocalAuthorizeMiddleware stubs out context info while ignoring remote authorization
func NewLocalAuthorizeMiddleware(logger *zap.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return authorizeMiddleware(logger, next)
	}
}
