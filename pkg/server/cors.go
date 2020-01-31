package server

import (
	"net/http"
)

func (s *server) corsMiddleware(next http.HandlerFunc) http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Access-Control-Allow-Origin", s.Config.GetString("CLIENT_ADDRESS"))
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, Authorization")

		next.ServeHTTP(w, r)
	}
}
