package okta

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/99designs/gqlgen/graphql/handler/transport"
	jwtverifier "github.com/okta/okta-jwt-verifier-golang"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/handlers"
	"github.com/cms-enterprise/easi-app/pkg/storage"
	"github.com/cms-enterprise/easi-app/pkg/userhelpers"
)

const (
	prodGRTJobCode      = "EASI_P_GOVTEAM"
	testGRTJobCode      = "EASI_D_GOVTEAM"
	prodTRBAdminJobCode = "EASI_TRB_ADMIN_P"
	testTRBAdminJobCode = "EASI_TRB_ADMIN_D"
)

func (f OktaMiddlewareFactory) jwt(_ *zap.Logger, authHeader string) (*authentication.EnhancedJwt, error) {
	tokenParts := strings.Split(authHeader, "Bearer ")
	if len(tokenParts) < 2 {
		return nil, errors.New("invalid Bearer in auth header")
	}
	bearerToken := tokenParts[1]
	if bearerToken == "" {
		return nil, errors.New("empty bearer value")
	}
	jwt, err := f.verifier.VerifyAccessToken(bearerToken)
	enhanced := authentication.EnhancedJwt{
		JWT:       jwt,
		AuthToken: bearerToken,
	}

	return &enhanced, err
}

func jwtGroupsContainsJobCode(jwt *jwtverifier.Jwt, jobCode string) bool {
	list, ok := jwt.Claims["groups"]
	if !ok {
		return false
	}

	// json arrays decode to `[]interface{}`
	codes, ok := list.([]interface{})
	if !ok {
		return false
	}

	for _, code := range codes {
		if c, ok := code.(string); ok {
			if strings.EqualFold(c, jobCode) {
				return true
			}
		}
	}
	return false
}

func (f OktaMiddlewareFactory) newPrincipal(ctx context.Context) (*authentication.EUAPrincipal, error) {
	enhanced := appcontext.EnhancedJWT(ctx)
	euaID, ok := enhanced.JWT.Claims["sub"].(string)
	if !ok || euaID == "" {
		return nil, errors.New("unable to retrieve EUA ID from JWT")
	}
	jwt := enhanced.JWT

	// the current assumption is that anyone with an appropriate
	// JWT provided by Okta for EASi is allowed to use EASi
	// as a viewer/submitter
	jcEASi := true

	// need to check the claims for empowerment as each role
	jcGRT := jwtGroupsContainsJobCode(jwt, f.codeGRT)
	jcTRBAdmin := jwtGroupsContainsJobCode(jwt, f.codeTRBAdmin)

	userAccount, err := userhelpers.GetOrCreateUserAccount(
		ctx,
		f.Store,
		euaID,
		true,
		userhelpers.GetOktaAccountInfoWrapperFunction(userhelpers.GetOktaAccountInfo),
	)
	if err != nil {
		return nil, err
	}

	return &authentication.EUAPrincipal{
			EUAID:           strings.ToUpper(euaID),
			JobCodeEASi:     jcEASi,
			JobCodeGRT:      jcGRT,
			JobCodeTRBAdmin: jcTRBAdmin,
			UserAccount:     userAccount,
		},
		nil
}

// NewAuthenticationMiddleware returns an HTTP handler that authenticates requests using Okta JWT tokens
func (f OktaMiddlewareFactory) NewAuthenticationMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		logger := appcontext.ZLogger(r.Context())
		authHeader := r.Header.Get("Authorization")
		if !strings.HasPrefix(authHeader, "Bearer") {
			next.ServeHTTP(w, r)
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
		ctx := r.Context()
		ctx = appcontext.WithEnhancedJWT(ctx, *jwt)

		principal, err := f.newPrincipal(ctx)
		if err != nil {
			f.WriteErrorResponse(
				r.Context(),
				w,
				&apperrors.UnauthorizedError{Err: fmt.Errorf("unable to get Principal from jwt: %w", err)},
			)
			return
		}
		logger = logger.With(zap.String("user", principal.ID())).With(zap.Bool("grt", principal.AllowGRT()))

		ctx = appcontext.WithPrincipal(ctx, principal)
		ctx = appcontext.WithLogger(ctx, logger)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// NewOktaWebSocketAuthenticationMiddleware returns a transport.WebsocketInitFunc that uses the `authToken` in
// the websocket connection payload to authenticate an Okta user.
func (f OktaMiddlewareFactory) NewOktaWebSocketAuthenticationMiddleware() transport.WebsocketInitFunc {
	return func(ctx context.Context, initPayload transport.InitPayload) (context.Context, *transport.InitPayload, error) {
		logger := appcontext.ZLogger(ctx)

		token, ok := initPayload["authToken"].(string)
		if !ok || token == "" {
			return nil, &initPayload, errors.New("authToken not found in transport payload")
		}

		jwt, err := f.jwt(logger, token)
		if err != nil {
			logger.Info("could not parse jwt from token", zap.Error(err))
			return nil, &initPayload, err
		}
		ctx = appcontext.WithEnhancedJWT(ctx, *jwt)

		principal, err := f.newPrincipal(ctx)
		if err != nil {
			logger.Error("could not set context for okta auth", zap.Error(err))
			return nil, &initPayload, err
		}

		if principal == nil {
			logger.Error("principal is nil after authentication")
			return nil, &initPayload, errors.New("authentication succeeded but principal is nil")
		}

		logger = logger.With(zap.String("user", principal.ID()))
		ctx = appcontext.WithPrincipal(ctx, principal)
		ctx = appcontext.WithLogger(ctx, logger)

		return ctx, &initPayload, nil
	}
}

// NewJwtVerifier returns a new JWT verifier with some minimal config
func NewJwtVerifier(clientID string, issuer string) *jwtverifier.JwtVerifier {
	toValidate := map[string]string{}
	toValidate["cid"] = clientID
	toValidate["aud"] = "EASi"

	jwtVerifierSetup := jwtverifier.JwtVerifier{
		Issuer:           issuer,
		ClaimsToValidate: toValidate,
	}

	return jwtVerifierSetup.New()
}

// JwtVerifier collects the methods we call on a JWT verifier
type JwtVerifier interface {
	VerifyAccessToken(jwt string) (*jwtverifier.Jwt, error)
}

// OktaMiddlewareFactory holds dependencies for Okta authentication middleware
type OktaMiddlewareFactory struct {
	handlers.HandlerBase
	Store        *storage.Store
	verifier     JwtVerifier
	codeGRT      string
	codeTRBAdmin string
}

// NewOktaMiddlewareFactory creates and returns an OktaMiddlewareFactory
func NewOktaMiddlewareFactory(base handlers.HandlerBase, jwtVerifier JwtVerifier, store *storage.Store, useTestJobCodes bool) *OktaMiddlewareFactory {
	// by default we want to use the PROD job codes, and only in
	// pre-PROD environments do we want to empower the
	// alternate job codes.
	jobCodeGRT := prodGRTJobCode
	jobCodeTRBAdmin := prodTRBAdminJobCode
	if useTestJobCodes {
		jobCodeGRT = testGRTJobCode
		jobCodeTRBAdmin = testTRBAdminJobCode
	}

	return &OktaMiddlewareFactory{
		HandlerBase:  base,
		Store:        store,
		verifier:     jwtVerifier,
		codeGRT:      jobCodeGRT,
		codeTRBAdmin: jobCodeTRBAdmin,
	}
}

// NewOktaAuthenticationMiddleware returns a wrapper for HandlerFunc to authorize with Okta
func NewOktaAuthenticationMiddleware(base handlers.HandlerBase, jwtVerifier JwtVerifier, store *storage.Store, useTestJobCodes bool) func(http.Handler) http.Handler {
	middlewareFactory := NewOktaMiddlewareFactory(base, jwtVerifier, store, useTestJobCodes)
	return middlewareFactory.NewAuthenticationMiddleware
}
