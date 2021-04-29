package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/guregu/null"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

type createSystemIntake func(context context.Context, intake *models.SystemIntake) (*models.SystemIntake, error)
type fetchSystemIntakeByID func(context context.Context, id uuid.UUID) (*models.SystemIntake, error)
type updateSystemIntake func(context context.Context, intake *models.SystemIntake) (*models.SystemIntake, error)
type archiveSystemIntake func(context context.Context, id uuid.UUID) error

// NewSystemIntakeHandler is a constructor for SystemIntakeHandler
func NewSystemIntakeHandler(
	base HandlerBase,
	create createSystemIntake,
	update updateSystemIntake,
	fetch fetchSystemIntakeByID,
	delete archiveSystemIntake,
) SystemIntakeHandler {
	return SystemIntakeHandler{
		HandlerBase:           base,
		CreateSystemIntake:    create,
		UpdateSystemIntake:    update,
		FetchSystemIntakeByID: fetch,
		ArchiveSystemIntake:   delete,
	}
}

// SystemIntakeHandler is the handler for CRUD operations on system intake
type SystemIntakeHandler struct {
	HandlerBase
	CreateSystemIntake    createSystemIntake
	UpdateSystemIntake    updateSystemIntake
	FetchSystemIntakeByID fetchSystemIntakeByID
	ArchiveSystemIntake   archiveSystemIntake
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
			intake := models.SystemIntake{}
			err := decoder.Decode(&intake)
			if err != nil {
				h.WriteErrorResponse(r.Context(), w, &apperrors.BadRequestError{Err: err})
				return
			}
			createdIntake, err := h.CreateSystemIntake(r.Context(), &intake)
			if err != nil {
				h.WriteErrorResponse(r.Context(), w, err)
				return
			}

			responseBody, err := json.Marshal(createdIntake)
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

			err = h.ArchiveSystemIntake(r.Context(), uuid)
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

// NewSystemIntakeLifecycleIDHandler is a constructor for how we handle
// LifecycleID assignment
func NewSystemIntakeLifecycleIDHandler(
	base HandlerBase,
	assign func(context.Context, *models.SystemIntake, *models.Action) (*models.SystemIntake, error),
) SystemIntakeLifecycleIDHandler {
	return SystemIntakeLifecycleIDHandler{
		HandlerBase:       base,
		AssignLifecycleID: assign,
	}
}

// SystemIntakeLifecycleIDHandler is the handler for assigning
// a lifecycleID to a SystemIntake
type SystemIntakeLifecycleIDHandler struct {
	HandlerBase
	AssignLifecycleID func(context.Context, *models.SystemIntake, *models.Action) (*models.SystemIntake, error)
}

type lcidFields struct {
	LCID      *string `json:"lcid"`
	ExpiresAt string  `json:"lcidExpiresAt"`
	Scope     string  `json:"lcidScope"`
	NextSteps string  `json:"decisionNextSteps"`
	Feedback  string  `json:"feedback"`
}

// Handle handles a request for the system intake form
func (h SystemIntakeLifecycleIDHandler) Handle() http.HandlerFunc {
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

			fields := lcidFields{}
			if err := json.NewDecoder(r.Body).Decode(&fields); err != nil {
				h.WriteErrorResponse(r.Context(), w, &apperrors.BadRequestError{Err: err})
				return
			}

			// formatting and validation of required inputs
			intake := &models.SystemIntake{
				LifecycleID: null.StringFromPtr(fields.LCID),
			}
			action := &models.Action{}

			valFail := false
			valErr := apperrors.NewValidationError(
				errors.New("system intake lifecycle fields failed validation"),
				models.SystemIntake{},
				"",
			)

			id := mux.Vars(r)["intake_id"]
			if id == "" {
				valErr.WithValidation("path.intakeID", "is required")
				valFail = true
			} else {
				uuid, err := uuid.Parse(id)
				if err != nil {
					valErr.WithValidation("path.intakeID", "must be UUID")
				} else {
					intake.ID = uuid
				}
			}

			if fields.ExpiresAt == "" {
				valErr.WithValidation("body.lcidExpiresAt", "is required")
				valFail = true
			} else {
				exp, tErr := time.Parse("2006-1-2", fields.ExpiresAt)
				if tErr != nil {
					valErr.WithValidation("body.lcidExpiresAt", tErr.Error())
					valFail = true
				} else {
					intake.LifecycleExpiresAt = &exp
				}
			}

			if fields.Scope == "" {
				valErr.WithValidation("body.lcidScope", "is required")
				valFail = true
			} else {
				intake.LifecycleScope = null.StringFrom(fields.Scope)
			}

			if fields.NextSteps == "" {
				valErr.WithValidation("body.decisionNextSteps", "is required")
				valFail = true
			} else {
				intake.DecisionNextSteps = null.StringFrom(fields.NextSteps)
			}

			if fields.Feedback == "" {
				valErr.WithValidation("body.feedback", "is required")
				valFail = true
			} else {
				action.Feedback = null.StringFrom(fields.Feedback)
			}

			if valFail {
				h.WriteErrorResponse(r.Context(), w, &valErr)
				return
			}

			// send it to the database
			updatedIntake, err := h.AssignLifecycleID(r.Context(), intake, action)
			if err != nil {
				h.WriteErrorResponse(r.Context(), w, err)
				return
			}

			responseBody, err := json.Marshal(updatedIntake)
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
		default:
			h.WriteErrorResponse(r.Context(), w, &apperrors.MethodNotAllowedError{Method: r.Method})
			return
		}
	}
}
