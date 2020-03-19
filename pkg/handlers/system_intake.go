package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/jmoiron/sqlx"
	"net/http"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

type saveSystemIntake func(context context.Context, intake *models.SystemIntake) error
type fetchSystemIntakeById func(id string, db sqlx.DB) (*models.SystemIntake, error)

// SystemIntakeHandler is the handler for CRUD operations on system intake
type SystemIntakeHandler struct {
	Logger           	  *zap.Logger
	SaveSystemIntake 	  saveSystemIntake
	FetchSystemIntakeById fetchSystemIntakeById
}

// Handle handles a request for the system intake form
func (h SystemIntakeHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		logger, ok := appcontext.Logger(r.Context())
		if !ok {
			h.Logger.Error("Failed to get logger from context in system intake handler")
			logger = h.Logger
		}

		switch r.Method {
		case "GET":
			id, ok := r.URL.Query()["intake_ID"]
			if !ok || id[0] == "" {
				http.Error(w, "Intake ID required", http.StatusBadRequest)
				return
			}
			intake, err := h.FetchSystemIntakeById(id[0], *db)
			if err != nil {
				logger.Error("Failed to fetch system intake")
				http.Error(w, "Failed to save system intake", http.StatusInternalServerError)
				return
			}

			responseBody, err := json.Marshal(intake)
			if err != nil {
				logger.Error("Failed to marshal system intake")
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			_, err = w.Write(responseBody)
			if err != nil {
				h.Logger.Error(fmt.Sprintf("Failed to write system intake to response: %v", err))
				http.Error(w, "Failed to get system intake by id", http.StatusInternalServerError)
				return
			}

			return

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

			euaID, ok := appcontext.EuaID(r.Context())
			if !ok {
				logger.Error("Failed to get EUA ID from context")
				http.Error(w, "Failed to PUT system", http.StatusInternalServerError)
			}
			intake.EUAUserID = euaID
			err = h.SaveSystemIntake(r.Context(), &intake)
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
