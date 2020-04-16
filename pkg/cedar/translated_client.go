package cedar

import (
	"fmt"
	"time"

	"github.com/go-openapi/runtime"
	httptransport "github.com/go-openapi/runtime/client"
	"github.com/go-openapi/strfmt"
	"go.uber.org/zap"

	apiclient "github.com/cmsgov/easi-app/pkg/cedar/gen/client"
	apioperations "github.com/cmsgov/easi-app/pkg/cedar/gen/client/operations"
	apimodels "github.com/cmsgov/easi-app/pkg/cedar/gen/models"
	"github.com/cmsgov/easi-app/pkg/models"
)

// TranslatedClient is an API client for CEDAR using EASi language
type TranslatedClient struct {
	client        *apiclient.EASiCore
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

// FetchSystems fetches a system list from CEDAR
func (c TranslatedClient) FetchSystems(logger *zap.Logger) (models.SystemShorts, error) {
	resp, err := c.client.Operations.SystemsGET1(nil, c.apiAuthHeader)
	if err != nil {
		logger.Error(fmt.Sprintf("Failed to fetch system from CEDAR with error: %v", err))
		return models.SystemShorts{}, err
	}

	systems := make([]models.SystemShort, len(resp.Payload.Systems))
	for index, system := range resp.Payload.Systems {
		systems[index] = models.SystemShort{
			ID:      *system.ID,
			Name:    *system.SystemName,
			Acronym: system.SystemAcronym,
		}
	}
	return systems, nil
}

// SubmitSystemIntake submits a system intake to CEDAR
func (c TranslatedClient) SubmitSystemIntake(intake *models.SystemIntake, logger *zap.Logger) (string, error) {
	id := intake.ID.String()
	submissionTime := time.Now().String()
	governanceConversion := []*apimodels.GovernanceIntake{
		{
			BusinessNeeds:           &intake.BusinessNeed.String,
			BusinessOwner:           &intake.BusinessOwner.String,
			BusinessOwnerComponent:  &intake.BusinessOwnerComponent.String,
			EaCollaborator:          intake.EACollaborator.String,
			EaSupportRequest:        &intake.EASupportRequest.Bool,
			EuaUserID:               &intake.EUAUserID,
			ExistingContract:        &intake.ExistingContract.String,
			ExistingFunding:         &intake.ExistingFunding.Bool,
			FundingNumber:           intake.FundingSource.String,
			FundingSource:           intake.FundingSource.String,
			ID:                      &id,
			Isso:                    intake.ISSO.String,
			OitSecurityCollaborator: intake.OITSecurityCollaborator.String,
			ProcessStatus:           &intake.ProcessStatus.String,
			ProductManager:          &intake.ProductManager.String,
			ProductManagerComponent: &intake.ProductManagerComponent.String,
			Requester:               &intake.Requester.String,
			RequesterComponent:      &intake.Component.String,
			Solution:                &intake.Solution.String,
			SubmittedTime:           &submissionTime,
			SystemName:              &intake.ProjectName.String,
			TrbCollaborator:         intake.TRBCollaborator.String,
		},
	}
	params := &apioperations.IntakegovernancePOST4Params{
		Body: &apimodels.Intake{
			Governance: governanceConversion,
		},
	}
	ok, err := c.client.Operations.IntakegovernancePOST4(params, c.apiAuthHeader)
	fmt.Println(ok)
	if err != nil {
		fmt.Println(err)
		return "BAD", err
	}
	return "", nil
}
