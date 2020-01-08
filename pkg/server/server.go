// Package server is some throwaway server code to setup testing
package server

import (
	"fmt"
	"github.com/cmsgov/easi-app/pkg/handlers"
	"github.com/okta/okta-jwt-verifier-golang"
	"log"
	"net/http"
	"os"
	"strings"
)

func isAuthenticated(authHeader string) bool {
	tokenParts := strings.Split(authHeader, "Bearer ")
	bearerToken := tokenParts[1]
	if bearerToken == "" {
		return false
	}

	toValidate := map[string]string{}
	toValidate["cid"] = os.Getenv("OKTA_CLIENT_ID")
	toValidate["aud"] = "EASi"

	jwtVerifierSetup := jwtverifier.JwtVerifier{
		Issuer:           os.Getenv("OKTA_ISSUER"),
		ClaimsToValidate: toValidate,
	}

	verifier := jwtVerifierSetup.New()

	_, err := verifier.VerifyAccessToken(bearerToken)

	if err != nil {
		return false
	}
	return true
}

func authorizeHandler(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "OPTIONS" {
			return
		}
		if !isAuthenticated(r.Header.Get("Authorization")) {
			http.Error(w, http.StatusText(401), http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func corsHandler(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, Authorization")

		next.ServeHTTP(w, r)
	})
}

// Serve serves all the handlers
func Serve() {
	fmt.Print("Serving application on localhost:8080")
	http.Handle("/", corsHandler(authorizeHandler(handlers.LandingHandler{})))
	log.Fatal(http.ListenAndServe(":8080", nil))
}
