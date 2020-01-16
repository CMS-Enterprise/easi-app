package server

func (s *server) routes() {
	s.router.HandleFunc("/", s.corsMiddleware(s.authorizeHandler(s.handleLanding())))
}
