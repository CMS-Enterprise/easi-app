package server

import "github.com/cmsgov/easi-app/pkg/handlers"

func (s *server) routes() {
	s.router.HandleFunc("/", s.corsMiddleware(s.authorizeHandler(s.handleLanding())))
	s.router.HandleFunc("/systems/", s.corsMiddleware(s.authorizeHandler(handlers.SystemsListHandler{}.Handle())))
}
