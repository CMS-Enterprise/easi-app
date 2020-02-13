package handlers

import (
	"encoding/json"
	"net/http"
)

// HealthCheckHandler returns the API status
type HealthCheckHandler struct{}

type status string

const (
	statusPass status = "pass"
)

type healthCheck struct {
	Status status `json:"status"`
}

// Handle handles a web request and returns a healthcheck JSON payload
func (h HealthCheckHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		js, err := json.Marshal(healthCheck{Status: statusPass})
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")

		_, err = w.Write(js)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}
