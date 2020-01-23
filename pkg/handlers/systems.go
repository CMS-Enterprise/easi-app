package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/cmsgov/easi-app/pkg/models"
)

type fetchSystems func() (models.Systems, error)

// SystemsListHandler is the handler for listing systems
type SystemsListHandler struct {
	FetchSystems fetchSystems
}

// Handle creates dummy systems and writes them
func (h SystemsListHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		systems, err := h.FetchSystems()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		js, err := json.Marshal(systems)
		if err != nil {

		}

		w.Header().Set("Content-Type", "application/json")

		_, err = w.Write(js)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}
