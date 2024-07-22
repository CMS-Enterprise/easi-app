package authorization

import (
	"net/http"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/authentication"
)

func requirePrincipalMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		logger := appcontext.ZLogger(r.Context())

		principal := appcontext.Principal(r.Context())

		if principal == authentication.ANON {
			logger.Info("Authorization failure: principal not found in context")

			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			_, writeErr := w.Write([]byte(`{"errors": [{"message": "Unauthorized"}]}`))
			if writeErr != nil {
				logger.Error("failed to write response body")
			}
			return
		}

		next.ServeHTTP(w, r)
	})
}

// NewRequirePrincipalMiddleware returns a wrapper for HandlerFunc that
// ensures that a principal has been authenticated
func NewRequirePrincipalMiddleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return requirePrincipalMiddleware(next)
	}
}
