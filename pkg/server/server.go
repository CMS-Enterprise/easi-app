// Package server is for setting up the server.
package server

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/spf13/viper"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appconfig"
	"github.com/cmsgov/easi-app/pkg/flags"
	"github.com/cmsgov/easi-app/pkg/handlers"
	"github.com/cmsgov/easi-app/pkg/local"
	"github.com/cmsgov/easi-app/pkg/okta"
)

// Server holds dependencies for running the EASi server
type Server struct {
	router      *mux.Router
	Config      *viper.Viper
	logger      *zap.Logger
	environment appconfig.Environment
}

func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	s.router.ServeHTTP(w, r)
}

// NewServer sets up the dependencies for a server
func NewServer(config *viper.Viper) *Server {
	// Set up logger first so we can use it
	zapLogger, err := zap.NewProduction()
	if err != nil {
		log.Fatal("Failed to initial logger.")
	}

	// Set environment from config
	environment, err := appconfig.NewEnvironment(config.GetString(appconfig.EnvironmentKey))
	if err != nil {
		zapLogger.Fatal("Unable to set environment", zap.Error(err))
	}

	// Set the router
	r := mux.NewRouter()

	// TODO: We should add some sort of config verifier to make sure these configs exist
	// They may live in /cmd, but should fail quick on startup
	authMiddleware := okta.NewOktaAuthorizeMiddleware(
		handlers.NewHandlerBase(zapLogger),
		config.GetString("OKTA_CLIENT_ID"),
		config.GetString("OKTA_ISSUER"),
	)

	// If we're local use override with local auth middleware
	if environment.Local() {
		authMiddleware = local.NewLocalAuthorizeMiddleware(zapLogger)
	}

	// set up server dependencies
	clientAddress := config.GetString("CLIENT_ADDRESS")

	s := &Server{
		router:      r,
		Config:      config,
		logger:      zapLogger,
		environment: environment,
	}

	// set up routes
	s.routes(
		authMiddleware,
		newCORSMiddleware(clientAddress),
		NewTraceMiddleware(zapLogger),
		NewLoggerMiddleware(zapLogger),
		flags.NewFlagMiddleware(config.GetString("LD_ENV_USER")))

	return s
}

// Serve runs the server
func Serve(config *viper.Viper) {
	s := NewServer(config)
	// start the server
	s.logger.Info("Serving application on port 8080")
	err := http.ListenAndServe(":8080", s)
	if err != nil {
		s.logger.Fatal("Failed to start server")
	}
}
