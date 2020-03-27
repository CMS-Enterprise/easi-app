// Package testhelpers is for test code that needs to be imported across packages
// DO NOT use this in production code
package testhelpers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/okta/okta-jwt-verifier-golang/utils"
	"github.com/pquerna/otp/totp"
)

// AuthnResponse is a response marshaled from Okta authn API
type AuthnResponse struct {
	StateToken   string   `json:"stateToken"`
	Status       string   `json:"status"`
	Embedded     Embedded `json:"_embedded"`
	SessionToken string   `json:"sessionToken"`
}

// Embedded is part of the Okta authn response
type Embedded struct {
	Factors []Factor `json:"factors"`
}

// Factor has a challenge factor for MFA
type Factor struct {
	ID       string     `json:"id"`
	Provider string     `json:"provider"`
	Link     FactorLink `json:"_links"`
}

// FactorLink is a wrapper for a challenge link
type FactorLink struct {
	Verify FactorLinkVerify `json:"verify"`
}

// FactorLinkVerify is the challenge verification link
type FactorLinkVerify struct {
	HREF string `json:"href"`
}

// OktaAccessToken gets an access token from Okta to authorize requests to the EASi APIs in test
// Borrowing heavily from okta jwt package but adding MFA
// https://github.com/okta/okta-jwt-verifier-golang/blob/bf6f0d73000e3873d519714a3619b3c5d62ba615/jwtverifier_test.go#L354
// TODO: replace os package
func OktaAccessToken() (string, error) {
	// Get Session Token
	issuerParts, _ := url.Parse(os.Getenv("OKTA_DOMAIN"))
	baseURL := issuerParts.Scheme + "://" + issuerParts.Hostname()
	requestURI := baseURL + "/api/v1/authn"
	postValues := map[string]string{
		"username": os.Getenv("OKTA_TEST_USERNAME"),
		"password": os.Getenv("OKTA_TEST_PASSWORD"),
	}
	postJSONValues, _ := json.Marshal(postValues)
	/* #nosec */
	resp, err := http.Post(requestURI, "application/json", bytes.NewReader(postJSONValues))
	if err != nil {
		fmt.Println(err, "Could not submit authentication endpoint")
		return "", err
	}

	defer resp.Body.Close()
	body, _ := ioutil.ReadAll(resp.Body)

	var authn AuthnResponse
	err = json.Unmarshal(body, &authn)
	if err != nil {
		fmt.Println(err, "Could not unmarshal auth response")
		return "", err
	}

	var factorURI string
	for _, factor := range authn.Embedded.Factors {
		if factor.Provider == "GOOGLE" {
			factorURI = factor.Link.Verify.HREF
		}
	}
	passCode, err := totp.GenerateCode(os.Getenv("OKTA_TEST_SECRET"), time.Now())
	if err != nil {
		fmt.Println("unable to generate OTP code")
		return "", err
	}
	postValues = map[string]string{
		"passCode":   passCode,
		"stateToken": authn.StateToken,
	}
	postJSONValues, _ = json.Marshal(postValues)
	/* #nosec */
	factorResp, err := http.Post(factorURI, "application/json", bytes.NewReader(postJSONValues))
	if err != nil {
		fmt.Println("Failed to send MFA challenge")
		return "", err
	}
	defer factorResp.Body.Close()
	body, _ = ioutil.ReadAll(factorResp.Body)
	err = json.Unmarshal(body, &authn)
	if err != nil {
		fmt.Println("could not marshall mfa response")
		return "", err
	}

	// Issue get request with session token to get id/access tokens
	nonce, err := utils.GenerateNonce()
	if err != nil {
		fmt.Println("could not generate nonce")
		return "", err
	}
	authzURI := os.Getenv("OKTA_ISSUER") +
		"/v1/authorize?client_id=" +
		os.Getenv("OKTA_CLIENT_ID") +
		"&nonce=" +
		nonce +
		"&redirect_uri=" +
		os.Getenv("REACT_APP_OKTA_REDIRECT_URI") +
		"&response_type=token%20id_token&scope=openid&state" +
		"=ApplicationState&sessionToken=" + authn.SessionToken

	client := &http.Client{
		CheckRedirect: func(req *http.Request, with []*http.Request) error {
			return http.ErrUseLastResponse
		},
	}

	resp, err = client.Get(authzURI)
	if err != nil {
		fmt.Println("could not submit authorization endpoint")
		return "", err
	}

	defer resp.Body.Close()
	location := resp.Header.Get("Location")
	locParts, _ := url.Parse(location)
	fragmentParts, _ := url.ParseQuery(locParts.Fragment)

	if fragmentParts["access_token"] == nil {
		fmt.Println("could not extract access token")
		return "", err
	}
	return fragmentParts["access_token"][0], nil
}
