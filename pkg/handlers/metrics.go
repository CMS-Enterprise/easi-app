package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"time"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

type fetchMetrics func(context context.Context, startTime time.Time, endTime time.Time) (models.MetricsDigest, error)

// NewSystemIntakeMetricsHandler is a constructor for SystemIntakeMetricsHandler
func NewSystemIntakeMetricsHandler(base HandlerBase, fetch fetchMetrics) SystemIntakeMetricsHandler {
	return SystemIntakeMetricsHandler{
		FetchMetrics: fetch,
		HandlerBase:  base,
	}
}

// SystemIntakeMetricsHandler is the handler for retrieving metrics
type SystemIntakeMetricsHandler struct {
	HandlerBase
	FetchMetrics fetchMetrics
}

// Handle handles a web request and returns a metrics digest
func (h SystemIntakeMetricsHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case "GET":
			// get our time params
			startTimeParam, ok := r.URL.Query()["startTime"]
			valErr := apperrors.NewValidationError(
				errors.New("metrics failed validation"),
				models.MetricsDigest{},
				"",
			)
			if !ok || len(startTimeParam[0]) < 1 {
				valErr.Err = errors.New("no startTime")
				valErr.WithValidation("startTime", "is required")
				h.WriteErrorResponse(r.Context(), w, &valErr)
				return
			}
			startTime, err := time.Parse(time.RFC3339, startTimeParam[0])
			if err != nil {
				valErr.Err = err
				valErr.WithValidation("startTime", "must be RFC339")
				h.WriteErrorResponse(r.Context(), w, &valErr)
				return
			}
			endTime := h.clock.Now()
			endTimeParam, ok := r.URL.Query()["endTime"]
			if ok {
				endTime, err = time.Parse(time.RFC3339, endTimeParam[0])
				if err != nil {
					valErr.Err = err
					valErr.WithValidation("endTime", "must be RFC339")
					h.WriteErrorResponse(r.Context(), w, &valErr)
					return
				}
			}
			metricsDigest, err := h.FetchMetrics(r.Context(), startTime, endTime)
			if err != nil {
				h.WriteErrorResponse(r.Context(), w, err)
				return
			}

			js, err := json.Marshal(metricsDigest)
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

// NewAccessibilityMetricsHandler is a constructor for AccessibilityMetricsHandler
func NewAccessibilityMetricsHandler(base HandlerBase) AccessibilityMetricsHandler {
	return AccessibilityMetricsHandler{
		HandlerBase: base,
	}
}

// AccessibilityMetricsHandler is the handler for retrieving accessibility metrics
type AccessibilityMetricsHandler struct {
	HandlerBase
}

// Handle handles a web request and returns a metrics csv file
func (h AccessibilityMetricsHandler) Handle() http.HandlerFunc {
	return func(_ http.ResponseWriter, _ *http.Request) {}
}
