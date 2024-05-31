package dataloaders

import (
	"net/http"

	"github.com/gorilla/mux"
)

func dataloaderMiddleware(loaders *DataLoaders, next http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := CTXWithLoaders(r.Context(), loaders)
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	}
}

func NewDataloaderMiddleware(loaders *DataLoaders) mux.MiddlewareFunc {
	return func(next http.Handler) http.Handler {
		return dataloaderMiddleware(loaders, next)
	}
}
