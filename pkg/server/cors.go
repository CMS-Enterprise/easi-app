package server

import (
	"net/http"
)

func newCORSMiddleware(clientAddress string) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

			w.Header().Set("Access-Control-Allow-Origin", clientAddress)
			w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, Authorization")

			next.ServeHTTP(w, r)
		})
	}
}
