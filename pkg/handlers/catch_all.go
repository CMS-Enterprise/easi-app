package handlers

import (
	"fmt"
	"net/http"

	"go.uber.org/zap"
)

// CatchAllHandler returns 404
type CatchAllHandler struct {
	Logger *zap.Logger
}

// Handle returns 404 on unexpected routes
func (h CatchAllHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		h.Logger.Error(fmt.Sprintf("Unexpected route hit: %v", r.URL))
		http.Error(w, "Not Found", http.StatusNotFound)
		return
	}
}
