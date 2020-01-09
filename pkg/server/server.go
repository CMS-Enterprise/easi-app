// Package server is some throwaway server code to setup testing
package server

import (
	"fmt"
	"github.com/cmsgov/easi-app/pkg/handlers"
	"log"
	"net/http"
)

func corsHandler(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, Authorization")

		next.ServeHTTP(w, r)
	})
}

// Serve serves all the handlers
func Serve() {
	fmt.Print("Serving application on localhost:8080")
	http.Handle("/", corsHandler(authorizeHandler(handlers.LandingHandler{})))
	log.Fatal(http.ListenAndServe(":8080", nil))
}
