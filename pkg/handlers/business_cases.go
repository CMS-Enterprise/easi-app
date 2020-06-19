package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

type fetchBusinessCases func(context.Context, string) (models.BusinessCases, error)

// NewBusinessCasesHandler is a constructor for BusinessCasesHandler
func NewBusinessCasesHandler(base HandlerBase, fetch fetchBusinessCases) BusinessCasesHandler {
	return BusinessCasesHandler{
		HandlerBase:        base,
		FetchBusinessCases: fetch,
	}
}

// BusinessCasesHandler is the handler for CRUD operations on business cases
type BusinessCasesHandler struct {
	HandlerBase
	FetchBusinessCases fetchBusinessCases
}

// Handle handles a request for System Intakes
func (h BusinessCasesHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		logger, ok := appcontext.Logger(r.Context())
		if !ok {
			h.logger.Error("Failed to get logger from context in business cases handler")
			logger = h.logger
		}

		switch r.Method {
		case "GET":
			user, ok := appcontext.User(r.Context())
			if !ok {
				h.logger.Error("Failed to get EUA ID from context in business cases handler")
				http.Error(w, "Failed to fetch business cases", http.StatusInternalServerError)
				return
			}

			businessCases, err := h.FetchBusinessCases(r.Context(), user.EUAUserID)
			if err != nil {
				logger.Error(fmt.Sprintf("Failed to fetch business cases: %v", err))
				http.Error(w, "failed to fetch business cases", http.StatusInternalServerError)
				return
			}

			js, err := json.Marshal(businessCases)
			if err != nil {
				logger.Error(fmt.Sprintf("Failed to marshal business cases: %v", err))
				http.Error(w, "failed to fetch business cases", http.StatusInternalServerError)
				return
			}

			w.Header().Set("Content-Type", "application/json")

			_, err = w.Write(js)
			if err != nil {
				logger.Error(fmt.Sprintf("Failed to write business cases response: %v", err))
				http.Error(w, "failed to fetch business cases", http.StatusInternalServerError)
				return
			}

		default:
			logger.Info("Unsupported method requested")
			http.Error(w, "Method not allowed for business cases", http.StatusMethodNotAllowed)
			return
		}
	}
}
