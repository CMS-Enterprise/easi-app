package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
)

// NewHandlerBase constructs a HandlerBase
func NewHandlerBase(logger *zap.Logger) HandlerBase {
	return HandlerBase{
		logger: logger,
	}
}

// HandlerBase is a type for shared handler functions and fields
type HandlerBase struct {
	logger *zap.Logger
}

type responseError struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

type errorResponse struct {
	Errors  responseError `json:"errors"`
	Code    int           `json:"code"`
	Message int           `json:"message"`
}

func (b HandlerBase) writeErrorResponse(ctx context.Context, w http.ResponseWriter, appError error, logMessage string) {
	logger, ok := appcontext.Logger(ctx)
	if !ok {
		logger = b.logger
	}

	// get code and reponse
	var code int
	var response errorResponse
	switch appError.(type) {
	case *apperrors.QueryError:
		code = http.StatusInternalServerError
		response = errorResponse{}
	default:
		code = http.StatusInternalServerError
		response = errorResponse{}
	}

	// log error with customized message
	logger.Error("Returning error response from handler because:"+logMessage, zap.Error(appError))

	// write a JSON response and fallback to generic message
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	responseBody, err := json.Marshal(response)
	if err != nil {
		logger.Error("Failed to marshal error response. Defaulting to generic.")
		http.Error(w, "Something went wrong", http.StatusInternalServerError)
		return
	}

	_, err = w.Write(responseBody)
	if err != nil {
		logger.Error("Failed to write error response. Defaulting to generic.")
		http.Error(w, "Something went wrong", http.StatusInternalServerError)
		return
	}
	return
}
