package server

import (
	"github.com/cmsgov/easi-app/pkg/handlers"
	"github.com/cmsgov/easi-app/pkg/services"
)

func (s *server) routes() {
	api := s.router.PathPrefix("/api/v1").Subrouter()
	api.HandleFunc("/systems/", s.corsMiddleware(s.authorizeHandler(handlers.SystemsListHandler{FetchSystems: services.NewFetchFakeSystems()}.Handle())))
	api.HandleFunc("/healthcheck", handlers.HealthCheckHandler{}.Handle())
}
