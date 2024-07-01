package server

import (
	"net/http"
	"time"

	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appconfig"
	"github.com/cms-enterprise/easi-app/pkg/appcontext"
)

const traceField string = "traceID"

func loggerMiddleware(logger *zap.Logger, environment appconfig.Environment, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		traceID, ok := appcontext.Trace(ctx)
		if ok {
			logger = logger.With(zap.String(traceField, traceID.String()))
		} else {
			logger.Error("Failed to get trace ID from context")
		}

		// Add app-name and app-env to ALL logs for easier filtering
		logger = logger.With(
			zap.String("app-name", "easi"),
			zap.String("app-env", environment.String()),
		)
		ctx = appcontext.WithLogger(ctx, logger)

		start := time.Now()
		next.ServeHTTP(w, r.WithContext(ctx))
		durationMS := time.Since(start).Milliseconds()

		// Log these fields after each HTTP request
		fields := []zap.Field{
			zap.String("accepted-language", r.Header.Get("accepted-language")),
			zap.Int64("content-length", r.ContentLength),
			zap.String("app-host", r.Host),
			zap.String("method", r.Method),
			zap.String("protocol-version", r.Proto),
			zap.String("referer", r.Header.Get("referer")),
			zap.Int64("response-time-ms", durationMS),
			zap.String("request-source", r.RemoteAddr),
			zap.String("url", r.URL.String()),
			zap.String("user-agent", r.UserAgent()),
		}
		logger.Info("Request", fields...)
	})
}

// newLoggerMiddleware returns a handler with a request based logger
func newLoggerMiddleware(logger *zap.Logger, environment appconfig.Environment) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return loggerMiddleware(logger, environment, next)
	}
}
