package server

import (
	"context"
	"net/http"
)

func contextMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		next.ServeHTTP(w, r.WithContext(context.WithoutCancel(ctx)))
	})
}

// newContextMiddleware returns a handler which removes cancellation functionality from `ctx`
func newContextMiddleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return contextMiddleware(next)
	}
}
