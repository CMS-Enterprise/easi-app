package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
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
	remove archiveSystemIntake,
) SystemIntakeHandler {
	return SystemIntakeHandler{
		HandlerBase:           base,
		CreateSystemIntake:    create,
		UpdateSystemIntake:    update,
		FetchSystemIntakeByID: fetch,
		ArchiveSystemIntake:   delete,
		RemoveSystemIntake:    remove,
	}
}

// SystemIntakeHandler is the handler for CRUD operations on system intake
type SystemIntakeHandler struct {
	HandlerBase
	CreateSystemIntake    createSystemIntake
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
	NextSteps string  `json:"lcidNextSteps"`
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
				valErr.WithValidation("body.lcidNextSteps", "is required")
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

// NewSystemIntakeRejectionHandler is a constructor for how we handle
// rejecting a request
func NewSystemIntakeRejectionHandler(
	base HandlerBase,
	reject func(context.Context, *models.SystemIntake, *models.Action) (*models.SystemIntake, error),
) SystemIntakeRejectionHandler {
	return SystemIntakeRejectionHandler{
		HandlerBase:  base,
		RejectIntake: reject,
	}
}

// SystemIntakeRejectionHandler is the handler for rejecting a SystemIntake
type SystemIntakeRejectionHandler struct {
	HandlerBase
	RejectIntake func(context.Context, *models.SystemIntake, *models.Action) (*models.SystemIntake, error)
}

type rejectionFields struct {
	Reason    string `json:"rejectionReason"`
	NextSteps string `json:"rejectionNextSteps"`
	Feedback  string
}

func validateRejection(id string, data rejectionFields) (*uuid.UUID, error) {
	valFail := false
	valErr := apperrors.NewValidationError(
		errors.New("system intake lifecycle fields failed validation"),
		models.SystemIntake{},
		"",
	)
	var intakeID uuid.UUID
	var err error

	if id == "" {
		valErr.WithValidation("path.intakeID", "is required")
		valFail = true
	} else {
		intakeID, err = uuid.Parse(id)
		if err != nil {
			valErr.WithValidation("path.intakeID", "must be UUID")
		}
	}

	if data.Reason == "" {
		valErr.WithValidation("body.rejectionReason", "is required")
		valFail = true
	}

	if data.NextSteps == "" {
		valErr.WithValidation("body.rejectionNextSteps", "is required")
		valFail = true
	}

	if data.Feedback == "" {
		valErr.WithValidation("body.feedback", "is required")
		valFail = true
	}

	if valFail {
		return nil, &valErr
	}

	return &intakeID, nil
}

// Handle handles a request for the system intake form
func (h SystemIntakeRejectionHandler) Handle() http.HandlerFunc {
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

			id := mux.Vars(r)["intake_id"]
			fields := rejectionFields{}
			if err := json.NewDecoder(r.Body).Decode(&fields); err != nil {
				h.WriteErrorResponse(r.Context(), w, &apperrors.BadRequestError{Err: err})
				return
			}

			// formatting and validation of required inputs
			uuid, valErr := validateRejection(id, fields)
			if valErr != nil {
				h.WriteErrorResponse(r.Context(), w, valErr)
				return
			}
			intake := &models.SystemIntake{
				ID:                *uuid,
				RejectionReason:   null.StringFrom(fields.Reason),
				DecisionNextSteps: null.StringFrom(fields.NextSteps),
			}
			action := &models.Action{
				Feedback: null.StringFrom(fields.Feedback),
				IntakeID: uuid,
			}

			// send it to the database
			updatedIntake, err := h.RejectIntake(r.Context(), intake, action)
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
