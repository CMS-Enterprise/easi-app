package cedareasi

import (
	"context"
	"errors"

	"github.com/go-openapi/runtime"
	httptransport "github.com/go-openapi/runtime/client"
	"github.com/go-openapi/strfmt"
	"go.uber.org/zap"
	"gopkg.in/launchdarkly/go-sdk-common.v2/lduser"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	apiclient "github.com/cmsgov/easi-app/pkg/cedar/cedareasi/gen/client"
	apioperations "github.com/cmsgov/easi-app/pkg/cedar/cedareasi/gen/client/operations"
	apimodels "github.com/cmsgov/easi-app/pkg/cedar/cedareasi/gen/models"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/validate"
)

const (
	emitFlagKey = "emit-to-cedar"
	emitDefault = false

	dateTimeLayout = "2006-01-02 15:04:05"
)

// TranslatedClient is an API client for CEDAR EASi using EASi language
type TranslatedClient struct {
	client        *apiclient.EASiCoreAPI
	apiAuthHeader runtime.ClientAuthInfoWriter
	emitToCedar   func(context.Context) bool
}

// Client is an interface to ease testing dependencies
type Client interface {
	CheckConnection(context.Context) error
	ValidateAndSubmitSystemIntake(context.Context, *models.SystemIntake) (string, error)
}

// NewTranslatedClient returns an API client for CEDAR EASi using EASi language
func NewTranslatedClient(cedarHost string, cedarAPIKey string, ldClient *ld.LDClient, ldUser lduser.User) TranslatedClient {
	// create the transport
	transport := httptransport.New(cedarHost, apiclient.DefaultBasePath, []string{"https"})

	// create the API client, with the transport
	client := apiclient.New(transport, strfmt.Default)

	// Set auth header
	apiKeyHeaderAuth := httptransport.APIKeyAuth("x-Gateway-APIKey", "header", cedarAPIKey)

	fnEmit := func(ctx context.Context) bool {
		// this is the conditional way of stopping us from submitting to CEDAR; see EASI-1025
		// TODO: if we were using per-user targeting, we would use the context Principle to fetch/build
		// the LD User; but currently we are not using that feature, so we use a common "static" User
		// object
		result, err := ldClient.BoolVariation(emitFlagKey, ldUser, emitDefault)
		if err != nil {
			appcontext.ZLogger(ctx).Info(
				"problem evaluating feature flag",
				zap.Error(err),
				zap.String("flagName", emitFlagKey),
				zap.Bool("flagDefault", emitDefault),
				zap.Bool("flagResult", result),
			)
		}
		return result
	}

	return TranslatedClient{client, apiKeyHeaderAuth, fnEmit}
}

// CheckConnection tries to verify if we are able to communicate with the CEDAR API
func (c TranslatedClient) CheckConnection(ctx context.Context) error {
	_, err := c.client.Operations.HealthCheckGET1(
		apioperations.NewHealthCheckGET1ParamsWithContext(ctx),
		c.apiAuthHeader)
	return err
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
	if validate.RequireString(intake.EUAUserID.ValueOrZero()) {
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
		if validate.RequireNullString(intake.FundingNumber) {
			expectedError.WithValidation("FundingNumber", validationMessage)
		}
		if intake.FundingNumber.Valid && validate.FundingNumberInvalid(intake.FundingNumber.String) {
			expectedError.WithValidation("FundingNumber", "must be a 6 digit string")
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
	// TODO: CEDAR isn't aware of these fields yet, so I'm commenting these out
	// if validate.RequireNullString(intake.CostIncrease) {
	// 	expectedError.WithValidation("CostIncrease", validationMessage)
	// }
	// if intake.CostIncrease.String == "YES" {
	// 	if validate.RequireNullString(intake.CostIncreaseAmount) {
	// 		expectedError.WithValidation("CostIncreaseAmount", validationMessage)
	// 	}
	// }
	if len(expectedError.Validations) > 0 {
		return &expectedError
	}
	return nil
}

func systemIntakeToGovernanceIntake(si *models.SystemIntake) *apimodels.GovernanceIntake {
	id := si.ID.String()
	gi := &apimodels.GovernanceIntake{
		BusinessNeeds:           si.BusinessNeed.ValueOrZero(),
		BusinessOwner:           si.BusinessOwner.ValueOrZero(),
		BusinessOwnerComponent:  si.BusinessOwnerComponent.ValueOrZero(),
		EaCollaborator:          si.EACollaborator.ValueOrZero(),
		EaSupportRequest:        si.EASupportRequest.ValueOrZero(),
		EuaUserID:               si.EUAUserID.Ptr(),
		ExistingContract:        si.ExistingContract.ValueOrZero(),
		ExistingFunding:         si.ExistingFunding.ValueOrZero(),
		FundingSource:           si.FundingSource.ValueOrZero(),
		ID:                      &id,
		Isso:                    si.ISSO.ValueOrZero(),
		OitSecurityCollaborator: si.OITSecurityCollaborator.ValueOrZero(),
		ProcessStatus:           si.ProcessStatus.ValueOrZero(),
		ProductManager:          si.ProductManager.ValueOrZero(),
		ProductManagerComponent: si.ProductManagerComponent.ValueOrZero(),
		Requester:               si.Requester,
		RequesterComponent:      si.Component.ValueOrZero(),
		Solution:                si.Solution.ValueOrZero(),
		SystemName:              si.ProjectName.ValueOrZero(),
		TrbCollaborator:         si.TRBCollaborator.ValueOrZero(),
	}
	if si.SubmittedAt != nil {
		gi.SubmittedAt = si.SubmittedAt.Format(dateTimeLayout)
	}
	if si.DecidedAt != nil {
		gi.DecidedAt = si.DecidedAt.Format(dateTimeLayout)
	}
	if si.ArchivedAt != nil {
		gi.WithdrawnAt = si.ArchivedAt.Format(dateTimeLayout)
	}
	return gi
}

func submitSystemIntake(ctx context.Context, validatedIntake *models.SystemIntake, c TranslatedClient) (string, error) {
	params := apioperations.NewIntakegovernancePOST5ParamsWithContext(ctx)
	params.Body = &apimodels.Intake{
		Governance: systemIntakeToGovernanceIntake(validatedIntake),
	}
	resp, err := c.client.Operations.IntakegovernancePOST5(params, c.apiAuthHeader)
	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to submit intake for CEDAR", zap.Error(err))
		return "", &apperrors.ExternalAPIError{
			Err:       err,
			Model:     validatedIntake,
			ModelID:   validatedIntake.ID.String(),
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
	// we may not be sending SystemIntakes to CEDAR currently
	if !c.emitToCedar(ctx) {
		return "", nil
	}
	alfabetID, err := submitSystemIntake(ctx, intake, c)
	if err != nil {
		return "", err
	}
	// if we are submitting to CEDAR, we expect a non-empty value back
	if alfabetID == "" {
		return "", &apperrors.ExternalAPIError{
			Err:       errors.New("submission was not successful"),
			Model:     intake,
			ModelID:   intake.ID.String(),
			Operation: apperrors.Submit,
			Source:    "CEDAR EASi",
		}
	}
	return alfabetID, nil
}
