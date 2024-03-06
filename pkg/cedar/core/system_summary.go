package cedarcore

import (
	"context"
	"fmt"

	"github.com/guregu/null"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	apisystems "github.com/cmsgov/easi-app/pkg/cedar/core/gen/client/system"
	"github.com/cmsgov/easi-app/pkg/models"
)

const (
	systemSummaryCacheKey = "system-summary-all"
)

func (c *Client) getCachedSystemMap(ctx context.Context) map[string]*models.CedarSystem {
	cachedStruct, found := c.cache.Get(systemSummaryCacheKey)
	if found {
		cachedSystemMap := cachedStruct.(map[string]*models.CedarSystem)
		return cachedSystemMap
	}
	return nil
}

// GetSystemSummary makes a GET call to the /system/summary endpoint
// If tryCache is true, it will try and retrieve the data from the cache first and make an API call if the cache is empty
func (c *Client) GetSystemSummary(ctx context.Context, filter *models.CedarSystemFilterInput) ([]*models.CedarSystem, error) {
	if !c.cedarCoreEnabled(ctx) {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		return getMockSystems()
	}

	// Check and use cache before making API call if there are no search filters
	if !filter.Empty() {
		cachedSystemMap := c.getCachedSystemMap(ctx)
		if cachedSystemMap != nil {
			cachedSystems := make([]*models.CedarSystem, len(cachedSystemMap))

			i := 0
			for _, sys := range cachedSystemMap {
				cachedSystems[i] = sys
				i++
			}

			return cachedSystems, nil
		}
	}

	// No item in the cache - make the API call as usual

	// Construct the parameters
	params := apisystems.NewSystemSummaryFindListParams()
	params.SetState(null.StringFrom("active").Ptr())
	params.SetIncludeInSurvey(null.BoolFrom(true).Ptr())

	params.SetUserName(&filter.EuaUserID)
	// as we add more filters, we can set them here

	params.HTTPClient = c.hc

	// Make the API call
	resp, err := c.sdk.System.SystemSummaryFindList(params, c.auth)
	if err != nil {
		return []*models.CedarSystem{}, err
	}

	if resp.Payload == nil {
		return []*models.CedarSystem{}, fmt.Errorf("no body received")
	}

	// This may look like an odd block of code, but should never expect an empty response from CEDAR with the
	// hard-coded parameters we have set.
	// This is defensive programming against this case.
	if len(resp.Payload.SystemSummary) == 0 {
		return []*models.CedarSystem{}, fmt.Errorf("empty response array received")
	}

	// Convert the auto-generated struct to our own pkg/models struct
	retVal := []*models.CedarSystem{}
	// Populate the SystemSummary field by converting each item in resp.Payload.SystemSummary
	for _, sys := range resp.Payload.SystemSummary {
		if sys.IctObjectID != nil {
			cedarSys := &models.CedarSystem{
				VersionID:               *sys.ID,
				Name:                    *sys.Name,
				Description:             sys.Description,
				Acronym:                 sys.Acronym,
				Status:                  sys.Status,
				BusinessOwnerOrg:        sys.BusinessOwnerOrg,
				BusinessOwnerOrgComp:    sys.BusinessOwnerOrgComp,
				SystemMaintainerOrg:     sys.SystemMaintainerOrg,
				SystemMaintainerOrgComp: sys.SystemMaintainerOrgComp,
				ID:                      *sys.IctObjectID,
			}
			retVal = append(retVal, cedarSys)
		}
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
	systemSummary, err := c.GetSystemSummary(ctx, nil)
	if err != nil {
		return err
	}

	systemSummaryMap := make(map[string]*models.CedarSystem)
	for _, sys := range systemSummary {
		if sys != nil {
			systemSummaryMap[sys.ID] = sys
		}
	}

	// Set in cache
	c.cache.SetDefault(systemSummaryCacheKey, systemSummaryMap)

	appcontext.ZLogger(ctx).Info("Refreshed System Summary cache")

	return nil
}

func (c *Client) getSystemFromCache(ctx context.Context, systemID string) *models.CedarSystem {
	// Check if the system ID is cached in the map
	cachedSystemMap := c.getCachedSystemMap(ctx)
	if sys, found := cachedSystemMap[systemID]; found && sys != nil {
		return sys
	}
	return nil
}

// GetSystem retrieves a CEDAR system by ID (IctObjectID), by first checking the cache, then
// if it is not found, repopulating the cache and checking one more time.
func (c *Client) GetSystem(ctx context.Context, systemID string) (*models.CedarSystem, error) {
	if !c.cedarCoreEnabled(ctx) {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		return getMockSystem(systemID)
	}

	// Try the cache first
	cachedSystem := c.getSystemFromCache(ctx, systemID)
	if cachedSystem != nil {
		return cachedSystem, nil
	}

	// If it's not cached, populate the cache, and try the cache again
	err := c.populateSystemSummaryCache(ctx)
	if err != nil {
		return nil, err
	}

	// Try the cache again now that we know it is fresh
	cachedSystem = c.getSystemFromCache(ctx, systemID)
	if cachedSystem != nil {
		return cachedSystem, nil
	}

	// If we still haven't found it after repopulating the cache, then it doesn't exist in CEDAR
	return nil, &apperrors.ResourceNotFoundError{Err: fmt.Errorf("no system found"), Resource: models.CedarSystem{}}
}
