package testhelpers

import (
	"context"

	"github.com/99designs/gqlgen/client"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/authentication"
)

// NewRequesterPrincipal returns what represents an EASi user
// that is NOT empowered as a Reviewer
func NewRequesterPrincipal() authentication.Principal {
	return &authentication.EUAPrincipal{EUAID: "REQ", JobCodeEASi: true, JobCodeGRT: false}
}

// NewReviewerPrincipal returns what represents an EASi user
// that is empowered as a member of the GRT.
func NewReviewerPrincipal() authentication.Principal {
	return &authentication.EUAPrincipal{EUAID: "REV", JobCodeEASi: true, JobCodeGRT: true}
}

// AddAuthPrincipalToGraphQLClientTest returns a function to add an auth principal to a graphql client test
func AddAuthPrincipalToGraphQLClientTest(principal authentication.EUAPrincipal) func(*client.Request) {
	return func(request *client.Request) {
		ctx := appcontext.WithPrincipal(context.Background(), &principal)
		request.HTTP = request.HTTP.WithContext(ctx)
	}
}

// AddAuthWithAllJobCodesToGraphQLClientTest adds authentication for all job codes
func AddAuthWithAllJobCodesToGraphQLClientTest(euaID string) func(*client.Request) {
	return AddAuthPrincipalToGraphQLClientTest(authentication.EUAPrincipal{
		EUAID:            euaID,
		JobCodeEASi:      true,
		JobCodeGRT:       true,
		JobCode508User:   true,
		JobCode508Tester: true,
	})
}
