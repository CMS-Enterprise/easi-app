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

type fetchBusinessCaseByID func(id uuid.UUID) (*models.BusinessCase, error)
type createBusinessCase func(ctx context.Context, businessCase *models.BusinessCase) (*models.BusinessCase, error)

// BusinessCaseHandler is the handler for CRUD operations on business case
type BusinessCaseHandler struct {
	Logger                *zap.Logger
	FetchBusinessCaseByID fetchBusinessCaseByID
	CreateBusinessCase    createBusinessCase
}

// Handle handles a request for the business case form
func (h BusinessCaseHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		logger, ok := appcontext.Logger(r.Context())
		if !ok {
			h.Logger.Error("Failed to get logger from context in business case handler")
			logger = h.Logger
		}

		switch r.Method {
		case "GET":
			id := mux.Vars(r)["business_case_id"]
			if id == "" {
				http.Error(w, "Business Case ID required", http.StatusBadRequest)
				return
			}
			uuid, err := uuid.Parse(id)
			if err != nil {
				logger.Error("Failed to parse business case id to uuid")
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}
			businessCase, err := h.FetchBusinessCaseByID(uuid)
			if err != nil {
				logger.Error("Failed to fetch business case")
				http.Error(w, "Failed to GET business case", http.StatusInternalServerError)
				return
			}

			responseBody, err := json.Marshal(businessCase)
			if err != nil {
				logger.Error("Failed to marshal business case")
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			_, err = w.Write(responseBody)
			if err != nil {
				h.Logger.Error(fmt.Sprintf("Failed to write business case to response: %v", err))
				http.Error(w, "Failed to get business case by id", http.StatusInternalServerError)
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
			businessCaseToCreate := models.BusinessCase{}
			err := decoder.Decode(&businessCaseToCreate)

			if err != nil {
				logger.Error("Failed to decode business case body")
				http.Error(w, "Bad business case request", http.StatusBadRequest)
				return
			}

			euaID, ok := appcontext.EuaID(r.Context())
			if !ok {
				logger.Error("Failed to get EUA ID from context")
				http.Error(w, "Failed to POST business case", http.StatusUnauthorized)
				return
			}
			businessCaseToCreate.EUAUserID = euaID

			businessCase, err := h.CreateBusinessCase(r.Context(), &businessCaseToCreate)
			if err != nil {
				h.Logger.Error(fmt.Sprintf("Failed to create a business case to response: %v", err))

				switch err.(type) {
				case *apperrors.ValidationError, *apperrors.ResourceConflictError:
					http.Error(w, "Failed to create a business case", http.StatusBadRequest)
					return
				default:
					http.Error(w, "Failed to create a business case", http.StatusInternalServerError)
					return
				}
			}

			responseBody, err := json.Marshal(businessCase)
			if err != nil {
				logger.Error("Failed to marshal business case")
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			_, err = w.Write(responseBody)
			if err != nil {
				h.Logger.Error(fmt.Sprintf("Failed to write newly created business case to response: %v", err))
				http.Error(w, "Failed to create business case", http.StatusInternalServerError)
				return
			}

			return
		default:
			logger.Info("Unsupported method requested")
			http.Error(w, "Method not allowed for business case", http.StatusMethodNotAllowed)
			return
		}
	}
}
