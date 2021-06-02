package appcontext

import (
	"context"
	"fmt"
	"os"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/authentication"
)

type contextKey int

const (
	loggerKey contextKey = iota
	traceKey
	principalKey
)

// WithLogger returns a context with the given logger
func WithLogger(ctx context.Context, logger *zap.Logger) context.Context {
	return context.WithValue(ctx, loggerKey, logger)
}

// Logger returns the context's logger
// DEPRECATED - prefer ZLogger going forward
func Logger(ctx context.Context) (*zap.Logger, bool) {
	logger, ok := ctx.Value(loggerKey).(*zap.Logger)
	return logger, ok
}

// ZLogger will always return something that functions
// as a zap.Logger, even if it wasn't already placed
// on the context
func ZLogger(ctx context.Context) *zap.Logger {
	if logger, ok := ctx.Value(loggerKey).(*zap.Logger); ok {
		return logger
	}
	fmt.Fprintln(os.Stderr, "Logger not found on context.")
	return zap.NewNop()
}

// WithTrace returns a context with request trace
func WithTrace(ctx context.Context) (context.Context, uuid.UUID) {
	traceID := uuid.New()
	return context.WithValue(ctx, traceKey, traceID), traceID
}

// Trace returns the context's trace UUID
func Trace(ctx context.Context) (uuid.UUID, bool) {
	traceID, ok := ctx.Value(traceKey).(uuid.UUID)
	return traceID, ok
}

// WithPrincipal decorates the context with the given security principal
func WithPrincipal(c context.Context, p authentication.Principal) context.Context {
	return context.WithValue(c, principalKey, p)
}

// Principal returns the security principal, defaulting to
// an Anonymous user if not assigned.
func Principal(c context.Context) authentication.Principal {
	if p, ok := c.Value(principalKey).(authentication.Principal); ok {
		return p
	}
	return authentication.ANON
}
