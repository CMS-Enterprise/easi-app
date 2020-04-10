package handlers

import (
	"bytes"
	"net/http"
	"net/http/httptest"
)

func (s HandlerTestSuite) TestCatchAllHandler() {
	s.Run("catch all handler always returns 404", func() {
		rr := httptest.NewRecorder()
		req, err := http.NewRequest("GET", "/notAURL", bytes.NewBufferString(""))
		s.NoError(err)
		CatchAllHandler{
			Logger: s.logger,
		}.Handle()(rr, req)
		s.Equal(http.StatusNotFound, rr.Code)
	})
}
