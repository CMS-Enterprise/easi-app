// Package server is for setting up the server.
package server

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

type server struct {
	router *mux.Router
}

// Serve serves all the handlers
func Serve() {
	r := mux.NewRouter()
	s := server{
		router: r,
	}
	fmt.Print("Serving application on localhost:8080")
	s.routes()
	log.Fatal(http.ListenAndServe(":8080", s.router))
}
