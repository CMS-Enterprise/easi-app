package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
)

type failWriter struct {
	realWriter *httptest.ResponseRecorder
	failCount  int
}

func (w *failWriter) Write(b []byte) (int, error) {
	if w.failCount == 0 {
		return w.realWriter.Write(b)
	}
	w.failCount--
	return 0, errors.New("writer fails")
}
func (w *failWriter) WriteHeader(statusCode int) {
	w.realWriter.WriteHeader(statusCode)
}

func (w *failWriter) Header() http.Header {
	return w.realWriter.Header()
}

func (s HandlerTestSuite) TestWriteErrorResponse() {
	ctx, traceID := appcontext.WithTrace(context.Background())

	var responseTests = []struct {
		appErr      error
		code        int
		errResponse errorResponse
	}{
		{
			&apperrors.UnauthorizedError{},
			http.StatusUnauthorized,
			errorResponse{
				Errors:  []errorItem{},
				Code:    http.StatusUnauthorized,
				Message: "Unauthorized",
				TraceID: traceID,
			},
		},
		{
			&apperrors.QueryError{},
			http.StatusInternalServerError,
			errorResponse{
				Errors:  []errorItem{},
				Code:    http.StatusInternalServerError,
				Message: "Something went wrong",
				TraceID: traceID,
			},
		},
		{
			&apperrors.ExternalAPIError{},
			http.StatusServiceUnavailable,
			errorResponse{
				Errors:  []errorItem{},
				Code:    http.StatusServiceUnavailable,
				Message: "Service unavailable",
				TraceID: traceID,
			},
		},
		{
			&apperrors.NotificationError{},
			http.StatusInternalServerError,
			errorResponse{
				Errors:  []errorItem{},
				Code:    http.StatusInternalServerError,
				Message: "Failed to send notification",
				TraceID: traceID,
			},
		},
		{
			&apperrors.ContextError{},
			http.StatusInternalServerError,
			errorResponse{
				Errors:  []errorItem{},
				Code:    http.StatusInternalServerError,
				Message: "Something went wrong",
				TraceID: traceID,
			},
		},
		{
			&apperrors.ValidationError{
				Validations: map[string]string{"key": "required"},
			},
			http.StatusUnprocessableEntity,
			errorResponse{
				Errors:  []errorItem{{Field: "key", Message: "required"}},
				Code:    http.StatusUnprocessableEntity,
				Message: "Entity unprocessable",
				TraceID: traceID,
			},
		},
		{
			&apperrors.MethodNotAllowedError{},
			http.StatusMethodNotAllowed,
			errorResponse{
				Errors:  []errorItem{},
				Code:    http.StatusMethodNotAllowed,
				Message: "Method not allowed",
				TraceID: traceID,
			},
		},
		{
			&apperrors.ResourceConflictError{},
			http.StatusConflict,
			errorResponse{
				Errors:  []errorItem{},
				Code:    http.StatusConflict,
				Message: "Resource conflict",
				TraceID: traceID,
			},
		},
		{
			&apperrors.BadRequestError{},
			http.StatusBadRequest,
			errorResponse{
				Errors:  []errorItem{},
				Code:    http.StatusBadRequest,
				Message: "Bad request",
				TraceID: traceID,
			},
		},
		{
			&apperrors.UnknownRouteError{},
			http.StatusNotFound,
			errorResponse{
				Errors:  []errorItem{},
				Code:    http.StatusNotFound,
				Message: "Not found",
				TraceID: traceID,
			},
		},
		{
			&apperrors.QueryError{Err: &apperrors.ResourceNotFoundError{}},
			http.StatusNotFound,
			errorResponse{
				Errors:  []errorItem{},
				Code:    http.StatusNotFound,
				Message: "Resource not found",
				TraceID: traceID,
			},
		},
		{
			errors.New("unknown error"),
			http.StatusInternalServerError,
			errorResponse{
				Errors:  []errorItem{},
				Code:    http.StatusInternalServerError,
				Message: "Something went wrong",
				TraceID: traceID,
			},
		},
	}
	for _, t := range responseTests {
		s.Run(fmt.Sprintf("%T returns %d code", t.appErr, t.code), func() {
			writer := httptest.NewRecorder()

			s.base.WriteErrorResponse(ctx, writer, t.appErr)

			s.Equal(t.code, writer.Code)
			s.Equal("application/json", writer.Header().Get("Content-Type"))
			errResponse := &errorResponse{}
			err := json.Unmarshal(writer.Body.Bytes(), errResponse)
			s.NoError(err)
			s.Equal(t.errResponse, *errResponse)
		})
	}

	s.Run("failing to write json return plain text response", func() {
		writer := failWriter{
			realWriter: httptest.NewRecorder(),
			failCount:  1,
		}
		s.base.WriteErrorResponse(ctx, &writer, errors.New("some error"))

		s.Equal("text/plain; charset=utf-8", writer.Header().Get("Content-Type"))
		s.Equal(http.StatusInternalServerError, writer.realWriter.Code)
		s.Equal("Something went wrong\n", writer.realWriter.Body.String())
	})
}
