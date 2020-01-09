package server

import (
	jwtverifier "github.com/okta/okta-jwt-verifier-golang"
	"net/http"
	"os"
	"strings"
)

func isAuthenticated(authHeader string, verifier jwtverifier.JwtVerifier) bool {
	tokenParts := strings.Split(authHeader, "Bearer ")
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

func newJwtVerifier() *jwtverifier.JwtVerifier {
	toValidate := map[string]string{}
	toValidate["cid"] = os.Getenv("OKTA_CLIENT_ID")
	toValidate["aud"] = "EASi"

	jwtVerifierSetup := jwtverifier.JwtVerifier{
		Issuer:           os.Getenv("OKTA_ISSUER"),
		ClaimsToValidate: toValidate,
	}

	return jwtVerifierSetup.New()
}

func authorizeHandler(next http.Handler) http.Handler {

	verifier := newJwtVerifier()
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "OPTIONS" {
			return
		}
		if !isAuthenticated(r.Header.Get("Authorization"), *verifier) {
			http.Error(w, http.StatusText(401), http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}
