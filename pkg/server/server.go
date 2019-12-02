// Package server is some throwaway server code to setup testing
package server

import (
	"fmt"
	"github.com/cmsgov/easi-app/pkg/handlers"
	"github.com/okta/okta-jwt-verifier-golang"
	"log"
	"net/http"
	"os"
)

func verify(token string) bool {
	toValidate := map[string]string{}
	toValidate["cid"] = os.Getenv("OKTA_CLIENT_ID")
	toValidate["aud"] = "api://default"

	jwtVerifierSetup := jwtverifier.JwtVerifier{
		Issuer:           os.Getenv("OKTA_ISSUER"),
		ClaimsToValidate: toValidate,
	}

	verifier := jwtVerifierSetup.New()

	jwt, err := verifier.VerifyAccessToken(token)

	fmt.Println(jwt)
	fmt.Println(err)
	if err != nil {
		return false
	}
	return true
}

func authorizeHandler(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		verify(r.Header.Get("accessToken"))
		next.ServeHTTP(w, r)
	})
}

// Serve serves all the handlers
func Serve() {
	fmt.Print("Serving application on localhost:8080")
	http.Handle("/", authorizeHandler(handlers.LandingHandler{}))
	log.Fatal(http.ListenAndServe(":8080", nil))
}
