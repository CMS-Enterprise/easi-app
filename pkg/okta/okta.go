package okta

import (
	"net/http"
	"strings"

	jwtverifier "github.com/okta/okta-jwt-verifier-golang"
)

func isAuthenticated(authHeader string, verifier jwtverifier.JwtVerifier) bool {
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

// NewOktaAuthorizeMiddleware returns a wrapper for HandlerFunc to authorize with Okta
func NewOktaAuthorizeMiddleware(clientID string, issuer string) func(http.HandlerFunc) (handlerFunc http.HandlerFunc) {
	verifier := newJwtVerifier(clientID, issuer)
	return func(next http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			if r.Method == "OPTIONS" {
				return
			}
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" || !isAuthenticated(authHeader, *verifier) {
				http.Error(w, http.StatusText(401), http.StatusUnauthorized)
				return
			}
			next.ServeHTTP(w, r)
		}
	}
}
