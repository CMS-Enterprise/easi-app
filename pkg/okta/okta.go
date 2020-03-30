package okta

import (
	"fmt"
	"net/http"
	"strings"

	jwtverifier "github.com/okta/okta-jwt-verifier-golang"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/context"
)

func authenticateAndGetEua(logger *zap.Logger, authHeader string, verifier jwtverifier.JwtVerifier) (string, bool) {
	tokenParts := strings.Split(authHeader, "Bearer ")
	if len(tokenParts) < 2 {
		return "", false
	}
	bearerToken := tokenParts[1]
	if bearerToken == "" {
		return "", false
	}

	jwt, err := verifier.VerifyAccessToken(bearerToken)

	if err != nil {
		logger.Info(fmt.Sprintf("Unable to authorize request with okta: %v", err))
		return "", false
	}

	euaID := jwt.Claims["sub"].(string)
	return euaID, true
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
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			localLogger.Info("Unauthorized request with empty Authorization header")
			http.Error(w, http.StatusText(401), http.StatusUnauthorized)
			return
		}
		euaID, ok := authenticateAndGetEua(localLogger, authHeader, *verifier)
		logger = logger.With(zap.String("user", euaID))
		if !ok {
			http.Error(w, http.StatusText(401), http.StatusUnauthorized)
			return
		}

		ctx := context.WithEuaID(r.Context(), euaID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// NewOktaAuthorizeMiddleware returns a wrapper for HandlerFunc to authorize with Okta
func NewOktaAuthorizeMiddleware(logger *zap.Logger, clientID string, issuer string) func(http.Handler) http.Handler {
	verifier := newJwtVerifier(clientID, issuer)
	return func(next http.Handler) http.Handler {
		return authorizeMiddleware(logger, next, verifier)
	}
}
