// Package server is for setting up the server.
package server

import (
	"net/http"

	"github.com/spf13/viper"
)

func (s *server) corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Access-Control-Allow-Origin", viper.GetString("CLIENT_ADDRESS"))
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, Authorization")

		next.ServeHTTP(w, r)
	}
}
