package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/graph/model"
)

// SystemsHandler is the handler for READ operations on systems
type SystemsHandler struct {
	HandlerBase
	fetch func(context.Context) ([]*model.System, error)
}

// NewSystemsHandler is a constructor for SystemsHandler
func NewSystemsHandler(base HandlerBase, fetch func(context.Context) ([]*model.System, error)) SystemsHandler {
	return SystemsHandler{
		HandlerBase: base,
		fetch:       fetch,
	}
}

// Handle handles a request for Systems
func (h SystemsHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case "GET":
			systems, err := h.fetch(r.Context())
			if err != nil {
				h.WriteErrorResponse(r.Context(), w, err)
				return
			}

			js, err := json.Marshal(systems)
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
