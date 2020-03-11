package server

import (
	"net/http"

	"github.com/cmsgov/easi-app/pkg/cedar"
	"github.com/cmsgov/easi-app/pkg/handlers"
)

func (s *server) routes(
	authorizationMiddleware func(handler http.Handler) http.Handler,
	corsMiddleware func(handler http.Handler) http.Handler,
	traceMiddleware func(handler http.Handler) http.Handler,
	loggerMiddleware func(handler http.Handler) http.Handler) {

	// trace all requests with an ID
	s.router.Use(traceMiddleware)

	// add a request based logger
	s.router.Use(loggerMiddleware)

	// health check goes directly on the main router to avoid auth
	s.router.HandleFunc("/api/v1/healthcheck", handlers.HealthCheckHandler{}.Handle())

	// set up CEDAR client
	cedarClient := cedar.NewTranslatedClient(s.Config.GetString("CEDAR_API_KEY"))

	// API base path is versioned
	api := s.router.PathPrefix("/api/v1").Subrouter()

	// endpoint for system list
	systemHandler := handlers.SystemsListHandler{
		FetchSystems: cedarClient.FetchSystems,
		Logger:       s.logger,
	}
	api.Handle("/systems", systemHandler.Handle())

	// protect all API routes with authorization middleware
	api.Use(authorizationMiddleware)

	// wrap with CORs
	api.Use(corsMiddleware)
}
