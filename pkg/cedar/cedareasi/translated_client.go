package cedareasi

import (
	"context"
	"errors"

	"github.com/go-openapi/runtime"
	httptransport "github.com/go-openapi/runtime/client"
	"github.com/go-openapi/strfmt"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	apiclient "github.com/cmsgov/easi-app/pkg/cedar/cedareasi/gen/client"
	apioperations "github.com/cmsgov/easi-app/pkg/cedar/cedareasi/gen/client/operations"
	apimodels "github.com/cmsgov/easi-app/pkg/cedar/cedareasi/gen/models"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/validate"
)

// TranslatedClient is an API client for CEDAR EASi using EASi language
type TranslatedClient struct {
	client        *apiclient.EASiCore
	apiAuthHeader runtime.ClientAuthInfoWriter
}

// NewTranslatedClient returns an API client for CEDAR EASi using EASi language
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
func (c TranslatedClient) FetchSystems(ctx context.Context) (models.SystemShorts, error) {
	resp, err := c.client.Operations.SystemsGET2(nil, c.apiAuthHeader)
	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to fetch system from CEDAR", zap.Error(err))
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

// ValidateSystemIntakeForCedar validates all required fields to ensure we won't get errors for contents of the request
func ValidateSystemIntakeForCedar(ctx context.Context, intake *models.SystemIntake) error {
	expectedError := apperrors.ValidationError{
		Err:         errors.New("validation failed"),
		Validations: apperrors.Validations{},
		ModelID:     intake.ID.String(),
		Model:       intake,
	}
	const validationMessage = "is required"
	if validate.RequireUUID(intake.ID) {
		expectedError.WithValidation("ID", validationMessage)
	}
	if validate.RequireString(intake.EUAUserID) {
		expectedError.WithValidation("EUAUserID", validationMessage)
	}
	if validate.RequireString(intake.Requester) {
		expectedError.WithValidation("Requester", validationMessage)
	}
	if validate.RequireNullString(intake.Component) {
		expectedError.WithValidation("Component", validationMessage)
	}
	if validate.RequireNullString(intake.BusinessOwner) {
		expectedError.WithValidation("BusinessOwner", validationMessage)
	}
	if validate.RequireNullString(intake.BusinessOwnerComponent) {
		expectedError.WithValidation("BusinessOwnerComponent", validationMessage)
	}
	if validate.RequireNullString(intake.ProductManager) {
		expectedError.WithValidation("ProductManager", validationMessage)
	}
	if validate.RequireNullString(intake.ProductManagerComponent) {
		expectedError.WithValidation("ProductManagerComponent", validationMessage)
	}
	if validate.RequireNullString(intake.ProjectName) {
		expectedError.WithValidation("ProjectName", validationMessage)
	}
	if validate.RequireNullBool(intake.ExistingFunding) {
		expectedError.WithValidation("ExistingFunding", validationMessage)
	}
	if intake.ExistingFunding.Bool {
		if validate.RequireNullString(intake.FundingSource) {
			expectedError.WithValidation("FundingSource", validationMessage)
		}
		if intake.FundingSource.Valid && validate.FundingNumberInvalid(intake.FundingSource.String) {
			expectedError.WithValidation("FundingSource", "must be a 6 digit string")
		}
	}
	if validate.RequireNullString(intake.BusinessNeed) {
		expectedError.WithValidation("BusinessNeed", validationMessage)
	}
	if validate.RequireNullString(intake.Solution) {
		expectedError.WithValidation("Solution", validationMessage)
	}
	if validate.RequireNullBool(intake.EASupportRequest) {
		expectedError.WithValidation("EASupportRequest", validationMessage)
	}
	if validate.RequireNullString(intake.ProcessStatus) {
		expectedError.WithValidation("ProcessStatus", validationMessage)
	}
	if validate.RequireNullString(intake.ExistingContract) {
		expectedError.WithValidation("ExistingContract", validationMessage)
	}
	if validate.RequireTime(*intake.SubmittedAt) {
		expectedError.WithValidation("SubmittedAt", validationMessage)
	}
	if len(expectedError.Validations) > 0 {
		return &expectedError
	}
	return nil
}

func submitSystemIntake(ctx context.Context, validatedIntake *models.SystemIntake, c TranslatedClient) (string, error) {
	id := validatedIntake.ID.String()
	submissionTime := validatedIntake.SubmittedAt.String()
	params := apioperations.NewIntakegovernancePOST5Params()
	governanceIntake := apimodels.GovernanceIntake{
		BusinessNeeds:           validatedIntake.BusinessNeed.String,
		BusinessOwner:           validatedIntake.BusinessOwner.String,
		BusinessOwnerComponent:  validatedIntake.BusinessOwnerComponent.String,
		EaCollaborator:          validatedIntake.EACollaborator.String,
		EaSupportRequest:        validatedIntake.EASupportRequest.Bool,
		EuaUserID:               &validatedIntake.EUAUserID,
		ExistingContract:        validatedIntake.ExistingContract.String,
		ExistingFunding:         validatedIntake.ExistingFunding.Bool,
		FundingSource:           validatedIntake.FundingSource.String,
		ID:                      &id,
		Isso:                    validatedIntake.ISSO.String,
		OitSecurityCollaborator: validatedIntake.OITSecurityCollaborator.String,
		ProcessStatus:           validatedIntake.ProcessStatus.String,
		ProductManager:          validatedIntake.ProductManager.String,
		ProductManagerComponent: validatedIntake.ProductManagerComponent.String,
		Requester:               validatedIntake.Requester,
		RequesterComponent:      validatedIntake.Component.String,
		Solution:                validatedIntake.Solution.String,
		SubmittedAt:             submissionTime,
		SystemName:              validatedIntake.ProjectName.String,
		TrbCollaborator:         validatedIntake.TRBCollaborator.String,
	}
	params.Body = &apimodels.Intake{
		Governance: &governanceIntake,
	}
	resp, err := c.client.Operations.IntakegovernancePOST5(params, c.apiAuthHeader)
	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to submit intake for CEDAR", zap.Error(err))
		return "", &apperrors.ExternalAPIError{
			Err:       err,
			Model:     validatedIntake,
			ModelID:   id,
			Operation: apperrors.Submit,
			Source:    "CEDAR",
		}
	}
	alfabetID := ""
	if *resp.Payload.Response.Result != "success" {
		return "", &apperrors.ExternalAPIError{
			Err:       errors.New("CEDAR return result: " + *resp.Payload.Response.Result),
			ModelID:   validatedIntake.ID.String(),
			Model:     validatedIntake,
			Operation: apperrors.Submit,
			Source:    "CEDAR",
		}
	}
	alfabetID = resp.Payload.Response.Message[0]
	return alfabetID, nil
}

// ValidateAndSubmitSystemIntake submits a system intake to CEDAR
func (c TranslatedClient) ValidateAndSubmitSystemIntake(ctx context.Context, intake *models.SystemIntake) (string, error) {
	err := ValidateSystemIntakeForCedar(ctx, intake)
	if err != nil {
		return "", err
	}
	return submitSystemIntake(ctx, intake, c)
}

// SubmitBusinessCase submits a business case to CEDAR
func SubmitBusinessCase(ctx context.Context, businessCase *models.BusinessCase, c TranslatedClient) (string, error) {
	id := businessCase.ID.String()
	systemIntakeID := businessCase.SystemIntakeID.String()
	status := string(businessCase.Status)
	params := apioperations.NewIntakebusinessCasePOST7Params()
	var asIsLifecycleCostLines,
		preferredLifecycleCostLines,
		alternativeALifecycleCostLines,
		alternativeBLifecycleCostLines []*apimodels.LifecycleCostLine
	for _, line := range businessCase.LifecycleCostLines {
		cost := int32(*line.Cost)
		lifecycleCostLineID := line.ID.String()
		year := string(line.Year)
		lifecycleCostLine := apimodels.LifecycleCostLine{
			Cost:  &cost,
			ID:    &lifecycleCostLineID,
			Phase: (*string)(line.Phase),
			Year:  &year,
		}
		switch line.Solution {
		case models.LifecycleCostSolutionASIS:
			asIsLifecycleCostLines = append(asIsLifecycleCostLines, &lifecycleCostLine)
			break
		case models.LifecycleCostSolutionPREFERRED:
			preferredLifecycleCostLines = append(preferredLifecycleCostLines, &lifecycleCostLine)
			break
		case models.LifecycleCostSolutionA:
			alternativeALifecycleCostLines = append(alternativeALifecycleCostLines, &lifecycleCostLine)
			break
		case models.LifecycleCostSolutionB:
			alternativeBLifecycleCostLines = append(alternativeBLifecycleCostLines, &lifecycleCostLine)
		}
	}
	asIs := string(models.LifecycleCostSolutionASIS)
	asIsSolution := apimodels.BusinessCaseSolution{
		Cons:               &businessCase.AsIsCons.String,
		CostSavings:        businessCase.AsIsCostSavings.String,
		ID:                 nil,
		LifecycleCostLines: asIsLifecycleCostLines,
		Pros:               &businessCase.AsIsPros.String,
		Summary:            &businessCase.AsIsSummary.String,
		Title:              &businessCase.AsIsTitle.String,
		Type:               &asIs,
	}
	preferred := string(models.LifecycleCostSolutionPREFERRED)
	preferredSolution := apimodels.BusinessCaseSolution{
		Cons:               &businessCase.PreferredCons.String,
		CostSavings:        businessCase.PreferredCostSavings.String,
		ID:                 nil,
		LifecycleCostLines: preferredLifecycleCostLines,
		Pros:               &businessCase.PreferredPros.String,
		Summary:            &businessCase.PreferredSummary.String,
		Title:              &businessCase.PreferredTitle.String,
		Type:               &preferred,
	}
	a := string(models.LifecycleCostSolutionA)
	alternativeA := apimodels.BusinessCaseSolution{
		Cons:               &businessCase.AlternativeACons.String,
		CostSavings:        businessCase.AlternativeACostSavings.String,
		ID:                 nil,
		LifecycleCostLines: alternativeALifecycleCostLines,
		Pros:               &businessCase.AlternativeAPros.String,
		Summary:            &businessCase.AlternativeASummary.String,
		Title:              &businessCase.AlternativeATitle.String,
		Type:               &a,
	}
	b := string(models.LifecycleCostSolutionB)
	alternativeB := apimodels.BusinessCaseSolution{
		Cons:               &businessCase.AlternativeBCons.String,
		CostSavings:        businessCase.AlternativeBCostSavings.String,
		ID:                 nil,
		LifecycleCostLines: alternativeBLifecycleCostLines,
		Pros:               &businessCase.AlternativeBPros.String,
		Summary:            &businessCase.AlternativeBSummary.String,
		Title:              &businessCase.AlternativeBTitle.String,
		Type:               &b,
	}
	apiBusinessCase := apimodels.BusinessCase{
		BusinessNeed:         businessCase.BusinessNeed.String,
		BusinessOwner:        businessCase.BusinessOwner.String,
		CmsBenefit:           businessCase.CMSBenefit.String,
		EuaUserID:            &businessCase.EUAUserID,
		GovernanceID:         &systemIntakeID,
		HostingNeeds:         "",
		ID:                   &id,
		InitialSubmittedAt:   businessCase.InitialSubmittedAt.String(),
		LastSubmittedAt:      businessCase.LastSubmittedAt.String(),
		PriorityAlignment:    businessCase.PriorityAlignment.String,
		ProjectName:          businessCase.ProjectName.String,
		Requester:            businessCase.Requester.String,
		RequesterPhoneNumber: businessCase.RequesterPhoneNumber.String,
		Solutions:            []*apimodels.BusinessCaseSolution{&asIsSolution, &preferredSolution, &alternativeA, &alternativeB},
		Status:               &status,
		SuccessIndicators:    businessCase.SuccessIndicators.String,
		UserInterface:        "",
	}
	params.Body = &apimodels.Intake2{
		BusinessCase: &apiBusinessCase,
	}
	resp, err := c.client.Operations.IntakebusinessCasePOST7(params, c.apiAuthHeader)
	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to submit business case for CEDAR", zap.Error(err))
		return "", &apperrors.ExternalAPIError{
			Err:       err,
			Model:     businessCase,
			ModelID:   id,
			Operation: apperrors.Submit,
			Source:    "CEDAR",
		}
	}
	alfabetID := ""
	if *resp.Payload.Response.Result != "success" {
		return "", &apperrors.ExternalAPIError{
			Err:       errors.New("CEDAR return result: " + *resp.Payload.Response.Result),
			ModelID:   id,
			Model:     businessCase,
			Operation: apperrors.Submit,
			Source:    "CEDAR",
		}
	}
	alfabetID = resp.Payload.Response.Message[0]
	return alfabetID, nil
}
