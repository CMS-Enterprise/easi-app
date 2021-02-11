package server

import (
	"fmt"
	"net/http"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/handlers"
)

func newAuthorizeEASiMiddleware(base handlers.HandlerBase) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if !appcontext.Principal(r.Context()).AllowEASi() {
				base.WriteErrorResponse(
					r.Context(),
					w,
					&apperrors.UnauthorizedError{
						Err: fmt.Errorf("principal does not have EASi permissions"),
					},
				)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}
