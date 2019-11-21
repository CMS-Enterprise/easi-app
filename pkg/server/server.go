// Package server is some throwaway server code to setup testing
package server

import (
	"fmt"
	"github.com/cmsgov/easi-app/pkg/handlers"
	"log"
	"net/http"
)

// Serve serves all the handlers
func Serve() {
	fmt.Print("Serving application on localhost:8080")
	http.Handle("/", handlers.LandingHandler{})
	log.Fatal(http.ListenAndServe(":8080", nil))
}
