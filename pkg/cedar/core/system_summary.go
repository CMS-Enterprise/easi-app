package cedarcore

import (
	"context"
	"fmt"

	"github.com/guregu/null/zero"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	apisystems "github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/client/system"
	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/local/cedarcoremock"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// GetSystemSummary makes a GET call to the /system/summary endpoint
// If `tryCache` is true and `euaUserID` is nil, we will try to hit the cache. Otherwise, we will make an API call as we cannot filter on EUA on our end
func (c *Client) GetSystemSummary(ctx context.Context, opts ...systemSummaryParamFilterOpt) ([]*models.CedarSystem, error) {
	// Construct the parameters
	params := apisystems.NewSystemSummaryFindListParams()

	// default filters
	params.SetState(helpers.PointerTo("active"))
	params.SetIncludeInSurvey(helpers.PointerTo(true))

	// set additinoal param filters
	for _, opt := range opts {
		if opt != nil {
			opt(params)
		}
	}

	if c.mockEnabled {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")

		// Simulate a filter by only returning a subset of the mock systems
		if params.UserName != nil || params.BelongsTo != nil {
			return cedarcoremock.GetFilteredSystems(), nil
		}
		// nil State should return all systems including inactive/deactivated
		if params.State == nil {
			return cedarcoremock.GetAllSystems(), nil
		}

		// Else return entire set of active systems
		return cedarcoremock.GetActiveSystems(), nil
	}

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
	// hard-coded parameters we have set when we are not filtering.
	// This is defensive programming against this case.
	if len(resp.Payload.SystemSummary) == 0 && len(opts) < 1 {
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
				State:                   zero.StringFrom(sys.State),
				Status:                  zero.StringFrom(sys.Status),
				BusinessOwnerOrg:        zero.StringFrom(sys.BusinessOwnerOrg),
				BusinessOwnerOrgComp:    zero.StringFrom(sys.BusinessOwnerOrgComp),
				SystemMaintainerOrg:     zero.StringFrom(sys.SystemMaintainerOrg),
				SystemMaintainerOrgComp: zero.StringFrom(sys.SystemMaintainerOrgComp),
				ID:                      zero.StringFromPtr(sys.IctObjectID),
				UUID:                    zero.StringFrom(sys.UUID),
			}
			retVal = append(retVal, cedarSys)
		}
	}

	return retVal, nil
}

func PurgeSystemCacheByEUA(ctx context.Context, euaID string) error {
	err := PurgeCacheByPath(ctx, "/system/summary?includeInSurvey=true&state=active&userName="+euaID)
	if err != nil {
		return err
	}
	return nil
}

// GetSystem retrieves a CEDAR system by ID (IctObjectID)
func (c *Client) GetSystem(ctx context.Context, systemID string) (*models.CedarSystem, error) {
	if c.mockEnabled {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		return cedarcoremock.GetSystem(systemID), nil
	}

	systemSummary, err := c.GetSystemSummary(ctx, SystemSummaryOpts.WithDeactivatedSystems())
	if err != nil {
		return nil, err
	}

	systemSummaryMap := make(map[string]*models.CedarSystem)
	for _, sys := range systemSummary {
		if sys != nil {
			systemSummaryMap[sys.ID.String] = sys
		}
	}
	if sys, found := systemSummaryMap[systemID]; found && sys != nil {
		return sys, nil
	}

	return nil, &apperrors.ResourceNotFoundError{Err: fmt.Errorf("no system found"), Resource: models.CedarSystem{}}
}

type systemSummaryParamFilterOpt func(*apisystems.SystemSummaryFindListParams)

type systemSummaryOpts struct{}

// SystemSummaryOpts contains methods for options to pass to system summary calls
var SystemSummaryOpts = systemSummaryOpts{}

// WithDeactivatedSystems returns all systems
func (systemSummaryOpts) WithDeactivatedSystems() systemSummaryParamFilterOpt {
	return func(params *apisystems.SystemSummaryFindListParams) {
		params.SetState(nil)
		params.SetIncludeInSurvey(nil)
	}
}

// WithEuaIDFilter sets given EUA onto the params
func (systemSummaryOpts) WithEuaIDFilter(euaUserID string) systemSummaryParamFilterOpt {
	return func(params *apisystems.SystemSummaryFindListParams) {
		params.SetUserName(&euaUserID)
	}
}

// WithSubSystems sets given cedar system ID as the parent system for which we are looking for sub-systems
func (systemSummaryOpts) WithSubSystems(cedarSystemID string) systemSummaryParamFilterOpt {
	return func(params *apisystems.SystemSummaryFindListParams) {
		params.SetBelongsTo(&cedarSystemID)

		// we want all sub systems, not just ones included in the survey
		// TODO: some systems come back only when `nil` is set and do not come back when `true` or `false` is set - why?
		params.SetIncludeInSurvey(nil)
	}
}
