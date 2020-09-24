package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/cmsgov/easi-app/pkg/models"
)

type fetchSystems func(context.Context) (models.SystemShorts, error)

// NewSystemsListHandler is a constructor for SystemListHandler
func NewSystemsListHandler(base HandlerBase, fetch fetchSystems) SystemsListHandler {
	return SystemsListHandler{
		HandlerBase:  base,
		FetchSystems: fetch,
	}
}

// SystemsListHandler is the handler for listing systems
type SystemsListHandler struct {
	HandlerBase
	FetchSystems fetchSystems
}

// Handle handles a web request and returns a list of systems
func (h SystemsListHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		systems, err := h.FetchSystems(r.Context())
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
	}
}
