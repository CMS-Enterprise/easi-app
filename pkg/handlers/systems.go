package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/cmsgov/easi-app/pkg/models"
)

type fetchSystems func() (models.SystemShorts, error)

// SystemsListHandler is the handler for listing systems
type SystemsListHandler struct {
	FetchSystems fetchSystems
}

// Handle handles a web request and returns a list of systems
func (h SystemsListHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		systems, err := h.FetchSystems()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		js, err := json.Marshal(systems)
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
