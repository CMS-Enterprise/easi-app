package handlers

import (
	"context"
	"errors"
	"net/http"
	"strconv"

	"github.com/google/uuid"
	"github.com/gorilla/mux"

	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

type archiveSystemIntake func(context context.Context, id uuid.UUID) error

// NewSystemIntakeHandler is a constructor for SystemIntakeHandler
func NewSystemIntakeHandler(
	base HandlerBase,
	delete archiveSystemIntake,
) SystemIntakeHandler {
	return SystemIntakeHandler{
		HandlerBase:         base,
		ArchiveSystemIntake: delete,
	}
}

// SystemIntakeHandler is the handler for CRUD operations on system intake
type SystemIntakeHandler struct {
	HandlerBase
	ArchiveSystemIntake archiveSystemIntake
	RemoveSystemIntake  archiveSystemIntake
}

// Handle handles a request for the system intake form
func (h SystemIntakeHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case "DELETE":
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
			parsedUUID, err := uuid.Parse(id)
			if err != nil {
				valErr.WithValidation("path.intakeID", "must be UUID")
				h.WriteErrorResponse(r.Context(), w, &valErr)
				return
			}

			// TODO: this is very temporary code that will be used to
			// remove uploaded backfill data - EASI-974
			fn := h.ArchiveSystemIntake
			if ok, perr := strconv.ParseBool(r.URL.Query().Get("remove")); ok && perr == nil {
				fn = h.RemoveSystemIntake
			}

			err = fn(r.Context(), parsedUUID)
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
