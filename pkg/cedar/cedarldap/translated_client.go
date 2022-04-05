package cedarldap

import (
	"context"
	"errors"
	"fmt"

	"go.uber.org/zap"

	"github.com/go-openapi/runtime"
	httptransport "github.com/go-openapi/runtime/client"
	"github.com/go-openapi/strfmt"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	apiclient "github.com/cmsgov/easi-app/pkg/cedar/cedarldap/gen/client"
	"github.com/cmsgov/easi-app/pkg/cedar/cedarldap/gen/client/operations"
	"github.com/cmsgov/easi-app/pkg/cedar/cedarldap/gen/models"
	models2 "github.com/cmsgov/easi-app/pkg/models"
)

// TranslatedClient is an API client for CEDAR LDAP using EASi language
type TranslatedClient struct {
	client        *apiclient.LDAPAPIs
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
	if euaID == "" {
		appcontext.ZLogger(ctx).Error("No EUA ID specified; unable to request user info from CEDAR LDAP")
		return nil, &apperrors.InvalidParametersError{
			FunctionName: "cedarldap.FetchUserInfo",
		}
	}

	params := operations.NewPersonIdsParams()
	params.Ids = euaID // This endpoint supports a comma separated list of EUA IDs, or a single ID
	resp, err := c.client.Operations.PersonIds(params, c.apiAuthHeader)
	if err != nil {
		appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to fetch person from CEDAR LDAP with error: %v", err), zap.String("euaIDFetched", euaID))
		return nil, &apperrors.ExternalAPIError{
			Err:       err,
			Model:     models.Person{},
			ModelID:   euaID,
			Operation: apperrors.Fetch,
			Source:    "CEDAR LDAP",
		}
	}
	if resp.Payload == nil {
		return nil, &apperrors.ExternalAPIError{
			Err:       errors.New("failed to return person from CEDAR LDAP"),
			ModelID:   euaID,
			Model:     models.Person{},
			Operation: apperrors.Fetch,
			Source:    "CEDAR LDAP",
		}
	}

	// If there's nobody returned, we should throw an error
	if len(resp.Payload.Persons) == 0 || resp.Payload.Persons[0].UserName == "" {
		return nil, &apperrors.InvalidEUAIDError{
			EUAID: euaID,
		}
	}

	// At this point, we know there's an entry in the response, so lets grab it
	person := resp.Payload.Persons[0]

	return &models2.UserInfo{
		CommonName: person.CommonName,
		Email:      models2.NewEmailAddress(person.Email),
		EuaUserID:  person.UserName,
	}, nil
}
