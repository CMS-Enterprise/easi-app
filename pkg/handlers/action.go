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

type createAction func(context.Context, *models.Action) error

// NewActionHandler is a constructor for ActionHandler
func NewActionHandler(
	base HandlerBase,
	create createAction,
) ActionHandler {
	return ActionHandler{
		HandlerBase:  base,
		CreateAction: create,
	}
}

// ActionHandler is the handler for CRUD operations on a system intake action
type ActionHandler struct {
	HandlerBase
	CreateAction createAction
}

// Handle handles a request for the system intake action
func (h ActionHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
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
		switch r.Method {
		case "POST":
			defer r.Body.Close()
			decoder := json.NewDecoder(r.Body)
			action := models.Action{}
			err = decoder.Decode(&action)
			if err != nil {
				h.WriteErrorResponse(r.Context(), w, &apperrors.BadRequestError{Err: err})
				return
			}
			action.IntakeID = &intakeID
			err = h.CreateAction(r.Context(), &action)
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
