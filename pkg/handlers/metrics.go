package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

type fetchMetrics func(context context.Context, startTime time.Time, endTime time.Time) (models.MetricsDigest, error)

// NewMetricsHandler is a constructor for MetricsHandler
func NewMetricsHandler(base HandlerBase, fetch fetchMetrics) MetricsHandler {
	return MetricsHandler{
		FetchMetrics: fetch,
		HandlerBase:  base,
	}
}

// MetricsHandler is the handler for retrieving metrics
type MetricsHandler struct {
	HandlerBase
	FetchMetrics fetchMetrics
}

// Handle handles a web request and returns a metrics digest
func (h MetricsHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		logger, ok := appcontext.Logger(r.Context())
		if !ok {
			h.logger.Error("Failed to logger from context in metrics handler")
			logger = h.logger
		}
		switch r.Method {
		case "GET":
			// get our time params
			startTimeParam, ok := r.URL.Query()["startTime"]
			if !ok || len(startTimeParam[0]) < 1 {
				http.Error(w, "startTime is required", http.StatusBadRequest)
				return
			}
			startTime, err := time.Parse(time.RFC3339, startTimeParam[0])
			if err != nil {
				logger.Info("failed to parse starTime", zap.Error(err))
				http.Error(w, "startTime must adhere to RFC 339", http.StatusBadRequest)
				return
			}
			endTime := h.clock.Now()
			endTimeParam, ok := r.URL.Query()["endTime"]
			if ok {
				endTime, err = time.Parse(time.RFC3339, endTimeParam[0])
				if err != nil {
					logger.Info("failed to parse endTime", zap.Error(err))
					http.Error(w, "endTime must adhere to RFC 339", http.StatusBadRequest)
					return
				}
			}
			metricsDigest, err := h.FetchMetrics(r.Context(), startTime, endTime)
			if err != nil {
				logger.Error(fmt.Sprintf("Failed to fetch metrics: %v", err))
				http.Error(w, "failed to fetch metrics", http.StatusInternalServerError)
				return
			}

			js, err := json.Marshal(metricsDigest)
			if err != nil {
				logger.Error(fmt.Sprintf("Failed to marshal metrics: %v", err))
				http.Error(w, "failed to fetch metrics", http.StatusInternalServerError)
				return
			}

			w.Header().Set("Content-Type", "application/json")

			_, err = w.Write(js)
			if err != nil {
				logger.Error(fmt.Sprintf("Failed to write metrics response: %v", err))
				http.Error(w, "failed to fetch metrics", http.StatusInternalServerError)
				return
			}
		default:
			logger.Info("Unsupported method requested")
			http.Error(w, "Method not allowed for system intake", http.StatusMethodNotAllowed)
			return
		}
	}
}
