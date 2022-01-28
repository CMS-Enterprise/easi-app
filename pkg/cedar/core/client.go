package cedarcore

import (
	"context"
	"fmt"
	"net/http"
	"time"

	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/go-openapi/runtime"
	httptransport "github.com/go-openapi/runtime/client"
	"github.com/go-openapi/strfmt"
	"github.com/guregu/null"
	"github.com/guregu/null/zero"
	cache "github.com/patrickmn/go-cache"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	apiclient "github.com/cmsgov/easi-app/pkg/cedar/core/gen/client"
	apideployments "github.com/cmsgov/easi-app/pkg/cedar/core/gen/client/deployment"
	apiroles "github.com/cmsgov/easi-app/pkg/cedar/core/gen/client/role"
	apisystems "github.com/cmsgov/easi-app/pkg/cedar/core/gen/client/system"
	"github.com/cmsgov/easi-app/pkg/flags"
	"github.com/cmsgov/easi-app/pkg/models"
)

const (
	cedarCoreEnabledKey     = "cedarCoreEnabled"
	cedarCoreEnabledDefault = false
	allSystemsCacheKey      = "allSystems"
	cedarRoleApplication    = "alfabet" // used for queries to GET /role endpoint
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

	c := cache.New(-1, -1) // -1, -1 means no expiration, no cleanup. This is all handled by the Ticker.

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
		hc:    hc,
		cache: c,
	}
}

// Client represents a connection to the CEDAR Core API
type Client struct {
	cedarCoreEnabled func(context.Context) bool
	auth             runtime.ClientAuthInfoWriter
	sdk              *apiclient.CEDARCoreAPI
	hc               *http.Client
	cache            *cache.Cache
}

// StartCacheRefresh does the following two things
// 1. Immediately attempts to populate the cache with current System Summary response data
// 2. Starts a goroutine that will periodically refresh the cache with new data, based on cacheRefreshTime
//
// This function returns no errors, and only logs when something goes wrong
func (c *Client) StartCacheRefresh(ctx context.Context, cacheRefreshTime time.Duration) {
	initialErr := c.populateSystemSummaryCache(ctx)
	if initialErr != nil {
		appcontext.ZLogger(ctx).Error("Failed to refresh CEDAR Core cache", zap.Error(initialErr))
	}
	ticker := time.NewTicker(cacheRefreshTime)
	go func() {
		for {
			<-ticker.C
			fmt.Println("LETS GET THAT CACHE", time.Now())
			err := c.populateSystemSummaryCache(ctx)
			if err != nil {
				appcontext.ZLogger(ctx).Error("Failed to refresh CEDAR Core cache", zap.Error(err))
			}
		}
	}()
}

// GetSystemSummary makes a GET call to the /system/summary endpoint
func (c *Client) GetSystemSummary(ctx context.Context) ([]*models.CedarSystem, error) {
	if !c.cedarCoreEnabled(ctx) {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		return []*models.CedarSystem{}, nil
	}

	// Check and use cache before making API call
	cachedSystems, found := c.cache.Get(allSystemsCacheKey)
	if found {
		return cachedSystems.([]*models.CedarSystem), nil
	}

	// No item in the cache - make the API call as usual

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

// populateSystemSummaryCache is a method used internally by the CEDAR Core client
// to populate the in-memory cache with the results of a call to the /system/summary endpoint
//
// It does not return anything from the cache, nor does it return anything at all (unless an error occurs)
func (c *Client) populateSystemSummaryCache(ctx context.Context) error {
	appcontext.ZLogger(ctx).Info("Refreshing CEDAR Core cache")
	if !c.cedarCoreEnabled(ctx) {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		return nil
	}

	// Fallback to main API
	systemSummary, err := c.GetSystemSummary(ctx)
	if err != nil {
		return err
	}

	// Set in cache
	c.cache.Set(allSystemsCacheKey, systemSummary, cache.DefaultExpiration)

	return nil
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

// GetDeploymentsOptionalParams represents the optional parameters that can be used to filter deployments when searching through the CEDAR API
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

	// Populate the Deployment field by converting each item in resp.Payload.Deployments
	// generated swagger client turns JSON nulls into Go zero values, so use null/zero package to convert them back to nullable values
	for _, deployment := range resp.Payload.Deployments {
		if deployment.ID == nil {
			appcontext.ZLogger(ctx).Error("Error decoding deployment; deployment ID was null", zap.String("systemID", systemID))
			continue
		}

		if deployment.Name == nil {
			appcontext.ZLogger(ctx).Error("Error decoding deployment; deployment name was null", zap.String("systemID", systemID))
			continue
		}

		if deployment.SystemID == nil {
			appcontext.ZLogger(ctx).Error("Error decoding deployment; deployment system ID was null", zap.String("systemID", systemID))
			continue
		}

		retDeployment := &models.CedarDeployment{
			ID:                *deployment.ID,
			Name:              *deployment.Name,
			SystemID:          *deployment.SystemID,
			StartDate:         zero.TimeFrom(time.Time(deployment.StartDate)),
			EndDate:           zero.TimeFrom(time.Time(deployment.EndDate)),
			IsHotSite:         zero.StringFrom(deployment.IsHotSite),
			Description:       zero.StringFrom(deployment.Description),
			ContractorName:    zero.StringFrom(deployment.ContractorName),
			SystemVersion:     zero.StringFrom(deployment.ContractorName),
			HasProductionData: zero.StringFrom(deployment.HasProductionData),

			// TODO - assumes no nulls in array returned from query
			ReplicatedSystemElements: deployment.ReplicatedSystemElements,

			DeploymentType:      zero.StringFrom(deployment.DeploymentType),
			SystemName:          zero.StringFrom(deployment.SystemName),
			DeploymentElementID: zero.StringFrom(deployment.DeploymentElementID),
			State:               zero.StringFrom(deployment.State),
			Status:              zero.StringFrom(deployment.Status),
			WanType:             zero.StringFrom(deployment.WanType),
		}

		if deployment.DataCenter != nil {
			retDataCenter := &models.CedarDataCenter{
				ID:           zero.StringFrom(deployment.DataCenter.ID),
				Name:         zero.StringFrom(deployment.DataCenter.Name),
				Version:      zero.StringFrom(deployment.DataCenter.Version),
				Description:  zero.StringFrom(deployment.DataCenter.Description),
				State:        zero.StringFrom(deployment.DataCenter.State),
				Status:       zero.StringFrom(deployment.DataCenter.Status),
				StartDate:    zero.TimeFrom(time.Time(deployment.DataCenter.StartDate)),
				EndDate:      zero.TimeFrom(time.Time(deployment.DataCenter.EndDate)),
				Address1:     zero.StringFrom(deployment.DataCenter.Address1),
				Address2:     zero.StringFrom(deployment.DataCenter.Address2),
				City:         zero.StringFrom(deployment.DataCenter.City),
				AddressState: zero.StringFrom(deployment.DataCenter.AddressState),
				Zip:          zero.StringFrom(deployment.DataCenter.Zip),
			}
			retDeployment.DataCenter = retDataCenter
		}

		retVal = append(retVal, retDeployment)
	}

	return retVal, nil
}

// GetRolesBySystem makes a GET call to the /role endpoint using a system ID and an optional role type ID
// we don't currently have a use case for querying /role by role ID, so that's not implemented
func (c *Client) GetRolesBySystem(ctx context.Context, systemID string, roleTypeID null.String) ([]*models.CedarRole, error) {
	if !c.cedarCoreEnabled(ctx) {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		return []*models.CedarRole{}, nil
	}

	// Construct the parameters
	params := apiroles.NewRoleFindByIDParams()
	params.SetApplication(cedarRoleApplication)
	params.SetObjectID(&systemID)
	params.HTTPClient = c.hc

	if roleTypeID.Ptr() != nil {
		params.SetRoleTypeID(roleTypeID.Ptr())
	}

	// Make the API call
	resp, err := c.sdk.Role.RoleFindByID(params, c.auth)
	if err != nil {
		return []*models.CedarRole{}, err
	}

	if resp.Payload == nil {
		return []*models.CedarRole{}, fmt.Errorf("no body received")
	}

	if len(resp.Payload.Roles) == 0 {
		return nil, &apperrors.ResourceNotFoundError{Err: fmt.Errorf("no roles found"), Resource: []*models.CedarRole{}}
	}

	// Convert the auto-generated struct to our own pkg/models struct
	retVal := []*models.CedarRole{}

	for _, role := range resp.Payload.Roles {
		if role.Application == nil {
			appcontext.ZLogger(ctx).Error("Error decoding role; role Application was null", zap.String("systemID", systemID))
			continue
		}

		if role.ObjectID == nil {
			appcontext.ZLogger(ctx).Error("Error decoding role; role ObjectID was null", zap.String("systemID", systemID))
			continue
		}

		if role.RoleTypeID == nil {
			appcontext.ZLogger(ctx).Error("Error decoding role; role type ID was null", zap.String("systemID", systemID))
			continue
		}

		var retAssigneeType models.CedarAssigneeType

		if role.AssigneeType == string(models.PersonAssignee) {
			retAssigneeType = models.PersonAssignee
		} else if role.AssigneeType == string(models.OrganizationAssignee) {
			retAssigneeType = models.OrganizationAssignee
		} else if role.AssigneeType == "" {
			retAssigneeType = ""
		} else {
			appcontext.ZLogger(ctx).Error("Error decoding role; role assignee type didn't match possible values from Swagger", zap.String("systemID", systemID))
			continue
		}

		// generated swagger client turns JSON nulls into Go zero values, so use null/zero package to convert them back to nullable values
		retRole := &models.CedarRole{
			Application: *role.Application,
			ObjectID:    *role.ObjectID,
			RoleTypeID:  *role.RoleTypeID,

			AssigneeUsername:  zero.StringFrom(role.AssigneeUserName),
			AssigneeEmail:     zero.StringFrom(role.AssigneeEmail),
			AssigneeOrgID:     zero.StringFrom(role.AssigneeOrgID),
			AssigneeOrgName:   zero.StringFrom(role.AssigneeOrgName),
			AssigneeFirstName: zero.StringFrom(role.AssigneeFirstName),
			AssigneeLastName:  zero.StringFrom(role.AssigneeLastName),
			AssigneePhone:     zero.StringFrom(role.AssigneePhone),
			AssigneeDesc:      zero.StringFrom(role.AssigneeDesc),

			RoleTypeName: zero.StringFrom(role.RoleTypeName),
			RoleTypeDesc: zero.StringFrom(role.RoleTypeDesc),
			RoleID:       zero.StringFrom(role.RoleID),
			ObjectType:   zero.StringFrom(role.ObjectType),
		}

		if retAssigneeType != "" {
			retRole.AssigneeType = &retAssigneeType
		}

		retVal = append(retVal, retRole)
	}

	return retVal, nil
}
