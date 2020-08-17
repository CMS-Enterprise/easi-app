package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

type fetchSystemIntakes func(context.Context, string) (models.SystemIntakes, error)

// NewSystemIntakesHandler is a constructor for SystemIntakesHandler
func NewSystemIntakesHandler(base HandlerBase, fetch fetchSystemIntakes) SystemIntakesHandler {
	return SystemIntakesHandler{
		HandlerBase:        base,
		FetchSystemIntakes: fetch,
	}
}

// SystemIntakesHandler is the handler for CRUD operations on system intakes
type SystemIntakesHandler struct {
	HandlerBase
	FetchSystemIntakes fetchSystemIntakes
}

// Handle handles a request for System Intakes
func (h SystemIntakesHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case "GET":
			principal := appcontext.Principal(r.Context())
			if !principal.AllowEASi() {
				h.WriteErrorResponse(r.Context(), w, &apperrors.ContextError{
					Operation: apperrors.ContextGet,
					Object:    "User",
				})
				return
			}

			systemIntakes, err := h.FetchSystemIntakes(r.Context(), principal.ID())
			if err != nil {
				h.WriteErrorResponse(r.Context(), w, err)
				return
			}

			js, err := json.Marshal(systemIntakes)
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
