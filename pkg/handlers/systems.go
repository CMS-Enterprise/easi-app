package handlers

import (
	"fmt"
	"net/http"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/models"
)

type fetchSystems func() (models.SystemShorts, error)
type marshal func(interface{}) ([]byte, error)

// SystemsListHandler is the handler for listing systems
type SystemsListHandler struct {
	FetchSystems fetchSystems
	Marshal      marshal
	Logger       *zap.Logger
}

// Handle handles a web request and returns a list of systems
func (h SystemsListHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		systems, err := h.FetchSystems()
		if err != nil {
			h.Logger.Error(fmt.Sprintf("Failed to fetch system: %v", err))
			http.Error(w, "failed to fetch systems", http.StatusInternalServerError)
			return
		}

		js, err := h.Marshal(systems)
		if err != nil {
			h.Logger.Error(fmt.Sprintf("Failed to marshal system: %v", err))
			http.Error(w, "failed to fetch systems", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")

		_, err = w.Write(js)
		if err != nil {
			h.Logger.Error(fmt.Sprintf("Failed to write systems response: %v", err))
			http.Error(w, "failed to fetch systems", http.StatusInternalServerError)
			return
		}
	}
}
