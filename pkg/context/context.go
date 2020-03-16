package context

import (
	"context"

	"github.com/google/uuid"
	"go.uber.org/zap"
)

type contextKey int

const (
	loggerKey contextKey = iota
	traceKey
	euaIDKey
)

// WithLogger returns a context with the given logger
func WithLogger(ctx context.Context, logger *zap.Logger) context.Context {
	return context.WithValue(ctx, loggerKey, logger)
}

// Logger returns the context's logger
func Logger(ctx context.Context) (*zap.Logger, bool) {
	logger, ok := ctx.Value(loggerKey).(*zap.Logger)
	return logger, ok
}

// WithTrace returns a context with request trace
func WithTrace(ctx context.Context) context.Context {
	traceID := uuid.New()
	return context.WithValue(ctx, traceKey, traceID)
}

// Trace returns the context's trace UUID
func Trace(ctx context.Context) (uuid.UUID, bool) {
	traceID, ok := ctx.Value(traceKey).(uuid.UUID)
	return traceID, ok
}

// WithEuaID returns a context with the request EuaID
func WithEuaID(ctx context.Context, euaID string) context.Context {
	return context.WithValue(ctx, euaIDKey, euaID)
}

// EuaID returns the context's EuaID
func EuaID(ctx context.Context) (string, bool) {
	euaID, ok := ctx.Value(euaIDKey).(string)
	return euaID, ok
}
