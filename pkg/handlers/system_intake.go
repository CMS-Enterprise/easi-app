package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/context"
	"github.com/cmsgov/easi-app/pkg/models"
)

type saveSystemIntake func(intake *models.SystemIntake) error

// SystemIntakeHandler is the handler for CRUD operations on system intake
type SystemIntakeHandler struct {
	Logger           *zap.Logger
	SaveSystemIntake saveSystemIntake
}

// Handle handles a request for the system intake form
func (h SystemIntakeHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		logger, ok := context.Logger(r.Context())
		if !ok {
			h.Logger.Error("Failed to logger from context in systems list handler")
			logger = h.Logger
		}

		switch r.Method {
		case "PUT":
			if r.Body == nil {
				http.Error(w, "Empty request not allowed", http.StatusBadRequest)
				return
			}
			defer r.Body.Close()
			decoder := json.NewDecoder(r.Body)
			intake := models.SystemIntake{}
			err := decoder.Decode(&intake)
			if err != nil {
				logger.Error("Failed to decode system intake body")
				http.Error(w, "Bad system intake request", http.StatusBadRequest)
				return
			}
			err = h.SaveSystemIntake(&intake)
			if err != nil {
				logger.Error(fmt.Sprintf("Failed to save system intake: %v", err))
				// TODO: Replace with more helpful errors
				http.Error(w, "Failed to save system intake", http.StatusInternalServerError)
				return
			}
		default:
			logger.Info("Unsupported method requested")
			http.Error(w, "Method not allowed for system intake", http.StatusMethodNotAllowed)
			return
		}
	}
}
