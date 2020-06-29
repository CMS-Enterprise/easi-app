package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

type fetchBusinessCases func(string) (models.BusinessCases, error)

// NewBusinessCasesHandler is a constructor for BusinessCasesHandler
func NewBusinessCasesHandler(base HandlerBase, fetch fetchBusinessCases) BusinessCasesHandler {
	return BusinessCasesHandler{
		HandlerBase:        base,
		FetchBusinessCases: fetch,
	}
}

// BusinessCasesHandler is the handler for CRUD operations on business cases
type BusinessCasesHandler struct {
	HandlerBase
	FetchBusinessCases fetchBusinessCases
}

// Handle handles a request for System Intakes
func (h BusinessCasesHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case "GET":
			user, ok := appcontext.User(r.Context())
			if !ok {
				h.WriteErrorResponse(
					r.Context(),
					w,
					&apperrors.ContextError{
						Operation: apperrors.ContextGet,
						Object:    "User",
					})
				return
			}

			businessCases, err := h.FetchBusinessCases(user.EUAUserID)
			if err != nil {
				h.WriteErrorResponse(r.Context(), w, err)
				return
			}

			js, err := json.Marshal(businessCases)
			if err != nil {
				h.WriteErrorResponse(r.Context(), w, err)
				return
			}

			w.Header().Set("Content-Type", "application/json")

			_, err = w.Write(js)
			if err != nil {
				h.WriteErrorResponse(r.Context(), w, err)
				return
			}

		default:
			h.WriteErrorResponse(r.Context(), w, &apperrors.MethodNotAllowedError{Method: r.Method})
			return
		}
	}
}
