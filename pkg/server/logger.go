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
			logger = logger.With(zap.String(traceField, traceID.String()))
		} else {
			logger.Error("Failed to get trace ID from context")
		}
		ctx = requestcontext.WithLogger(ctx, logger)

		fields := []zap.Field{
			zap.String("accepted-language", r.Header.Get("accepted-language")),
			zap.Int64("content-length", r.ContentLength),
			zap.String("host", r.Host),
			zap.String("method", r.Method),
			zap.String("protocol-version", r.Proto),
			zap.String("referer", r.Header.Get("referer")),
			zap.String("source", r.RemoteAddr),
			zap.String("url", r.URL.String()),
			zap.String("user-agent", r.UserAgent()),
		}
		logger.Info("Request", fields...)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// NewLoggerMiddleware returns a handler with a request based logger
func NewLoggerMiddleware(logger *zap.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return loggerMiddleware(logger, next)
	}
}
