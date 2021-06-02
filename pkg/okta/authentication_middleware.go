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
	"github.com/cmsgov/easi-app/pkg/authentication"
	"github.com/cmsgov/easi-app/pkg/handlers"
)

const (
	prodGRTJobCode       = "EASI_P_GOVTEAM"
	testGRTJobCode       = "EASI_D_GOVTEAM"
	prod508UserJobCode   = "EASI_P_508_USER"
	test508UserJobCode   = "EASI_D_508_USER"
	prod508TesterJobCode = "EASI_P_508_TESTER"
	test508TesterJobCode = "EASI_D_508_TESTER"
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

func (f oktaMiddlewareFactory) newPrincipal(jwt *jwtverifier.Jwt) (*authentication.EUAPrincipal, error) {
	euaID := jwt.Claims["sub"].(string)
	if euaID == "" {
		return nil, errors.New("unable to retrieve EUA ID from JWT")
	}

	// the current assumption is that anyone with an appropriate
	// JWT provided by Okta for EASi is allowed to use EASi
	// as a viewer/submitter
	jcEASi := true

	// need to check the claims for empowerment as each role
	jcGRT := jwtGroupsContainsJobCode(jwt, f.codeGRT)
	jc508Tester := jwtGroupsContainsJobCode(jwt, f.code508Tester)
	jc508User := jwtGroupsContainsJobCode(jwt, f.code508User)

	return &authentication.EUAPrincipal{
			EUAID:            euaID,
			JobCodeEASi:      jcEASi,
			JobCodeGRT:       jcGRT,
			JobCode508Tester: jc508Tester,
			JobCode508User:   jc508User,
		},
		nil
}

func (f oktaMiddlewareFactory) newAuthenticationMiddleware(next http.Handler) http.Handler {
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

		principal, err := f.newPrincipal(jwt)
		if err != nil {
			f.WriteErrorResponse(
				r.Context(),
				w,
				&apperrors.UnauthorizedError{Err: fmt.Errorf("unable to get Principal from jwt: %w", err)},
			)
			return
		}
		logger = logger.With(zap.String("user", principal.ID())).With(zap.Bool("grt", principal.AllowGRT()))

		ctx := r.Context()
		ctx = appcontext.WithPrincipal(ctx, principal)
		ctx = appcontext.WithLogger(ctx, logger)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
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

type oktaMiddlewareFactory struct {
	handlers.HandlerBase
	verifier      JwtVerifier
	codeGRT       string
	code508Tester string
	code508User   string
}

// NewOktaAuthenticationMiddleware returns a wrapper for HandlerFunc to authorize with Okta
func NewOktaAuthenticationMiddleware(base handlers.HandlerBase, jwtVerifier JwtVerifier, useTestJobCodes bool) func(http.Handler) http.Handler {
	// by default we want to use the PROD job codes, and only in
	// pre-PROD environments do we want to empower the
	// alternate job codes.
	jobCodeGRT := prodGRTJobCode
	jobCode508User := prod508UserJobCode
	jobCode508Tester := prod508TesterJobCode
	if useTestJobCodes {
		jobCodeGRT = testGRTJobCode
		jobCode508Tester = test508TesterJobCode
		jobCode508User = test508UserJobCode
	}

	middlewareFactory := oktaMiddlewareFactory{
		HandlerBase:   base,
		verifier:      jwtVerifier,
		codeGRT:       jobCodeGRT,
		code508Tester: jobCode508Tester,
		code508User:   jobCode508User,
	}
	return middlewareFactory.newAuthenticationMiddleware
}
