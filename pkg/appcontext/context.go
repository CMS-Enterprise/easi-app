package appcontext

import (
	"context"
	"fmt"
	"os"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/authentication"
)

type contextKey int

const (
	loggerKey contextKey = iota
	traceKey
	principalKey
	jwtKey
	userAccountServiceKey
)

// WithLogger returns a context with the given logger
func WithLogger(ctx context.Context, logger *zap.Logger) context.Context {
	return context.WithValue(ctx, loggerKey, logger)
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

// WithEnhancedJWT returns the context decorated with the enhanced jwt
func WithEnhancedJWT(c context.Context, jwt authentication.EnhancedJwt) context.Context {
	return context.WithValue(c, jwtKey, jwt)
}

// EnhancedJWT returns the enhanced EnhancedJWT defaulting to nil if not present.
func EnhancedJWT(c context.Context) *authentication.EnhancedJwt {
	if jwt, ok := c.Value(jwtKey).(authentication.EnhancedJwt); ok {
		return &jwt
	}
	return nil
}

// UserAccountService returns a GetUserAccountFromDBFunc that is decorating the context
func UserAccountService(ctx context.Context) (authentication.GetUserAccountFromDBFunc, error) {
	userAccountServiceInterface := ctx.Value(userAccountServiceKey)
	if userAccountServiceInterface == nil {
		return nil, fmt.Errorf("the user account service was not found on the provided ctx")
	}
	userAccountService, ok := userAccountServiceInterface.(authentication.GetUserAccountFromDBFunc)
	if !ok {
		return nil, fmt.Errorf("a value was found for the user account service on the ctx, but it is not the correct type. It is type %T", userAccountServiceInterface)
	}

	return userAccountService, nil
}

// WithUserAccountService decorates the context with a GetUserAccountFromDBFunc
func WithUserAccountService(ctx context.Context, accountFunction authentication.GetUserAccountFromDBFunc) context.Context {
	return context.WithValue(ctx, userAccountServiceKey, accountFunction)
}
