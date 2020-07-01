package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

type reviewIntake func(context context.Context, review *models.IntakeReview) error

// NewIntakeReviewHandler is a constructor for IntakeReviewHandler
func NewIntakeReviewHandler(
	base HandlerBase,
	review reviewIntake,
) IntakeReviewHandler {
	return IntakeReviewHandler{
		HandlerBase:  base,
		ReviewIntake: review,
	}
}

// IntakeReviewHandler is the handler for submitting intake feedback
type IntakeReviewHandler struct {
	HandlerBase
	ReviewIntake reviewIntake
}

// Handle handles a request to submit intake feedback
func (h IntakeReviewHandler) Handle() http.HandlerFunc {
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
			review := models.IntakeReview{}
			err := decoder.Decode(&review)
			if err != nil {
				h.WriteErrorResponse(r.Context(), w, &apperrors.BadRequestError{Err: err})
				return
			}
			err = h.ReviewIntake(r.Context(), &review)
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
