// Package server is for setting up the server.
package server

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/spf13/viper"
)

type server struct {
	router *mux.Router
	Config *viper.Viper
}

func (s *server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	s.router.ServeHTTP(w, r)
}

// Serve serves all the handlers
func Serve(config *viper.Viper) {
	r := mux.NewRouter()
	s := &server{
		router: r,
		Config: config,
	}
	fmt.Print("Serving application on localhost:8080")
	s.routes()
	log.Fatal(http.ListenAndServe(":8080", s))
}
