package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
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
		logger, ok := appcontext.Logger(r.Context())
		if !ok {
			h.logger.Error("Failed to get logger from context in intake review handler")
			logger = h.logger
		}

		switch r.Method {
		case "POST":
			if r.Body == nil {
				http.Error(w, "Empty request not allowed", http.StatusBadRequest)
				return
			}
			defer r.Body.Close()
			decoder := json.NewDecoder(r.Body)
			review := models.IntakeReview{}
			err := decoder.Decode(&review)
			if err != nil {
				logger.Error("Failed to decode intake review body", zap.Error(err))
				http.Error(w, "Bad intake review request", http.StatusBadRequest)
				return
			}
			err = h.ReviewIntake(r.Context(), &review)
			if err != nil {
				h.logger.Error(fmt.Sprintf("Failed to create a system intake to response: %v", err))

				switch err.(type) {
				case *apperrors.ValidationError, *apperrors.ResourceConflictError:
					http.Error(w, "Failed to create a system intake", http.StatusBadRequest)
					return
				default:
					http.Error(w, "Failed to create a system intake", http.StatusInternalServerError)
					return
				}
			}

			w.WriteHeader(http.StatusOK)
			return
		default:
			logger.Info("Unsupported method requested")
			http.Error(w, "Method not allowed for intake review", http.StatusMethodNotAllowed)
			return
		}

	}
}
