package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

type createSystemIntake func(context context.Context, intake *models.SystemIntake) (*models.SystemIntake, error)
type updateSystemIntake func(context context.Context, intake *models.SystemIntake) (*models.SystemIntake, error)
type fetchSystemIntakeByID func(id uuid.UUID) (*models.SystemIntake, error)

// NewSystemIntakeHandler is a constructor for SystemIntakeHandler
func NewSystemIntakeHandler(
	base HandlerBase,
	create createSystemIntake,
	save saveSystemIntake,
	fetch fetchSystemIntakeByID,
) SystemIntakeHandler {
	return SystemIntakeHandler{
		HandlerBase:           base,
		CreateSystemIntake:    create,
		SaveSystemIntake:      save,
		FetchSystemIntakeByID: fetch,
	}
}

// SystemIntakeHandler is the handler for CRUD operations on system intake
type SystemIntakeHandler struct {
	HandlerBase
	CreateSystemIntake    createSystemIntake
	UpdateSystemIntake    updateSystemIntake
	FetchSystemIntakeByID fetchSystemIntakeByID
}

// Handle handles a request for the system intake form
func (h SystemIntakeHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		logger, ok := appcontext.Logger(r.Context())
		if !ok {
			h.logger.Error("Failed to get logger from context in system intake handler")
			logger = h.logger
		}

		switch r.Method {
		case "GET":
			id := mux.Vars(r)["intake_id"]
			if id == "" {
				http.Error(w, "Intake ID required", http.StatusBadRequest)
				return
			}
			uuid, err := uuid.Parse(id)
			if err != nil {
				logger.Error("Failed to parse system intake id to uuid")
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}
			intake, err := h.FetchSystemIntakeByID(uuid)
			if err != nil {
				logger.Error("Failed to fetch system intake")
				http.Error(w, "Failed to GET system intake", http.StatusInternalServerError)
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
				h.logger.Error(fmt.Sprintf("Failed to write system intake to response: %v", err))
				http.Error(w, "Failed to get system intake by id", http.StatusInternalServerError)
				return
			}

			return
		case "POST":
			if r.Body == nil {
				http.Error(w, "Empty request not allowed", http.StatusBadRequest)
				return
			}
			defer r.Body.Close()
			decoder := json.NewDecoder(r.Body)
			intake := models.SystemIntake{}
			err := decoder.Decode(&intake)
			if err != nil {
				logger.Error("Failed to decode system intake body", zap.Error(err))
				http.Error(w, "Bad system intake request", http.StatusBadRequest)
				return
			}
			createdIntake, err := h.CreateSystemIntake(r.Context(), &intake)
			if err != nil {
				h.logger.Error(fmt.Sprintf("Failed to create a system intake to response: %v", err))

				switch err.(type) {
				case *apperrors.ValidationError, *apperrors.ResourceConflictError:
					http.Error(w, "Failed to create a system intake", http.StatusBadRequest)
					return
				default:
					http.Error(w, "Failed to create a system intake", http.StatusInternalServerError)
					return
				}
			}

			responseBody, err := json.Marshal(createdIntake)
			if err != nil {
				logger.Error("Failed to marshal system intake")
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			w.WriteHeader(http.StatusCreated)
			_, err = w.Write(responseBody)
			if err != nil {
				h.Logger.Error(fmt.Sprintf("Failed to write newly created system intake to response: %v", err))
				http.Error(w, "Failed to create system intake", http.StatusInternalServerError)
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
				logger.Error("Failed to decode system intake body", zap.Error(err))
				http.Error(w, "Bad system intake request", http.StatusBadRequest)
				return
			}

			user, ok := appcontext.User(r.Context())
			if !ok {
				logger.Error("Failed to get EUA ID from context")
				http.Error(w, "Failed to PUT system intake", http.StatusUnauthorized)
				return
			}
			intake.EUAUserID = user.EUAUserID

			updatedIntake, err := h.UpdateSystemIntake(r.Context(), &intake)
			if err != nil {
				switch err.(type) {
				case *apperrors.ResourceConflictError:
					logger.Error(fmt.Sprintf("Failed to validate system intake: %v", err))
					// TODO: Replace with more helpful errors
					http.Error(w, "System has already been submitted", http.StatusConflict)
				case *apperrors.ValidationError:
					logger.Error(fmt.Sprintf("Failed to validate system intake: %v", err))
					http.Error(w, "Failed to validate system intake", http.StatusBadRequest)
				case *apperrors.ExternalAPIError:
					logger.Error(fmt.Sprintf("Failed to submit system intake: %v", err))
					// TODO: Replace with more helpful errors
					http.Error(w, "Failed to submit system intake", http.StatusInternalServerError)
				case *apperrors.NotificationError:
					logger.Error("Failed to send notification", zap.Error(err))
					http.Error(w, "Failed to send notification", http.StatusInternalServerError)
				default:
					logger.Error(fmt.Sprintf("Failed to save system intake: %v", err))
					// TODO: Replace with more helpful errors
					http.Error(w, "Failed to save system intake", http.StatusInternalServerError)
				}
				return
			}

			responseBody, err := json.Marshal(updatedIntake)
			if err != nil {
				logger.Error("Failed to marshal system intake")
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			w.WriteHeader(http.StatusCreated)
			_, err = w.Write(responseBody)
			if err != nil {
				h.Logger.Error(fmt.Sprintf("Failed to write newly created system intake to response: %v", err))
				http.Error(w, "Failed to create system intake", http.StatusInternalServerError)
				return
			}
			return
		default:
			logger.Info("Unsupported method requested")
			http.Error(w, "Method not allowed for system intake", http.StatusMethodNotAllowed)
			return
		}
	}
}
