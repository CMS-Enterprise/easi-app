package server

import (
	"github.com/cmsgov/easi-app/pkg/cedar"
	"github.com/cmsgov/easi-app/pkg/handlers"
)

func (s *server) routes() {
	cedarClient := cedar.NewTranslatedClient(s.Config.GetString("CEDAR_API_KEY"))
	systemHandler := handlers.SystemsListHandler{FetchSystems: cedarClient.FetchSystems}
	s.router.HandleFunc("/systems/", s.corsMiddleware(s.authorizeHandler(systemHandler.Handle())))
}
