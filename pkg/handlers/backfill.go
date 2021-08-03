package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

type saver func(ctx context.Context, intake models.SystemIntake, notes []models.Note) (bool, error)

// NewBackfillHandler is quick & dirty
func NewBackfillHandler(base HandlerBase, s saver) BackfillHandler {
	return BackfillHandler{
		HandlerBase: base,
		Saver:       s,
	}
}

// BackfillHandler quick & dirty
type BackfillHandler struct {
	HandlerBase
	Saver saver
}

// Handle handles a web request and returns a list of systems
func (h BackfillHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case "POST":
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
			data := struct {
				Intake models.SystemIntake `json:"intake"`
				Notes  []models.Note       `json:"notes"`
			}{}
			if err := decoder.Decode(&data); err != nil {
				h.WriteErrorResponse(r.Context(), w, &apperrors.BadRequestError{Err: err})
				return
			}

			create, saveErr := h.Saver(r.Context(), data.Intake, data.Notes)
			if saveErr != nil {
				h.WriteErrorResponse(r.Context(), w, &apperrors.BadRequestError{Err: saveErr})
				return
			}
			w.Header().Set("Content-Type", "application/json")
			if create {
				w.WriteHeader(http.StatusCreated)
			} else {
				w.WriteHeader(http.StatusNoContent)
			}
		default:
			h.WriteErrorResponse(r.Context(), w, &apperrors.MethodNotAllowedError{Method: r.Method})
			return
		}

	}
}
