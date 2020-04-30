package cedar

import (
	"errors"
	"fmt"
	"reflect"
	"strings"
	"time"

	"github.com/go-openapi/runtime"
	httptransport "github.com/go-openapi/runtime/client"
	"github.com/go-openapi/strfmt"
	"github.com/google/uuid"
	"github.com/guregu/null"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/apperrors"
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

type cedarIntake map[string]bool

func requiredFields() cedarIntake {
	return cedarIntake{
		"ID":                      true,
		"EUAUserID":               true,
		"Status":                  true,
		"Requester":               true,
		"Component":               true,
		"BusinessOwner":           true,
		"BusinessOwnerComponent":  true,
		"ProductManager":          true,
		"ProductManagerComponent": true,
		"ISSO":                    false,
		"TRBCollaborator":         false,
		"OITSecurityCollaborator": false,
		"EACollaborator":          false,
		"ProjectName":             true,
		"ExistingFunding":         true,
		"FundingNumber":           false,
		"FundingSource":           false,
		"BusinessNeed":            true,
		"Solution":                true,
		"EASupportRequest":        true,
		"ProcessStatus":           true,
		"ExistingContract":        true,
		"UpdatedAt":               true,
		"SubmittedAt":             true,
	}
}

func validateSystemIntakeForCedar(intake *models.SystemIntake, logger *zap.Logger) error {
	var res []string
	v := reflect.ValueOf(*intake)
	requiredFields := requiredFields()
	for i := 0; i < v.NumField(); i++ {
		if requiredFields[v.Type().Field(i).Name] {
			switch v.Field(i).Interface().(type) {
			case uuid.UUID:
				if v.Field(i).Interface().(uuid.UUID) == uuid.Nil {
					res = append(res, v.Type().Field(i).Name)
				}
			case string:
				if v.Field(i).Interface().(string) == "" {
					res = append(res, v.Type().Field(i).Name)
				}
			case null.String:
				if !v.Field(i).Interface().(null.String).Valid {
					res = append(res, v.Type().Field(i).Name)
				}
			case null.Bool:
				if !v.Field(i).Interface().(null.Bool).Valid {
					res = append(res, v.Type().Field(i).Name)
				}
			case time.Time:
				if v.Field(i).Interface().(time.Time).IsZero() {
					res = append(res, v.Type().Field(i).Name)
				}
			default:
				break
			}
		}
	}
	if len(res) != 0 {
		invalidFields := strings.Join(res, " ")
		return errors.New("Validation failed on these fields: " + invalidFields)
	}
	return nil
}

// SubmitSystemIntake submits a system intake to CEDAR
func (c TranslatedClient) SubmitSystemIntake(intake *models.SystemIntake, logger *zap.Logger) (string, error) {
	err := validateSystemIntakeForCedar(intake, logger)
	if err != nil {
		return "", &apperrors.CedarError{
			Err:       err,
			IntakeID:  intake.ID.String(),
			Operation: apperrors.CedarValidate,
		}
	}
	id := intake.ID.String()
	submissionTime := intake.UpdatedAt.String()
	params := apioperations.NewIntakegovernancePOST4Params()
	governanceIntake := apimodels.GovernanceIntake{
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
	}
	governanceConversion := []*apimodels.GovernanceIntake{
		&governanceIntake,
	}
	params.Body = &apimodels.Intake{
		Governance: governanceConversion,
	}
	resp, err := c.client.Operations.IntakegovernancePOST4(params, c.apiAuthHeader)
	if err != nil {
		logger.Error(fmt.Sprintf("Failed to submit intake for CEDAR with error: %v", err))
		return "", err
	}
	alfabetID := ""
	if *resp.Payload.Response.Result != "success" {
		return "", &apperrors.CedarError{
			Err:       errors.New("CEDAR return result: " + *resp.Payload.Response.Result),
			IntakeID:  intake.ID.String(),
			Operation: apperrors.CedarSubmit,
		}
	}
	alfabetID = resp.Payload.Response.Message[0]
	return alfabetID, nil
}
