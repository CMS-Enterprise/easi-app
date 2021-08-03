package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"strconv"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/guregu/null"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

type fetchSystemIntakeByID func(context context.Context, id uuid.UUID) (*models.SystemIntake, error)
type updateSystemIntake func(context context.Context, intake *models.SystemIntake) (*models.SystemIntake, error)
type archiveSystemIntake func(context context.Context, id uuid.UUID) error

// NewSystemIntakeHandler is a constructor for SystemIntakeHandler
func NewSystemIntakeHandler(
	base HandlerBase,
	update updateSystemIntake,
	fetch fetchSystemIntakeByID,
	delete archiveSystemIntake,
) SystemIntakeHandler {
	return SystemIntakeHandler{
		HandlerBase:           base,
		UpdateSystemIntake:    update,
		FetchSystemIntakeByID: fetch,
		ArchiveSystemIntake:   delete,
	}
}

// SystemIntakeHandler is the handler for CRUD operations on system intake
type SystemIntakeHandler struct {
	HandlerBase
	UpdateSystemIntake    updateSystemIntake
	FetchSystemIntakeByID fetchSystemIntakeByID
	ArchiveSystemIntake   archiveSystemIntake
	RemoveSystemIntake    archiveSystemIntake
}

// Handle handles a request for the system intake form
func (h SystemIntakeHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case "GET":
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
			uuid, err := uuid.Parse(id)
			if err != nil {
				valErr.WithValidation("path.intakeID", "must be UUID")
				h.WriteErrorResponse(r.Context(), w, &valErr)
				return
			}
			intake, err := h.FetchSystemIntakeByID(r.Context(), uuid)
			if err != nil {
				h.WriteErrorResponse(r.Context(), w, err)
				return
			}

			responseBody, err := json.Marshal(intake)
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
			intake := models.SystemIntake{}
			err := decoder.Decode(&intake)
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
			intake.EUAUserID = null.StringFrom(principal.ID())

			updatedIntake, err := h.UpdateSystemIntake(r.Context(), &intake)
			if err != nil {
				h.WriteErrorResponse(r.Context(), w, err)
				return
			}

			responseBody, err := json.Marshal(updatedIntake)
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
			uuid, err := uuid.Parse(id)
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

			err = fn(r.Context(), uuid)
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
