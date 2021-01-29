package local

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/go-openapi/swag"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/authn"
)

// If you're developing interfaces with CEDAR LDAP and you want to use Okta login on the frontend,
// you may need to set the LOCAL_TEST_EUAID variable to your a valid EUAID (such as your own)
const defaultTestEUAID = "ABCD"

// DevUserConfig is the set of values that can be passed in a request header
type DevUserConfig struct {
	EUA      string   `json:"euaId"`
	JobCodes []string `json:"jobCodes"`
}

func headerToPrincipal(header string, defaultEUAID string) (authn.Principal, error) {
	if len(header) == 0 {
		return nil, fmt.Errorf("no Authentication header present")
	}
	tokenParts := strings.Split(header, "Bearer ")
	if len(tokenParts) < 2 {
		return nil, fmt.Errorf("invalid Bearer in auth header")
	}
	devUserConfigJSON := tokenParts[1]
	if devUserConfigJSON == "" {
		return nil, fmt.Errorf("empty dev user config JSON")
	}

	config := DevUserConfig{}
	if parseErr := json.Unmarshal([]byte(devUserConfigJSON), &config); parseErr != nil {
		// if we can't parse the chunk of string after the "Bearer ",
		// Assume at this point that we've opted for Okta login on the frontend.
		// and therefore we inject a fully authorized Principal
		return &authn.EUAPrincipal{
			EUAID:       defaultEUAID,
			JobCodeEASi: true,
			JobCodeGRT:  true,
		}, fmt.Errorf("default principal with Okta frontend login")
	}

	return &authn.EUAPrincipal{
		EUAID:       config.EUA,
		JobCodeEASi: true,
		JobCodeGRT:  swag.ContainsStrings(config.JobCodes, "EASI_D_GOVTEAM"),
	}, fmt.Errorf("populating EUA ID and job codes")
}

func authorizeMiddleware(next http.Handler, defaultEUAID string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		// the AUTHENTICATION layer's responsibility is to answer "Do I
		// know who this is?", and if it can figure that out, it puts the
		// principal onto the context. Otherwise, it just lets the request
		// continue on.
		// (The responsibility to answer "is this requester allowed to
		// make this request" is the responsibility of a later
		// AUTHORIZATION layer)
		p, err := headerToPrincipal(r.Header.Get("Authorization"), defaultEUAID)
		if err != nil {
			appcontext.ZLogger(ctx).Info("LOCAL AUTH MIDDLEWARE", zap.Error(err))
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

// NewLocalAuthorizeMiddleware stubs out context info while ignoring remote authorization
func NewLocalAuthorizeMiddleware(logger *zap.Logger, testEUAID string) func(http.Handler) http.Handler {
	// we log here at ERROR level, because if this code is running
	// in any of our deployed environments, we want to be
	// VERY LOUD (i.e. send alerts) about it
	logger.Error("Using LOCAL AUTHENTICATION middleware!!")

	// calculate whatever EUA ID will be used when we fallback
	euaID := defaultTestEUAID
	if testEUAID != "" {
		euaID = testEUAID
	}

	return func(next http.Handler) http.Handler {
		return authorizeMiddleware(next, euaID)
	}
}
