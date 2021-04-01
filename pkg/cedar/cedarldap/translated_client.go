package cedarldap

import (
	"context"
	"errors"
	"fmt"

	"github.com/cmsgov/easi-app/pkg/appcontext"

	"github.com/go-openapi/runtime"
	httptransport "github.com/go-openapi/runtime/client"
	"github.com/go-openapi/strfmt"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	apiclient "github.com/cmsgov/easi-app/pkg/cedar/cedarldap/gen/client"
	"github.com/cmsgov/easi-app/pkg/cedar/cedarldap/gen/client/operations"
	"github.com/cmsgov/easi-app/pkg/cedar/cedarldap/gen/models"
	models2 "github.com/cmsgov/easi-app/pkg/models"
)

// TranslatedClient is an API client for CEDAR LDAP using EASi language
type TranslatedClient struct {
	client        *apiclient.LDAP
	apiAuthHeader runtime.ClientAuthInfoWriter
}

// Client is an interface for helping test dependencies
type Client interface {
	FetchUserInfo(context.Context, string) (*models2.UserInfo, error)
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

// FetchUserInfo fetches a user's personal details
func (c TranslatedClient) FetchUserInfo(ctx context.Context, euaID string) (*models2.UserInfo, error) {
	params := operations.NewPersonIDParams()
	params.ID = euaID
	resp, err := c.client.Operations.PersonID(params, c.apiAuthHeader)
	if err != nil {
		appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to fetch person from CEDAR LDAP with error: %v", err))
		return nil, &apperrors.ExternalAPIError{
			Err:       err,
			Model:     models.Person{},
			ModelID:   euaID,
			Operation: apperrors.Fetch,
			Source:    "CEDAR LDAP",
		}
	}
	if resp.Payload == nil || resp.Payload.UserName == "" {
		return nil, &apperrors.ExternalAPIError{
			Err:       errors.New("failed to return person from CEDAR LDAP"),
			ModelID:   euaID,
			Model:     models.Person{},
			Operation: apperrors.Fetch,
			Source:    "CEDAR LDAP",
		}
	}

	return &models2.UserInfo{
		CommonName: resp.Payload.CommonName,
		Email:      models2.NewEmailAddress(resp.Payload.Email),
		EuaUserID:  resp.Payload.UserName,
	}, nil
}
