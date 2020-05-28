package okta

import (
	"errors"
	"net/http"
	"strings"

	jwtverifier "github.com/okta/okta-jwt-verifier-golang"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
)

func (f oktaMiddlewareFactory) jwt(logger *zap.Logger, authHeader string) (*jwtverifier.Jwt, error) {
	tokenParts := strings.Split(authHeader, "Bearer ")
	if len(tokenParts) < 2 {
		return nil, errors.New("invalid Bearer in auth header")
	}
	bearerToken := tokenParts[1]
	if bearerToken == "" {
		return nil, errors.New("empty bearer value")
	}

	return f.verifier.VerifyAccessToken(bearerToken)
}

func (f oktaMiddlewareFactory) newAuthorizeMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		logger, ok := appcontext.Logger(r.Context())
		if !ok {
			f.logger.Error("failed to get logger from context")
			logger = f.logger
		}

		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			logger.Info("Unauthorized request with empty Authorization header")
			http.Error(w, http.StatusText(401), http.StatusUnauthorized)
			return
		}

		jwt, err := f.jwt(logger, authHeader)
		if err != nil {
			http.Error(w, http.StatusText(401), http.StatusUnauthorized)
			return
		}

		euaID := jwt.Claims["sub"].(string)
		logger = logger.With(zap.String("user", euaID))
		if !ok {
			http.Error(w, http.StatusText(401), http.StatusUnauthorized)
			return
		}

		ctx := appcontext.WithEuaID(r.Context(), euaID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
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

type oktaMiddlewareFactory struct {
	logger   *zap.Logger
	verifier *jwtverifier.JwtVerifier
}

// NewOktaAuthorizeMiddleware returns a wrapper for HandlerFunc to authorize with Okta
func NewOktaAuthorizeMiddleware(logger *zap.Logger, clientID string, issuer string) func(http.Handler) http.Handler {
	verifier := newJwtVerifier(clientID, issuer)
	middlewareFactory := oktaMiddlewareFactory{logger: logger, verifier: verifier}
	return func(next http.Handler) http.Handler {
		return middlewareFactory.newAuthorizeMiddleware(next)
	}
}
