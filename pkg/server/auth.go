// Package server is for setting up the server
package server

import (
	"net/http"
	"strings"

	jwtverifier "github.com/okta/okta-jwt-verifier-golang"
	"github.com/spf13/viper"
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

func authorizeHandler(next http.Handler) http.Handler {

	verifier := newJwtVerifier(viper.GetString("OKTA_CLIENT_ID"), viper.GetString("OKTA_ISSUER"))
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
