// Package server is for setting up the server.
package server

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/spf13/viper"

	"github.com/cmsgov/easi-app/pkg/okta"
)

type server struct {
	router           *mux.Router
	Config           *viper.Viper
	authorizeWrapper func(http.HandlerFunc) http.HandlerFunc
}

func (s *server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	s.router.ServeHTTP(w, r)
}

// Serve serves all the handlers
func Serve(config *viper.Viper) {
	r := mux.NewRouter()
	// TODO: We should add some sort of config verifier to make sure these configs exist
	// They may live in /cmd, but should fail quick on startup
	authWrapper := okta.NewOktaAuthorizeWrapper(
		config.GetString("OKTA_CLIENT_ID"),
		config.GetString("OKTA_ISSUER"),
	)
	s := &server{
		router:           r,
		Config:           config,
		authorizeWrapper: authWrapper,
	}
	fmt.Print("Serving application on localhost:8080")
	s.routes()
	log.Fatal(http.ListenAndServe(":8080", s))
}
