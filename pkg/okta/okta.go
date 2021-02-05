package okta

import (
	"errors"
	"fmt"
	"net/http"
	"strings"

	jwtverifier "github.com/okta/okta-jwt-verifier-golang"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/authn"
	"github.com/cmsgov/easi-app/pkg/handlers"
)

const (
	prodGRTJobCode = "EASI_P_GOVTEAM"
	testGRTJobCode = "EASI_D_GOVTEAM"
)

func (f oktaMiddlewareFactory) jwt(authHeader string) (*jwtverifier.Jwt, error) {
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

func (f oktaMiddlewareFactory) newPrincipal(jwt *jwtverifier.Jwt) (*authn.EUAPrincipal, error) {
	euaID := jwt.Claims["sub"].(string)
	if euaID == "" {
		return nil, errors.New("unable to retrieve EUA ID from JWT")
	}

	// the current assumption is that anyone with an appropriate
	// JWT provided by Okta for EASi is allowed to use EASi
	// as a viewer/submitter
	jcEASi := true

	// need to check the claims for empowerment as a reviewer
	jcGRT := jwtGroupsContainsJobCode(jwt, f.codeGRT)

	return &authn.EUAPrincipal{EUAID: euaID, JobCodeEASi: jcEASi, JobCodeGRT: jcGRT}, nil
}

func (f oktaMiddlewareFactory) headerToPrincipal(header string) (*authn.EUAPrincipal, error) {
	if header == "" {
		// return nil, errors.New("empty authorization header")
		// quietly let non-authenticated requests through
		return nil, nil
	}
	jwt, err := f.jwt(header)
	if err != nil {
		return nil, fmt.Errorf("unable to parse jwt: %w", err)
	}
	principal, err := f.newPrincipal(jwt)
	if err != nil {
		return nil, fmt.Errorf("unable to get Principal from jwt: %w", err)
	}
	return principal, nil
}

func (f oktaMiddlewareFactory) newAuthenticationMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		// the AUTHENTICATION layer's responsibility is to answer "Do I
		// know who this is?", and if it can figure that out, it puts the
		// principal onto the context. Otherwise, it just lets the request
		// continue on.
		// (The responsibility to answer "is this requester allowed to
		// make this request" is the responsibility of a later
		// AUTHORIZATION layer)
		p, err := f.headerToPrincipal(r.Header.Get("Authorization"))
		if err != nil {
			appcontext.ZLogger(ctx).Info("no principal found", zap.Error(err))
		}
		if p != nil {
			// principal goes on the context
			ctx = appcontext.WithPrincipal(ctx, p)

			// decorate logs with the principal info
			logger := appcontext.ZLogger(ctx).
				With(zap.String("user", p.ID())).
				With(zap.Bool("grt", p.AllowGRT()))
			ctx = appcontext.WithLogger(ctx, logger)

			// new principal and loggers now available to all the
			// downstream parts of the chain via the decorated request
			r = r.WithContext(ctx)
		}
		next.ServeHTTP(w, r)
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
	codeGRT  string
}

// NewOktaAuthorizeMiddleware returns a wrapper for HandlerFunc to authorize with Okta
func NewOktaAuthorizeMiddleware(base handlers.HandlerBase, clientID string, issuer string, testGRT bool) func(http.Handler) http.Handler {
	verifier := newJwtVerifier(clientID, issuer)

	// by default we want to use the PROD job code, and only in
	// pre-PROD environments do we want to empower the
	// alternate job code.
	jobCodeGRT := prodGRTJobCode
	if testGRT {
		jobCodeGRT = testGRTJobCode
	}

	middlewareFactory := oktaMiddlewareFactory{HandlerBase: base, verifier: verifier, codeGRT: jobCodeGRT}
	return func(next http.Handler) http.Handler {
		return middlewareFactory.newAuthenticationMiddleware(next)
	}
}
