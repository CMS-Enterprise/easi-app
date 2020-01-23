package server

import (
	"github.com/cmsgov/easi-app/pkg/handlers"
	"github.com/cmsgov/easi-app/pkg/services"
)

func (s *server) routes() {
	s.router.HandleFunc("/systems/", s.corsMiddleware(s.authorizeHandler(handlers.SystemsListHandler{FetchSystems: services.NewFetchFakeSystems()}.Handle())))
}
