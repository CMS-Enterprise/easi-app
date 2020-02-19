package cedar

import (
	"github.com/go-openapi/runtime"
	httptransport "github.com/go-openapi/runtime/client"
	"github.com/go-openapi/strfmt"

	apiclient "github.com/cmsgov/easi-app/pkg/cedar/gen/client"
	"github.com/cmsgov/easi-app/pkg/models"
)

// TranslatedClient is an API client for CEDAR using EASi language
type TranslatedClient struct {
	client        *apiclient.EASiCore
	apiAuthHeader runtime.ClientAuthInfoWriter
}

// NewTranslatedClient returns an API client for CEDAR using EASi language
func NewTranslatedClient(cedarAPIKey string) TranslatedClient {
	// create the transport
	transport := httptransport.New(apiclient.DefaultHost, apiclient.DefaultBasePath, nil)

	// create the API client, with the transport
	client := apiclient.New(transport, strfmt.Default)

	// Set auth header
	apiKeyHeaderAuth := httptransport.APIKeyAuth("x-Gateway-APIKey", "header", cedarAPIKey)

	return TranslatedClient{client, apiKeyHeaderAuth}
}

// FetchSystems fetches a system list from CEDAR
func (c TranslatedClient) FetchSystems() (models.SystemShorts, error) {
	resp, err := c.client.Operations.SystemsGET1(nil, c.apiAuthHeader)
	if err != nil {
		return models.SystemShorts{}, err
	}

	systems := make([]models.SystemShort, len(resp.Payload.Systems))
	for index, system := range resp.Payload.Systems {
		systems[index] = models.SystemShort{
			ID:      *system.ID,
			Name:    *system.SystemName,
			Acronym: *system.SystemAcronym,
		}
	}
	return systems, nil
}
