package cedarcore

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/guregu/null/zero"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	apisystems "github.com/cmsgov/easi-app/pkg/cedar/core/gen/client/system"
	"github.com/cmsgov/easi-app/pkg/helpers"
	"github.com/cmsgov/easi-app/pkg/local/cedarcoremock"
	"github.com/cmsgov/easi-app/pkg/models"
)

// GetSystemSummary makes a GET call to the /system/summary endpoint
// If `tryCache` is true and `euaUserID` is nil, we will try to hit the cache. Otherwise, we will make an API call as we cannot filter on EUA on our end
func (c *Client) GetSystemSummary(ctx context.Context, opts ...systemSummaryParamFilterOpt) ([]*models.CedarSystem, error) {
	if c.mockEnabled {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")

		// Simulate a filter by only returning a subset of the mock systems
		if len(opts) > 0 {
			return cedarcoremock.GetFilteredSystems(), nil
		}

		// Else return entire set
		return cedarcoremock.GetSystems(), nil
	}

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
			uuid, _ := uuid.Parse(sys.UUID)

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
				UUID:                    zero.StringFrom(uuid.String()),
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

	systemSummary, err := c.GetSystemSummary(ctx, nil)
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

// WithEuaIDFilter sets given EUA onto the params
func WithEuaIDFilter(euaUserId string) systemSummaryParamFilterOpt {
	return func(params *apisystems.SystemSummaryFindListParams) {
		params.SetUserName(&euaUserId)
	}
}

// WithSubSystems sets given cedar system ID as the parent system for which we are looking for sub-systems
func WithSubSystems(cedarSystemId string) systemSummaryParamFilterOpt {
	return func(params *apisystems.SystemSummaryFindListParams) {
		params.SetBelongsTo(&cedarSystemId)

		// we want all sub systems, not just ones included in the survey
		// TODO: some systems come back only when `nil` is set and do not come back when `true` or `false` is set - why?
		params.SetIncludeInSurvey(nil)
	}
}
