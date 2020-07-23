package cedarldap

import (
	"errors"
	"fmt"

	"github.com/go-openapi/runtime"
	httptransport "github.com/go-openapi/runtime/client"
	"github.com/go-openapi/strfmt"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	apiclient "github.com/cmsgov/easi-app/pkg/cedar/cedarldap/gen/client"
	"github.com/cmsgov/easi-app/pkg/cedar/cedarldap/gen/client/operations"
	"github.com/cmsgov/easi-app/pkg/cedar/cedarldap/gen/models"
)

// TranslatedClient is an API client for CEDAR LDAP using EASi language
type TranslatedClient struct {
	client        *apiclient.LDAP
	apiAuthHeader runtime.ClientAuthInfoWriter
}

// NewTranslatedClient returns an API client for CEDAR LDAP using EASi language
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
	params := operations.NewPersonIDParams()
	params.ID = euaID
	resp, err := c.client.Operations.PersonID(params, c.apiAuthHeader)
	if err != nil {
		logger.Error(fmt.Sprintf("Failed to fetch person from CEDAR LDAP with error: %v", err))
		return "", &apperrors.ExternalAPIError{
			Err:       err,
			Model:     models.Person{},
			ModelID:   euaID,
			Operation: apperrors.Fetch,
			Source:    "CEDAR LDAP",
		}
	}
	if resp.Payload == nil {
		return "", &apperrors.ExternalAPIError{
			Err:       errors.New("failed to return person from CEDAR LDAP"),
			ModelID:   euaID,
			Model:     models.Person{},
			Operation: apperrors.Fetch,
			Source:    "CEDAR LDAP",
		}
	}

	return resp.Payload.Email, nil
}
