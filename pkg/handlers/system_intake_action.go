package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/mux"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

type createSystemIntakeAction func(context.Context, uuid.UUID, *models.ActionType) error

// NewSystemIntakeActionHandler is a constructor for SystemIntakeActionHandler
func NewSystemIntakeActionHandler(
	base HandlerBase,
	create createSystemIntakeAction,
) SystemIntakeActionHandler {
	return SystemIntakeActionHandler{
		HandlerBase:              base,
		CreateSystemIntakeAction: create,
	}
}

// SystemIntakeActionHandler is the handler for CRUD operations on a system intake action
type SystemIntakeActionHandler struct {
	HandlerBase
	CreateSystemIntakeAction createSystemIntakeAction
}

// Handle handles a request for the system intake action
func (h SystemIntakeActionHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case "POST":
			id := mux.Vars(r)["intake_id"]
			valErr := apperrors.NewValidationError(
				errors.New("system intake failed validation"),
				models.SystemIntake{},
				"",
			)
			if id == "" {
				valErr.WithValidation("path.intakeID", "is required")
				h.WriteErrorResponse(r.Context(), w, &valErr)
				return
			}
			intakeID, err := uuid.Parse(id)
			if err != nil {
				valErr.WithValidation("path.intakeID", "must be UUID")
				h.WriteErrorResponse(r.Context(), w, &valErr)
				return
			}
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
			var actionType models.ActionType
			err = decoder.Decode(&actionType)
			if err != nil {
				h.WriteErrorResponse(r.Context(), w, &apperrors.BadRequestError{Err: err})
				return
			}
			err = h.CreateSystemIntakeAction(r.Context(), intakeID, &actionType)
			if err != nil {
				h.WriteErrorResponse(r.Context(), w, err)
				return
			}

			w.WriteHeader(http.StatusCreated)
			return
		default:
			h.WriteErrorResponse(r.Context(), w, &apperrors.MethodNotAllowedError{Method: r.Method})
			return
		}
	}
}
