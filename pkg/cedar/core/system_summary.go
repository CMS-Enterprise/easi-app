package cedarcore

import (
	"context"
	"fmt"

	"github.com/guregu/null/zero"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	apisystems "github.com/cmsgov/easi-app/pkg/cedar/core/gen/client/system"
	"github.com/cmsgov/easi-app/pkg/helpers"
	"github.com/cmsgov/easi-app/pkg/local/cedarcoremock"
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
// If `tryCache` is true and `euaUserID` is nil, we will try to hit the cache. Otherwise, we will make an API call as we cannot filter on EUA on our end
func (c *Client) GetSystemSummary(ctx context.Context, tryCache bool, euaUserID *string) ([]*models.CedarSystem, error) {
	if c.mockEnabled {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")

		// Simulate a filter by only returning a subset of the mock systems
		if euaUserID != nil {
			return cedarcoremock.GetFilteredSystems(), nil
		}

		// Else return entire set
		return cedarcoremock.GetSystems(), nil
	}

	// Check and use cache before making API call if `tryCache` is true and there is no `euaUserID` filter
	if tryCache && euaUserID == nil {
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
	params.SetState(helpers.PointerTo("active"))
	params.SetIncludeInSurvey(helpers.PointerTo(true))

	params.SetUserName(euaUserID)
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
	// hard-coded parameters we have set when we are not filtering by EUA.
	// This is defensive programming against this case.
	if len(resp.Payload.SystemSummary) == 0 && euaUserID == nil {
		return []*models.CedarSystem{}, fmt.Errorf("empty response array received")
	}

	// Convert the auto-generated struct to our own pkg/models struct
	retVal := []*models.CedarSystem{}
	// Populate the SystemSummary field by converting each item in resp.Payload.SystemSummary
	for _, sys := range resp.Payload.SystemSummary {
		if sys.IctObjectID != nil {
			cedarSys := &models.CedarSystem{
				VersionID:               zero.StringFromPtr(sys.ID),
				Name:                    zero.StringFromPtr(sys.Name),
				Description:             zero.StringFrom(sys.Description),
				Acronym:                 zero.StringFrom(sys.Acronym),
				Status:                  zero.StringFrom(sys.Status),
				BusinessOwnerOrg:        zero.StringFrom(sys.BusinessOwnerOrg),
				BusinessOwnerOrgComp:    zero.StringFrom(sys.BusinessOwnerOrgComp),
				SystemMaintainerOrg:     zero.StringFrom(sys.SystemMaintainerOrg),
				SystemMaintainerOrgComp: zero.StringFrom(sys.SystemMaintainerOrgComp),
				ID:                      zero.StringFromPtr(sys.IctObjectID),
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
	if c.mockEnabled {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		return nil
	}

	appcontext.ZLogger(ctx).Info("Refreshing System Summary cache")

	// Get data from API - don't use cache to populate cache!
	systemSummary, err := c.GetSystemSummary(ctx, false, nil)
	if err != nil {
		return err
	}

	systemSummaryMap := make(map[string]*models.CedarSystem)
	for _, sys := range systemSummary {
		if sys != nil {
			systemSummaryMap[sys.ID.String] = sys
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
	if c.mockEnabled {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		return cedarcoremock.GetSystem(systemID), nil
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
