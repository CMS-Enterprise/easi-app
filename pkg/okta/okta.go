package okta

import (
	"errors"
	"fmt"
	"net/http"
	"strings"

	jwtverifier "github.com/okta/okta-jwt-verifier-golang"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/authn"
	"github.com/cmsgov/easi-app/pkg/handlers"
	"github.com/cmsgov/easi-app/pkg/models"
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

func (f oktaMiddlewareFactory) newUser(logger *zap.Logger, jwt *jwtverifier.Jwt) (models.User, error) {
	euaID := jwt.Claims["sub"].(string)
	if euaID == "" {
		return models.User{}, errors.New("unable to retrieve EUA ID from JWT")
	}

	return models.User{EUAUserID: euaID}, nil
}

func (f oktaMiddlewareFactory) newAuthorizeMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		logger, ok := appcontext.Logger(r.Context())
		if !ok {
			f.HandlerBase.Logger.Error("failed to get logger from context")
			logger = f.Logger
		}

		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			f.WriteErrorResponse(
				r.Context(),
				w,
				&apperrors.UnauthorizedError{Err: errors.New("empty authorization header")},
			)
			return
		}

		jwt, err := f.jwt(logger, authHeader)
		if err != nil {
			f.WriteErrorResponse(
				r.Context(),
				w,
				&apperrors.UnauthorizedError{Err: fmt.Errorf("unable to parse jwt: %w", err)},
			)
			return
		}

		user, err := f.newUser(logger, jwt)
		if err != nil {
			f.WriteErrorResponse(
				r.Context(),
				w,
				&apperrors.UnauthorizedError{Err: fmt.Errorf("unable to get User from jwt: %w", err)},
			)
			return
		}
		logger = logger.With(zap.String("user", user.EUAUserID))

		ctx := appcontext.WithUser(r.Context(), user)

		// also add the authn.Principal to the context... since
		// we don't yet have access to the Job Codes in the JWT, this builds
		// on the current assumption that anyone with an appropriate
		// JWT provided by Okta for EASi is allowed to use EASi
		// as a viewer/submitter. Effectively, this is just a new
		// way to re-state the same things the User type does, but
		// it gives a foward path for eventually empowering GRT users.
		ctx = appcontext.WithPrincipal(ctx, &authn.EUAPrincipal{
			EUAID:       user.EUAUserID,
			JobCodeEASi: true,
			JobCodeGRT:  false})

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
	handlers.HandlerBase
	verifier *jwtverifier.JwtVerifier
}

// NewOktaAuthorizeMiddleware returns a wrapper for HandlerFunc to authorize with Okta
func NewOktaAuthorizeMiddleware(base handlers.HandlerBase, clientID string, issuer string) func(http.Handler) http.Handler {
	verifier := newJwtVerifier(clientID, issuer)
	middlewareFactory := oktaMiddlewareFactory{HandlerBase: base, verifier: verifier}
	return func(next http.Handler) http.Handler {
		return middlewareFactory.newAuthorizeMiddleware(next)
	}
}
