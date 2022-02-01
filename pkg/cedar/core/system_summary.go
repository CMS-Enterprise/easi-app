package cedarcore

import (
	"context"
	"fmt"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	apisystems "github.com/cmsgov/easi-app/pkg/cedar/core/gen/client/system"
	"github.com/cmsgov/easi-app/pkg/models"
)

const (
	systemSummaryCacheKey = "system-summary-all"
)

// GetSystemSummary makes a GET call to the /system/summary endpoint
// If tryCache is true, it will try and retrieve the data from the cache first and make an API call if the cache is empty
func (c *Client) GetSystemSummary(ctx context.Context, tryCache bool) ([]*models.CedarSystem, error) {
	if !c.cedarCoreEnabled(ctx) {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		return []*models.CedarSystem{}, nil
	}

	// Check and use cache before making API call
	if tryCache {
		cachedSystems, found := c.cache.Get(systemSummaryCacheKey)
		if found {
			return cachedSystems.([]*models.CedarSystem), nil
		}
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
	if !c.cedarCoreEnabled(ctx) {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		return nil
	}

	appcontext.ZLogger(ctx).Info("Refreshing System Summary cache")

	// Get data from API - don't use cache to populate cache!
	systemSummary, err := c.GetSystemSummary(ctx, false)
	if err != nil {
		return err
	}

	appcontext.ZLogger(ctx).Info("Refreshed System Summary cache")

	// Set in cache
	c.cache.SetDefault(systemSummaryCacheKey, systemSummary)

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
