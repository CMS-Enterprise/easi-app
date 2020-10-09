package local

import (
	"net/http"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/authn"
)

// If you're developing interfaces with LDAP, you may need to set the LOCAL_TEST_EUAID variable to your a valid EUAID (such as your own)
const defaultTestEUAID = "ABCD"

func authorizeMiddleware(logger *zap.Logger, next http.Handler, testEUAID string) http.Handler {
	euaID := defaultTestEUAID
	if testEUAID != "" {
		euaID = testEUAID
	}
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		logger.Info("Using local authorization middleware and populating EUA ID")
		ctx := appcontext.WithPrincipal(r.Context(), &authn.EUAPrincipal{EUAID: euaID, JobCodeEASi: true})
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// NewLocalAuthorizeMiddleware stubs out context info while ignoring remote authorization
func NewLocalAuthorizeMiddleware(logger *zap.Logger, testEUAID string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return authorizeMiddleware(logger, next, testEUAID)
	}
}
