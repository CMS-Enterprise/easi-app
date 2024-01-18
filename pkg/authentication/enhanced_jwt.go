package authentication

import (
	"fmt"

	jwtverifier "github.com/okta/okta-jwt-verifier-golang"
)

// EnhancedJwt is the JWT and the auth token
type EnhancedJwt struct {
	JWT       *jwtverifier.Jwt
	AuthToken string
}

// GetOktaBaseURL returns the OktaBaseURL for the user in the context of the request and errors if the context doesn't have one
func (ejwt *EnhancedJwt) GetOktaBaseURL() (*string, error) {
	if url, ok := ejwt.JWT.Claims["iss"].(string); ok {
		return &url, nil
	}
	return nil, fmt.Errorf("there is no base URL in the JWT claim")
}
