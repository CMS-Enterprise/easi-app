package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"

	"github.com/spf13/viper"
)

func (s HandlerTestSuite) TestHealthcheckHandler() {
	rr := httptest.NewRecorder()

	mockViper := viper.New()
	mockViper.SetDefault("APPLICATION_DATETIME", "mockdatetime")
	mockViper.SetDefault("APPLICATION_TS", "mocktimestamp")
	mockViper.SetDefault("APPLICATION_VERSION", "mockversion")

	mockHealthCheckHandler := HealthCheckHandler{
		HandlerBase: s.base,
		Config:      mockViper,
	}
	mockHealthCheckHandler.Handle()(rr, nil)

	s.Equal(http.StatusOK, rr.Code)

	var healthCheckActual healthCheck
	err := json.Unmarshal(rr.Body.Bytes(), &healthCheckActual)

	s.NoError(err)
	s.Equal(statusPass, healthCheckActual.Status)
	s.Equal("mockdatetime", healthCheckActual.Datetime)
	s.Equal("mockversion", healthCheckActual.Version)
	s.Equal("mocktimestamp", healthCheckActual.Timestamp)
}
