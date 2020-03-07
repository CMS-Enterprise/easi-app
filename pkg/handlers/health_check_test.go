package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
)

func (s HandlerTestSuite) TestHealthcheckHandler() {
	rr := httptest.NewRecorder()

	HealthCheckHandler{}.Handle()(rr, nil)

	s.Equal(http.StatusOK, rr.Code)

	var healthCheckActual healthCheck
	err := json.Unmarshal(rr.Body.Bytes(), &healthCheckActual)

	s.NoError(err)
	s.Equal(statusPass, healthCheckActual.Status)
	s.Equal("", healthCheckActual.Datetime)
	s.Equal("", healthCheckActual.Version)
	s.Equal("", healthCheckActual.Timestamp)
}
