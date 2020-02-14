package server

import (
	"github.com/cmsgov/easi-app/pkg/cedar"
	"github.com/cmsgov/easi-app/pkg/handlers"
)

func (s *server) routes() {
	api := s.router.PathPrefix("/api/v1").Subrouter()
	cedarClient := cedar.NewTranslatedClient(s.Config.GetString("CEDAR_API_KEY"))
	systemHandler := handlers.SystemsListHandler{FetchSystems: cedarClient.FetchSystems}
	api.HandleFunc("/systems", s.corsMiddleware(s.authorizeHandler(systemHandler.Handle())))
	api.HandleFunc("/healthcheck", handlers.HealthCheckHandler{}.Handle())
}
