package cedar

import (
	"errors"
	"fmt"
	"strings"

	"github.com/go-openapi/runtime"
	httptransport "github.com/go-openapi/runtime/client"
	"github.com/go-openapi/strfmt"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	apiclient "github.com/cmsgov/easi-app/pkg/cedar/gen/client"
	apioperations "github.com/cmsgov/easi-app/pkg/cedar/gen/client/operations"
	apimodels "github.com/cmsgov/easi-app/pkg/cedar/gen/models"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/validate"
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

func validateSystemIntakeForCedar(intake *models.SystemIntake, logger *zap.Logger) error {
	var res []string
	if validate.RequireUUID(intake.ID) {
		res = append(res, "ID")
	}
	if validate.RequireString(intake.EUAUserID) {
		res = append(res, "EUAUserID")
	}
	if validate.RequireNullString(intake.Requester) {
		res = append(res, "Requester")
	}
	if validate.RequireNullString(intake.Component) {
		res = append(res, "Component")
	}
	if validate.RequireNullString(intake.BusinessOwner) {
		res = append(res, "BusinessOwner")
	}
	if validate.RequireNullString(intake.BusinessOwnerComponent) {
		res = append(res, "BusinessOwnerComponent")
	}
	if validate.RequireNullString(intake.ProductManager) {
		res = append(res, "ProductManager")
	}
	if validate.RequireNullString(intake.ProductManagerComponent) {
		res = append(res, "ProductManagerComponent")
	}
	if validate.RequireNullString(intake.ProjectName) {
		res = append(res, "ProjectName")
	}
	if validate.RequireNullBool(intake.ExistingFunding) {
		res = append(res, "ExistingFunding")
	}
	if intake.ExistingFunding.Bool && validate.RequireNullString(intake.FundingSource) {
		res = append(res, "FundingSource")
	}
	if validate.RequireNullString(intake.BusinessNeed) {
		res = append(res, "BusinessNeed")
	}
	if validate.RequireNullString(intake.Solution) {
		res = append(res, "Solution")
	}
	if validate.RequireNullBool(intake.EASupportRequest) {
		res = append(res, "EASupportRequest")
	}
	if validate.RequireNullString(intake.ProcessStatus) {
		res = append(res, "ProcessStatus")
	}
	if validate.RequireNullString(intake.ExistingContract) {
		res = append(res, "ExistingContract")
	}
	if validate.RequireTime(*intake.SubmittedAt) {
		res = append(res, "SubmittedAt")
	}
	if len(res) != 0 {
		invalidFields := strings.Join(res, ", ")
		return errors.New("Validation failed on these fields: " + invalidFields)
	}
	return nil
}

func submitSystemIntake(validatedIntake *models.SystemIntake, c TranslatedClient, logger *zap.Logger) (string, error) {
	id := validatedIntake.ID.String()
	submissionTime := validatedIntake.SubmittedAt.String()
	params := apioperations.NewIntakegovernancePOST4Params()
	governanceIntake := apimodels.GovernanceIntake{
		BusinessNeeds:           &validatedIntake.BusinessNeed.String,
		BusinessOwner:           &validatedIntake.BusinessOwner.String,
		BusinessOwnerComponent:  &validatedIntake.BusinessOwnerComponent.String,
		EaCollaborator:          validatedIntake.EACollaborator.String,
		EaSupportRequest:        &validatedIntake.EASupportRequest.Bool,
		EuaUserID:               &validatedIntake.EUAUserID,
		ExistingContract:        &validatedIntake.ExistingContract.String,
		ExistingFunding:         &validatedIntake.ExistingFunding.Bool,
		FundingSource:           validatedIntake.FundingSource.String,
		ID:                      &id,
		Isso:                    validatedIntake.ISSO.String,
		OitSecurityCollaborator: validatedIntake.OITSecurityCollaborator.String,
		ProcessStatus:           &validatedIntake.ProcessStatus.String,
		ProductManager:          &validatedIntake.ProductManager.String,
		ProductManagerComponent: &validatedIntake.ProductManagerComponent.String,
		Requester:               &validatedIntake.Requester.String,
		RequesterComponent:      &validatedIntake.Component.String,
		Solution:                &validatedIntake.Solution.String,
		SubmittedTime:           &submissionTime,
		SystemName:              &validatedIntake.ProjectName.String,
		TrbCollaborator:         validatedIntake.TRBCollaborator.String,
	}
	governanceConversion := []*apimodels.GovernanceIntake{
		&governanceIntake,
	}
	params.Body = &apimodels.Intake{
		Governance: governanceConversion,
	}
	resp, err := c.client.Operations.IntakegovernancePOST4(params, c.apiAuthHeader)
	fmt.Println(err)
	if err != nil {
		logger.Error(fmt.Sprintf("Failed to submit intake for CEDAR with error: %v", err))
		return "", err
	}
	alfabetID := ""
	if *resp.Payload.Response.Result != "success" {
		return "", &apperrors.ExternalAPIError{
			Err:       errors.New("CEDAR return result: " + *resp.Payload.Response.Result),
			ModelID:   validatedIntake.ID.String(),
			Model:     "System Intake",
			Operation: apperrors.Submit,
		}
	}
	alfabetID = resp.Payload.Response.Message[0]
	return alfabetID, nil
}

// ValidateAndSubmitSystemIntake submits a system intake to CEDAR
func (c TranslatedClient) ValidateAndSubmitSystemIntake(intake *models.SystemIntake, logger *zap.Logger) (string, error) {
	err := validateSystemIntakeForCedar(intake, logger)
	if err != nil {
		return "", &apperrors.ValidationError{
			Err:     err,
			ModelID: intake.ID.String(),
			Model:   "System Intake",
		}
	}
	return submitSystemIntake(intake, c, logger)
}
