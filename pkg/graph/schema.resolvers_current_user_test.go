package graph

import (
	"context"

	"github.com/99designs/gqlgen/client"
	_ "github.com/lib/pq" // required for postgres driver in sql

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/authentication"
)

func (s GraphQLTestSuite) TestCurrentUserQuery() {
	var resp struct {
		CurrentUser struct {
			LaunchDarkly struct {
				UserKey    string
				SignedHash string
			}
		}
	}

	s.client.MustPost(
		`query {
			currentUser {
				launchDarkly {
					userKey
					signedHash
				}
			}
		}`, &resp,
		func(request *client.Request) {
			principal := authentication.EUAPrincipal{EUAID: "ABCD"}
			ctx := appcontext.WithPrincipal(context.Background(), &principal)
			request.HTTP = request.HTTP.WithContext(ctx)
		},
	)

	s.Equal("e12e115acf4552b2568b55e93cbd39394c4ef81c82447fafc997882a02d23677", resp.CurrentUser.LaunchDarkly.UserKey)
	s.Equal("38d78a3eb69707e32038eaa04a9f0966712c53f44b650ba6079e0a69e8cb9425", resp.CurrentUser.LaunchDarkly.SignedHash)
}
