package handlers

import (
	"fmt"
	"net/http"
)

// NewCatchAllHandler is a constructor for CatchAllHanlder
func NewCatchAllHandler(base HandlerBase) CatchAllHandler {
	return CatchAllHandler{HandlerBase: base}
}

// CatchAllHandler returns 404
type CatchAllHandler struct {
	HandlerBase
}

// Handle returns 404 on unexpected routes
func (h CatchAllHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		h.logger.Info(fmt.Sprintf("Unexpected route hit: %v", r.URL))
		http.Error(w, "Not Found", http.StatusNotFound)
		return
	}
}
