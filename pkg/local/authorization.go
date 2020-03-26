package local

import (
	"net/http"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/context"
)

const testEUAID = "ABCD"

func authorizeMiddleware(logger *zap.Logger, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		logger.Info("Using local authorization middleware and populating EUA ID")
		ctx := context.WithEuaID(r.Context(), testEUAID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// NewLocalAuthorizeMiddleware stubs out context info while ignoring remote authorization
func NewLocalAuthorizeMiddleware(logger *zap.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return authorizeMiddleware(logger, next)
	}
}
