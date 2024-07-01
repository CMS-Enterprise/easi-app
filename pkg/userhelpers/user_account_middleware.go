package userhelpers

import (
	"net/http"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/authentication"
)

func userAccountServiceMiddleware(userFunction authentication.GetUserAccountFromDBFunc, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		nextCtx := appcontext.WithUserAccountService(r.Context(), userFunction)
		r = r.WithContext(nextCtx)
		next.ServeHTTP(w, r)
	})
}

// NewUserAccountServiceMiddleware creates a new middleware which decorates the context with a authentication.GetUserAccountFromDBFunc
func NewUserAccountServiceMiddleware(userFunction authentication.GetUserAccountFromDBFunc) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return userAccountServiceMiddleware(userFunction, next)
	}
}
