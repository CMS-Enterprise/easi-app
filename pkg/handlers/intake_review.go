package handlers

import "net/http"

// NewIntakeReviewHandler is a constructor for IntakeReviewHandler
func NewIntakeReviewHandler(
	base HandlerBase,
) IntakeReviewHandler {
	return IntakeReviewHandler{
		HandlerBase: base,
	}
}

// IntakeReviewHandler is the handler for submitting intake feedback
type IntakeReviewHandler struct {
	HandlerBase
}

// Handle handles a request to submit intake feedback
func (h IntakeReviewHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
	}
}
