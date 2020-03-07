package server

import (
	"net/http"

	"go.uber.org/zap"

	requestcontext "github.com/cmsgov/easi-app/pkg/context"
)

const traceField string = "traceID"

func loggerMiddleware(logger *zap.Logger, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		traceID, ok := requestcontext.Trace(ctx)
		if ok {
			ctx = requestcontext.WithLogger(ctx, logger.With(zap.String(traceField, traceID.String())))
		} else {
			ctx = requestcontext.WithLogger(ctx, logger)
			logger.Error("Failed to get trace ID from context")
		}
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// NewLoggerMiddleware returns a handler with a request based logger
func NewLoggerMiddleware(logger *zap.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return loggerMiddleware(logger, next)
	}
}
