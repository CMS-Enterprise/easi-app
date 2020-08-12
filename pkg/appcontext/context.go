package appcontext

import (
	"context"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/authn"
	"github.com/cmsgov/easi-app/pkg/models"
)

type contextKey int

const (
	loggerKey contextKey = iota
	traceKey
	userKey
	principalKey
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

// WithUser returns a context with the request User
func WithUser(ctx context.Context, user models.User) context.Context {
	return context.WithValue(ctx, userKey, user)
}

// User returns the context's User
func User(ctx context.Context) (models.User, bool) {
	user, ok := ctx.Value(userKey).(models.User)
	return user, ok
}

// WithPrincipal decorates the context with the given security principal
func WithPrincipal(c context.Context, p authn.Principal) context.Context {
	return context.WithValue(c, principalKey, p)
}

// Principal returns the security principal, defaulting to
// an Anonymous user if not assigned.
func Principal(c context.Context) authn.Principal {
	if p, ok := c.Value(principalKey).(authn.Principal); ok {
		return p
	}
	return authn.ANON
}
