package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"

	"github.com/facebookgo/clock"
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/logfields"
)

// NewHandlerBase is a constructor for HandlerBase
func NewHandlerBase() HandlerBase {
	return HandlerBase{
		clock: clock.New(),
	}
}

// HandlerBase is for shared handler utilities
type HandlerBase struct {
	clock clock.Clock
}

type errorItem struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

// errorResponse contains the structure of error for a http response
type errorResponse struct {
	Errors  []errorItem `json:"errors"`
	Code    int         `json:"code"`
	Message string      `json:"message"`
	TraceID uuid.UUID   `json:"traceID"`
}

func newErrorResponse(code int, message string, traceID uuid.UUID) errorResponse {
	return errorResponse{
		Errors:  []errorItem{},
		Code:    code,
		Message: message,
		TraceID: traceID,
	}
}

func (r *errorResponse) withMap(errMap map[string]string) {
	for k, v := range errMap {
		r.Errors = append(r.Errors, errorItem{
			Field:   k,
			Message: v,
		})
	}
}

// WriteErrorResponse writes a response for a given application error
func (b HandlerBase) WriteErrorResponse(ctx context.Context, w http.ResponseWriter, appErr error) {
	logger := appcontext.ZLogger(ctx)

	traceID, ok := appcontext.Trace(ctx)
	if !ok {
		traceID = uuid.New()
		logger.With(logfields.TraceField(traceID.String()))
	}

	response := errorResponseFor(appErr, traceID, logger)

	// get error as response body
	responseBody, err := json.Marshal(response)
	if err != nil {
		logger.Error("Failed to marshal error response. Defaulting to generic.")
		http.Error(w, "Something went wrong", http.StatusInternalServerError)
		return
	}

	// write a JSON response and fallback to generic message
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(response.Code)
	_, err = w.Write(responseBody)
	if err != nil {
		logger.Error("Failed to write error response. Defaulting to generic.")
		http.Error(w, "Something went wrong", http.StatusInternalServerError)
		return
	}
}

func errorResponseFor(appErr error, traceID uuid.UUID, logger *zap.Logger) errorResponse {
	if _, ok := errors.AsType[*apperrors.UnauthorizedError](appErr); ok {
		// 4XX errors are not logged as errors, but are for client
		logger.Info("Returning unauthorized response from handler", zap.Error(appErr))
		return newErrorResponse(
			http.StatusUnauthorized,
			"Unauthorized",
			traceID,
		)
	}

	if queryErr, ok := errors.AsType[*apperrors.QueryError](appErr); ok {
		logger.Error("Returning server error response from handler", zap.Error(appErr))
		if _, ok := errors.AsType[*apperrors.ResourceNotFoundError](queryErr.Unwrap()); ok {
			return newErrorResponse(
				http.StatusNotFound,
				"Resource not found",
				traceID,
			)
		}

		return newErrorResponse(
			http.StatusInternalServerError,
			"Something went wrong",
			traceID,
		)
	}

	if _, ok := errors.AsType[*apperrors.ExternalAPIError](appErr); ok {
		logger.Error("Returning service unavailable error response from handler", zap.Error(appErr))
		return newErrorResponse(
			http.StatusServiceUnavailable,
			"Service unavailable",
			traceID,
		)
	}

	if _, ok := errors.AsType[*apperrors.ContextError](appErr); ok {
		logger.Error("Returning server error response from handler", zap.Error(appErr))
		return newErrorResponse(
			http.StatusInternalServerError,
			"Something went wrong",
			traceID,
		)
	}

	if validationErr, ok := errors.AsType[*apperrors.ValidationError](appErr); ok {
		logger.Info("Returning unprocessable entity error from handler", zap.Error(appErr))
		response := newErrorResponse(
			http.StatusUnprocessableEntity,
			"Entity unprocessable",
			traceID,
		)
		response.withMap(validationErr.Validations.Map())
		return response
	}

	if _, ok := errors.AsType[*apperrors.MethodNotAllowedError](appErr); ok {
		logger.Info("Returning method not allowed error from handler", zap.Error(appErr))
		return newErrorResponse(
			http.StatusMethodNotAllowed,
			"Method not allowed",
			traceID,
		)
	}

	if _, ok := errors.AsType[*apperrors.ResourceConflictError](appErr); ok {
		logger.Info("Returning resource conflict error from handler", zap.Error(appErr))
		return newErrorResponse(
			http.StatusConflict,
			"Resource conflict",
			traceID,
		)
	}

	if _, ok := errors.AsType[*apperrors.BadRequestError](appErr); ok {
		logger.Info("Returning bad request error from handler", zap.Error(appErr))
		return newErrorResponse(
			http.StatusBadRequest,
			"Bad request",
			traceID,
		)
	}

	if _, ok := errors.AsType[*apperrors.UnknownRouteError](appErr); ok {
		logger.Info("Returning status not found error from handler", zap.Error(appErr))
		return newErrorResponse(
			http.StatusNotFound,
			"Not found",
			traceID,
		)
	}

	if _, ok := errors.AsType[*apperrors.ResourceNotFoundError](appErr); ok {
		return newErrorResponse(
			http.StatusNotFound,
			"Resource not found",
			traceID,
		)
	}

	logger.Error("Returning server error response from handler", zap.Error(appErr))
	return newErrorResponse(
		http.StatusInternalServerError,
		"Something went wrong",
		traceID,
	)
}
