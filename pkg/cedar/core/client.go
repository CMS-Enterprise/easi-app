package cedarcore

import (
	"context"
	"fmt"
	"net/http"

	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/go-openapi/runtime"
	httptransport "github.com/go-openapi/runtime/client"
	"github.com/go-openapi/strfmt"
	"github.com/guregu/null"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	apiclient "github.com/cmsgov/easi-app/pkg/cedar/core/gen/client"
	apideployments "github.com/cmsgov/easi-app/pkg/cedar/core/gen/client/deployment"
	apisystems "github.com/cmsgov/easi-app/pkg/cedar/core/gen/client/system"
	"github.com/cmsgov/easi-app/pkg/flags"
	"github.com/cmsgov/easi-app/pkg/models"
)

const (
	cedarCoreEnabledKey     = "cedarCoreEnabled"
	cedarCoreEnabledDefault = false
)

// NewClient builds the type that holds a connection to the CEDAR Core API
func NewClient(cedarHost string, cedarAPIKey string, ldClient *ld.LDClient) *Client {
	fnEmit := func(ctx context.Context) bool {
		lduser := flags.Principal(ctx)
		result, err := ldClient.BoolVariation(cedarCoreEnabledKey, lduser, cedarCoreEnabledDefault)
		if err != nil {
			appcontext.ZLogger(ctx).Info(
				"problem evaluating feature flag",
				zap.Error(err),
				zap.String("flagName", cedarCoreEnabledKey),
				zap.Bool("flagDefault", cedarCoreEnabledDefault),
				zap.Bool("flagResult", result),
			)
		}
		return result
	}

	hc := http.DefaultClient

	return &Client{
		cedarCoreEnabled: fnEmit,
		auth: httptransport.APIKeyAuth(
			"x-Gateway-APIKey",
			"header",
			cedarAPIKey,
		),
		sdk: apiclient.New(
			httptransport.New(
				cedarHost,
				apiclient.DefaultBasePath,
				apiclient.DefaultSchemes,
			),
			strfmt.Default,
		),
		hc: hc,
	}
}

// Client represents a connection to the CEDAR Core API
type Client struct {
	cedarCoreEnabled func(context.Context) bool
	auth             runtime.ClientAuthInfoWriter
	sdk              *apiclient.CEDARCoreAPI
	hc               *http.Client
}

// GetSystemSummary makes a GET call to the /system/summary endpoint
func (c *Client) GetSystemSummary(ctx context.Context) ([]*models.CedarSystem, error) {
	if !c.cedarCoreEnabled(ctx) {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		return []*models.CedarSystem{}, nil
	}

	// Construct the parameters
	params := apisystems.NewSystemSummaryFindListParams()
	params.HTTPClient = c.hc

	// Make the API call
	resp, err := c.sdk.System.SystemSummaryFindList(params, c.auth)
	if err != nil {
		return []*models.CedarSystem{}, err
	}

	if resp.Payload == nil {
		return []*models.CedarSystem{}, fmt.Errorf("no body received")
	}

	// Convert the auto-generated struct to our own pkg/models struct
	retVal := []*models.CedarSystem{}

	// Populate the SystemSummary field by converting each item in resp.Payload.SystemSummary
	for _, sys := range resp.Payload.SystemSummary {
		retVal = append(retVal, &models.CedarSystem{
			ID:                      *sys.ID,
			Name:                    *sys.Name,
			Description:             sys.Description,
			Acronym:                 sys.Acronym,
			Status:                  sys.Status,
			BusinessOwnerOrg:        sys.BusinessOwnerOrg,
			BusinessOwnerOrgComp:    sys.BusinessOwnerOrgComp,
			SystemMaintainerOrg:     sys.SystemMaintainerOrg,
			SystemMaintainerOrgComp: sys.SystemMaintainerOrgComp,
		})
	}

	return retVal, nil
}

// GetSystem makes a GET call to the /system/summary/{id} endpoint
func (c *Client) GetSystem(ctx context.Context, id string) (*models.CedarSystem, error) {
	if !c.cedarCoreEnabled(ctx) {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		return &models.CedarSystem{}, nil
	}

	// Construct the parameters
	params := apisystems.NewSystemSummaryFindByIDParams()
	params.SetID(id)
	params.HTTPClient = c.hc

	// Make the API call
	resp, err := c.sdk.System.SystemSummaryFindByID(params, c.auth)
	if err != nil {
		return &models.CedarSystem{}, err
	}

	if resp.Payload == nil {
		return &models.CedarSystem{}, fmt.Errorf("no body received")
	}

	responseArray := resp.Payload.SystemSummary

	if len(responseArray) == 0 {
		return nil, &apperrors.ResourceNotFoundError{Err: fmt.Errorf("no system found"), Resource: models.CedarSystem{}}
	}

	// Convert the auto-generated struct to our own pkg/models struct
	return &models.CedarSystem{
		ID:                      *responseArray[0].ID,
		Name:                    *responseArray[0].Name,
		Description:             responseArray[0].Description,
		Acronym:                 responseArray[0].Acronym,
		Status:                  responseArray[0].Status,
		BusinessOwnerOrg:        responseArray[0].BusinessOwnerOrg,
		BusinessOwnerOrgComp:    responseArray[0].BusinessOwnerOrgComp,
		SystemMaintainerOrg:     responseArray[0].SystemMaintainerOrg,
		SystemMaintainerOrgComp: responseArray[0].SystemMaintainerOrgComp,
	}, nil
}

// GetDeploymentsOptionalParams represents the optional parameters that can be used to filter deployments
// when searching through the CEDAR API
// TODO - is this how we want to handle multiple optional parameters?
type GetDeploymentsOptionalParams struct {
	DeploymentType null.String
	State          null.String
	Status         null.String
}

// GetDeployments makes a GET call to the /deployment endpoint
func (c *Client) GetDeployments(ctx context.Context, systemID string, optionalParams *GetDeploymentsOptionalParams) ([]*models.CedarDeployment, error) {
	if !c.cedarCoreEnabled(ctx) {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		return []*models.CedarDeployment{}, nil
	}

	// Construct the parameters
	params := apideployments.NewDeploymentFindListParams()
	params.SetSystemID(systemID)
	params.HTTPClient = c.hc

	if optionalParams != nil {
		if optionalParams.DeploymentType.Ptr() != nil {
			params.SetDeploymentType(optionalParams.DeploymentType.Ptr())
		}

		if optionalParams.State.Ptr() != nil {
			params.SetState(optionalParams.State.Ptr())
		}

		if optionalParams.Status.Ptr() != nil {
			params.SetStatus(optionalParams.Status.Ptr())
		}
	}

	// Make the API call
	resp, err := c.sdk.Deployment.DeploymentFindList(params, c.auth)
	if err != nil {
		return []*models.CedarDeployment{}, err
	}

	if resp.Payload == nil {
		return []*models.CedarDeployment{}, fmt.Errorf("no body received")
	}

	responseArray := resp.Payload.Deployments

	if len(responseArray) == 0 {
		return nil, &apperrors.ResourceNotFoundError{Err: fmt.Errorf("no deployments found"), Resource: []*models.CedarDeployment{}}
	}

	// Convert the auto-generated struct to our own pkg/models struct
	retVal := []*models.CedarDeployment{}

	// Populate the Deployment field by converting each item in resp.Payload.Depliyments
	for _, deployment := range resp.Payload.Deployments {
		retDeployment := &models.CedarDeployment{
			ID:       *deployment.ID,
			Name:     *deployment.Name,
			SystemID: *deployment.SystemID,
			// IsHotSite: deployment.IsHotSite,
		}

		// TODO - generated client translates JSON nulls into Golang empty values

		if deployment.StartDate == (strfmt.Date{}) {
			retDeployment.StartDate = nil
		} else {
			retDeployment.StartDate = &deployment.StartDate
		}

		if deployment.EndDate == (strfmt.Date{}) {
			retDeployment.EndDate = nil
		} else {
			retDeployment.EndDate = &deployment.EndDate
		}

		retVal = append(retVal, retDeployment)
	}

	return retVal, nil
}
