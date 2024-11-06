package dataloaders

import (
	"net/http"

	"github.com/gorilla/mux"
)

func dataloaderMiddleware(buildDataloaders BuildDataloaders, next http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := CTXWithLoaders(r.Context(), buildDataloaders)
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	}
}

func NewDataloaderMiddleware(buildDataloaders BuildDataloaders) mux.MiddlewareFunc {
	return func(next http.Handler) http.Handler {
		return dataloaderMiddleware(buildDataloaders, next)
	}
}
