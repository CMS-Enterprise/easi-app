// Package server is some throwaway server code to setup testing
package server

import (
	"fmt"
	"log"
	"net/http"
)

// HandleLanding is the handler for the root path
func HandleLanding(w http.ResponseWriter, r *http.Request) {
	_, _ = fmt.Fprint(w, "The EASi web app!")
}

// Serve serves all the handlers
func Serve() {
	fmt.Print("Serving application on localhost:8080")
	http.HandleFunc("/", HandleLanding)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
