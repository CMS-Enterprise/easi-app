package cedarldap

import (
	"fmt"

	"github.com/go-openapi/runtime"
	httptransport "github.com/go-openapi/runtime/client"
	"github.com/go-openapi/strfmt"
	"go.uber.org/zap"

	apiclient "github.com/cmsgov/easi-app/pkg/cedar/cedarldap/gen/client"
	"github.com/cmsgov/easi-app/pkg/cedar/cedarldap/gen/client/operations"
)

// TranslatedClient is an API client for CEDAR using EASi language
type TranslatedClient struct {
	client        *apiclient.LDAP
	apiAuthHeader runtime.ClientAuthInfoWriter
}

// NewTranslatedClient returns an API client for CEDAR using EASi language
func NewTranslatedClient(cedarHost string, cedarAPIKey string) TranslatedClient {
	// create the transport
	transport := httptransport.New(cedarHost, apiclient.DefaultBasePath, []string{"https"})

	// create the API client, with the transport
	client := apiclient.New(transport, strfmt.Default)

	// Set auth header
	apiKeyHeaderAuth := httptransport.APIKeyAuth("x-Gateway-APIKey", "header", cedarAPIKey)

	return TranslatedClient{client, apiKeyHeaderAuth}
}

// FetchUserEmailAddress checks that the user is authenticated
func (c TranslatedClient) FetchUserEmailAddress(logger *zap.Logger, euaID string) (string, error) {
	resp, err := c.client.Operations.PersonID(&operations.PersonIDParams{ID: euaID})
	if err != nil {
		logger.Error(fmt.Sprintf("Failed to fetch system from CEDAR with error: %v", err))
		return "", err
	}

	return resp.Payload.Person.Email, nil
}
