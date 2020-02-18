package server

import (
	"encoding/json"

	"github.com/cmsgov/easi-app/pkg/cedar"
	"github.com/cmsgov/easi-app/pkg/handlers"
)

func (s *server) routes() {
	// set to standard library marshaller
	marshalFunc := json.Marshal

	// set up CEDAR client
	cedarClient := cedar.NewTranslatedClient(s.Config.GetString("CEDAR_API_KEY"))

	// API base path is versioned
	api := s.router.PathPrefix("/api/v1").Subrouter()

	// endpoint for system list
	systemHandler := handlers.SystemsListHandler{
		FetchSystems: cedarClient.FetchSystems,
		Marshal:      marshalFunc,
	}
	api.HandleFunc("/systems", systemHandler.Handle())

	// health check endpoint
	api.HandleFunc("/healthcheck", handlers.HealthCheckHandler{}.Handle())
}
