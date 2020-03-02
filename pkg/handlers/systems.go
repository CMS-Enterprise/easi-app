package handlers

import (
	"net/http"

	"github.com/cmsgov/easi-app/pkg/models"
)

type fetchSystems func() (models.SystemShorts, error)
type marshal func(interface{}) ([]byte, error)

// SystemsListHandler is the handler for listing systems
type SystemsListHandler struct {
	FetchSystems fetchSystems
	Marshal      marshal
}

// Handle handles a web request and returns a list of systems
func (h SystemsListHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// TODO: Add logger for errors
		systems, err := h.FetchSystems()
		if err != nil {
			http.Error(w, "failed to fetch systems", http.StatusInternalServerError)
			return
		}

		js, err := h.Marshal(systems)
		// TODO: Add logger for errors
		if err != nil {
			http.Error(w, "failed to fetch systems", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")

		// TODO: Add logger for errors
		_, err = w.Write(js)
		if err != nil {
			http.Error(w, "failed to fetch systems", http.StatusInternalServerError)
			return
		}
	}
}
