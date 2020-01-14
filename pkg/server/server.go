// Package server is some throwaway server code to setup testing
package server

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

	"github.com/spf13/viper"

	"github.com/cmsgov/easi-app/pkg/handlers"
)

func corsHandler(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Access-Control-Allow-Origin", viper.GetString("CLIENT_ADDRESS"))
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, Authorization")

		next.ServeHTTP(w, r)
	})
}

// Serve serves all the handlers
func Serve() {
	r := mux.NewRouter()
	fmt.Print("Serving application on localhost:8080")
	r.HandleFunc("/", corsHandler(authorizeHandler(handlers.LandingHandler{})))
	log.Fatal(http.ListenAndServe(":8080", r))
}
