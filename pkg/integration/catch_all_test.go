package integration

import (
	"net/http"
	"net/http/httptest"

	"github.com/cmsgov/easi-app/pkg/handlers"
)

func (s *IntegrationTestSuite) TestCatchAllRoute() {
	s.Run("get /", func() {
		req, err := http.NewRequest("GET", "/notapath", nil)
		s.NoError(err)
		rr := httptest.NewRecorder()

		handlers.CatchAllHandler{
			Logger: s.logger,
		}.Handle()(rr, req)

		s.Equal(http.StatusNotFound, rr.Code)
	})

	s.Run("get /api/v1/notapath", func() {
		req, err := http.NewRequest("GET", "/api/v1/notapath", nil)
		s.NoError(err)
		rr := httptest.NewRecorder()

		handlers.CatchAllHandler{
			Logger: s.logger,
		}.Handle()(rr, req)

		s.Equal(http.StatusNotFound, rr.Code)
	})
}
