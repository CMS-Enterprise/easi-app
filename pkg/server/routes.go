package server

import (
	"encoding/json"
	"net/http"

	"github.com/cmsgov/easi-app/pkg/cedar"
	"github.com/cmsgov/easi-app/pkg/handlers"
)

func (s *server) routes(
	authorizationMiddleware func(handler http.Handler) http.Handler,
	corsMiddleware func(handler http.Handler) http.Handler) {

	// set to standard library marshaller
	marshalFunc := json.Marshal

	healthCheckHandler := handlers.HealthCheckHandler{
		Config: s.Config,
	}
	// health check goes directly on the main router to avoid auth
	s.router.HandleFunc("/api/v1/healthcheck", healthCheckHandler.Handle())

	// set up CEDAR client
	cedarClient := cedar.NewTranslatedClient(s.Config.GetString("CEDAR_API_KEY"))

	// API base path is versioned
	api := s.router.PathPrefix("/api/v1").Subrouter()

	// endpoint for system list
	systemHandler := handlers.SystemsListHandler{
		FetchSystems: cedarClient.FetchSystems,
		Marshal:      marshalFunc,
		Logger:       s.logger,
	}
	api.Handle("/systems", systemHandler.Handle())

	// protect all API routes with authorization middleware
	api.Use(authorizationMiddleware)

	// wrap with CORs
	api.Use(corsMiddleware)
}
