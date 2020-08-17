package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/mux"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

type fetchBusinessCaseByID func(ctx context.Context, id uuid.UUID) (*models.BusinessCase, error)
type createBusinessCase func(ctx context.Context, businessCase *models.BusinessCase) (*models.BusinessCase, error)
type updateBusinessCase func(ctx context.Context, businessCase *models.BusinessCase) (*models.BusinessCase, error)

// NewBusinessCaseHandler is a constructor for BusinessCaseHandler
func NewBusinessCaseHandler(
	base HandlerBase,
	fetch fetchBusinessCaseByID,
	create createBusinessCase,
	update updateBusinessCase,
) BusinessCaseHandler {
	return BusinessCaseHandler{
		HandlerBase:           base,
		FetchBusinessCaseByID: fetch,
		CreateBusinessCase:    create,
		UpdateBusinessCase:    update,
	}
}

// BusinessCaseHandler is the handler for CRUD operations on business case
type BusinessCaseHandler struct {
	HandlerBase
	FetchBusinessCaseByID fetchBusinessCaseByID
	CreateBusinessCase    createBusinessCase
	UpdateBusinessCase    updateBusinessCase
}

func requireBusinessCaseID(reqVars map[string]string) (uuid.UUID, error) {
	valErr := apperrors.NewValidationError(
		errors.New("business case failed validation"),
		models.SystemIntake{},
		"",
	)
	id := reqVars["business_case_id"]
	if id == "" {
		valErr.WithValidation("path.businessCaseId", "is required")
		return uuid.UUID{}, &valErr
	}
	businessCaseID, err := uuid.Parse(id)
	if err != nil {
		valErr.WithValidation("path.businessCaseId", "must be UUID")
		return uuid.UUID{}, &valErr
	}
	return businessCaseID, nil
}

// Handle handles a request for the business case form
func (h BusinessCaseHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case "GET":
			businessCaseID, err := requireBusinessCaseID(mux.Vars(r))
			if err != nil {
				h.WriteErrorResponse(r.Context(), w, err)
				return
			}

			businessCase, err := h.FetchBusinessCaseByID(r.Context(), businessCaseID)
			if err != nil {
				h.WriteErrorResponse(r.Context(), w, err)
				return
			}

			responseBody, err := json.Marshal(businessCase)
			if err != nil {
				h.WriteErrorResponse(r.Context(), w, err)
				return
			}

			_, err = w.Write(responseBody)
			if err != nil {
				h.WriteErrorResponse(r.Context(), w, err)
				return
			}

			return
		case "POST":
			if r.Body == nil {
				h.WriteErrorResponse(
					r.Context(),
					w,
					&apperrors.BadRequestError{Err: errors.New("empty request not allowed")})
				return
			}
			defer r.Body.Close()
			decoder := json.NewDecoder(r.Body)
			businessCaseToCreate := models.BusinessCase{}
			err := decoder.Decode(&businessCaseToCreate)
			if err != nil {
				h.WriteErrorResponse(r.Context(), w, &apperrors.BadRequestError{Err: err})
				return
			}

			principal := appcontext.Principal(r.Context())
			if !principal.AllowEASi() {
				h.WriteErrorResponse(
					r.Context(),
					w,
					&apperrors.ContextError{
						Operation: apperrors.ContextGet,
						Object:    "User",
					})
				return
			}
			businessCaseToCreate.EUAUserID = principal.ID()

			businessCase, err := h.CreateBusinessCase(r.Context(), &businessCaseToCreate)
			if err != nil {
				h.WriteErrorResponse(r.Context(), w, err)
				return
			}

			responseBody, err := json.Marshal(businessCase)
			if err != nil {
				h.WriteErrorResponse(r.Context(), w, err)
				return
			}

			w.WriteHeader(http.StatusCreated)
			_, err = w.Write(responseBody)
			if err != nil {
				h.WriteErrorResponse(r.Context(), w, err)
				return
			}
			return
		case "PUT":
			if r.Body == nil {
				h.WriteErrorResponse(
					r.Context(),
					w,
					&apperrors.BadRequestError{Err: errors.New("empty request not allowed")},
				)
				return
			}
			defer r.Body.Close()
			decoder := json.NewDecoder(r.Body)
			businessCaseToUpdate := models.BusinessCase{}
			err := decoder.Decode(&businessCaseToUpdate)
			if err != nil {
				h.WriteErrorResponse(r.Context(), w, &apperrors.BadRequestError{Err: err})
				return
			}

			businessCaseID, err := requireBusinessCaseID(mux.Vars(r))
			if err != nil {
				h.WriteErrorResponse(r.Context(), w, err)
				return
			}
			businessCaseToUpdate.ID = businessCaseID

			principal := appcontext.Principal(r.Context())
			if !principal.AllowEASi() {
				h.WriteErrorResponse(r.Context(), w, err)
				return
			}
			businessCaseToUpdate.EUAUserID = principal.ID()

			updatedBusinessCase, err := h.UpdateBusinessCase(r.Context(), &businessCaseToUpdate)
			if err != nil {
				h.Logger.Error(fmt.Sprintf("Failed to update business case to response: %v", err))

				h.WriteErrorResponse(r.Context(), w, err)
			}

			responseBody, err := json.Marshal(updatedBusinessCase)
			if err != nil {
				h.WriteErrorResponse(r.Context(), w, err)
				return
			}

			_, err = w.Write(responseBody)
			if err != nil {
				h.WriteErrorResponse(r.Context(), w, err)
				return
			}

			return
		default:
			h.WriteErrorResponse(r.Context(), w, &apperrors.MethodNotAllowedError{Method: r.Method})
			return
		}
	}
}
