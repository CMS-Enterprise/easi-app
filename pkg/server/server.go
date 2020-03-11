// Package server is for setting up the server.
package server

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/spf13/viper"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/okta"
)

type server struct {
	router *mux.Router
	Config *viper.Viper
	logger *zap.Logger
}

func (s *server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	s.router.ServeHTTP(w, r)
}

// Serve sets up the dependencies for a server and serves all the handlers
func Serve(config *viper.Viper) {
	// Set up logger first so we can use it
	zapLogger, err := zap.NewProduction()
	if err != nil {
		log.Fatal("Failed to initial logger.")
	}

	// Set the router
	r := mux.NewRouter()

	// TODO: We should add some sort of config verifier to make sure these configs exist
	// They may live in /cmd, but should fail quick on startup
	var authMiddleware func(http.Handler) http.Handler
	// set an empty auth handle for local development
	if config.GetString("ENVIRONMENT") == "local" {
		authMiddleware = func(next http.Handler) http.Handler {
			return next
		}
	} else {
		authMiddleware = okta.NewOktaAuthorizeMiddleware(
			zapLogger,
			config.GetString("OKTA_CLIENT_ID"),
			config.GetString("OKTA_ISSUER"),
		)
	}

	// set up server dependencies
	clientAddress := config.GetString("CLIENT_ADDRESS")

	s := &server{
		router: r,
		Config: config,
		logger: zapLogger,
	}

	// set up routes
	s.routes(
		authMiddleware,
		newCORSMiddleware(clientAddress),
		NewTraceMiddleware(zapLogger),
		NewLoggerMiddleware(zapLogger))

	// start the server
	zapLogger.Info("Serving application on localhost:8080")
	err = http.ListenAndServe(":8080", s)
	if err != nil {
		zapLogger.Fatal("Failed to start server")
	}
}
