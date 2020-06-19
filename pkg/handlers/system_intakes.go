package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

type fetchSystemIntakes func(context.Context, string) (models.SystemIntakes, error)

// NewSystemIntakesHandler is a constructor for SystemIntakesHandler
func NewSystemIntakesHandler(base HandlerBase, fetch fetchSystemIntakes) SystemIntakesHandler {
	return SystemIntakesHandler{
		HandlerBase:        base,
		FetchSystemIntakes: fetch,
	}
}

// SystemIntakesHandler is the handler for CRUD operations on system intakes
type SystemIntakesHandler struct {
	HandlerBase
	FetchSystemIntakes fetchSystemIntakes
}

// Handle handles a request for System Intakes
func (h SystemIntakesHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		logger, ok := appcontext.Logger(r.Context())
		if !ok {
			h.logger.Error("Failed to get logger from context in system intakes handler")
			logger = h.logger
		}

		switch r.Method {
		case "GET":
			user, ok := appcontext.User(r.Context())
			if !ok {
				h.logger.Error("Failed to get EUA ID from context in system intakes handler")
				http.Error(w, "Failed to fetch System Intakes", http.StatusInternalServerError)
				return
			}

			systemIntakes, err := h.FetchSystemIntakes(r.Context(), user.EUAUserID)
			if err != nil {
				logger.Error(fmt.Sprintf("Failed to fetch system intakes: %v", err))
				http.Error(w, "failed to fetch system intakes", http.StatusInternalServerError)
				return
			}

			js, err := json.Marshal(systemIntakes)
			if err != nil {
				logger.Error(fmt.Sprintf("Failed to marshal system intakes: %v", err))
				http.Error(w, "failed to fetch system intakes", http.StatusInternalServerError)
				return
			}

			w.Header().Set("Content-Type", "application/json")

			_, err = w.Write(js)
			if err != nil {
				logger.Error(fmt.Sprintf("Failed to write system intakes response: %v", err))
				http.Error(w, "failed to fetch system intakes", http.StatusInternalServerError)
				return
			}

		default:
			logger.Info("Unsupported method requested")
			http.Error(w, "Method not allowed for system intake", http.StatusMethodNotAllowed)
			return
		}
	}
}
