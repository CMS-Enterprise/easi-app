package okta

import (
	"fmt"
	"net/http"
	"strings"

	jwtverifier "github.com/okta/okta-jwt-verifier-golang"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/context"
)

func isAuthenticated(logger *zap.Logger, authHeader string, verifier jwtverifier.JwtVerifier) bool {
	tokenParts := strings.Split(authHeader, "Bearer ")
	if len(tokenParts) < 2 {
		return false
	}
	bearerToken := tokenParts[1]
	if bearerToken == "" {
		return false
	}

	_, err := verifier.VerifyAccessToken(bearerToken)

	if err != nil {
		logger.Info(fmt.Sprintf("Unable to authorize request with okta: %v", err))
		return false
	}
	return true
}

func newJwtVerifier(clientID string, issuer string) *jwtverifier.JwtVerifier {
	toValidate := map[string]string{}
	toValidate["cid"] = clientID
	toValidate["aud"] = "EASi"

	jwtVerifierSetup := jwtverifier.JwtVerifier{
		Issuer:           issuer,
		ClaimsToValidate: toValidate,
	}

	return jwtVerifierSetup.New()
}

func authorizeMiddleware(logger *zap.Logger, next http.Handler, verifier *jwtverifier.JwtVerifier) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		localLogger, ok := context.Logger(r.Context())
		if !ok {
			logger.Error("failed to get logger from context")
			localLogger = logger
		}
		if r.Method == "OPTIONS" {
			return
		}
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			localLogger.Info("Unauthorized request with empty Authorization header")
			http.Error(w, http.StatusText(401), http.StatusUnauthorized)
			return
		}
		if !isAuthenticated(localLogger, authHeader, *verifier) {
			http.Error(w, http.StatusText(401), http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}

// NewOktaAuthorizeMiddleware returns a wrapper for HandlerFunc to authorize with Okta
func NewOktaAuthorizeMiddleware(logger *zap.Logger, clientID string, issuer string) func(http.Handler) http.Handler {
	verifier := newJwtVerifier(clientID, issuer)
	return func(next http.Handler) http.Handler {
		return authorizeMiddleware(logger, next, verifier)
	}
}
