package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/spf13/viper"
)

// NewHealthCheckHandler is a constructor for HealthCheckHandler
func NewHealthCheckHandler(base HandlerBase, config *viper.Viper) HealthCheckHandler {
	return HealthCheckHandler{
		HandlerBase: base,
		Config:      config,
	}
}

// HealthCheckHandler returns the API status
type HealthCheckHandler struct {
	HandlerBase
	Config *viper.Viper
}

type status string

const (
	statusPass status = "pass"
)

type healthCheck struct {
	Status    status `json:"status"`
	Datetime  string `json:"datetime"`
	Version   string `json:"version"`
	Timestamp string `json:"timestamp"`
}

// Handle handles a web request and returns a healthcheck JSON payload
func (h HealthCheckHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		statusReport := healthCheck{
			Status:    statusPass,
			Version:   h.Config.GetString("APPLICATION_VERSION"),
			Datetime:  h.Config.GetString("APPLICATION_DATETIME"),
			Timestamp: h.Config.GetString("APPLICATION_TS"),
		}
		js, err := json.Marshal(statusReport)
		if err != nil {
			h.WriteErrorResponse(r.Context(), w, err)
			return
		}

		w.Header().Set("Content-Type", "application/json")

		_, err = w.Write(js)
		if err != nil {
			h.WriteErrorResponse(r.Context(), w, err)
			return
		}
	}
}
