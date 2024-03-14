package cedarcore

import (
	"context"
	"fmt"

	"github.com/guregu/null"
	"github.com/guregu/null/zero"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	apiurl "github.com/cmsgov/easi-app/pkg/cedar/core/gen/client/url"
	"github.com/cmsgov/easi-app/pkg/models"
)

// GetURLsForSystem queries CEDAR for URLs associated with a particular system, taking the version-independent ID of a system
//
// Note: CEDAR's /url/{id} endpoint theoretically supports querying for URLs associated with any sort of CEDAR object;
// however, this method assumes that the parameter is a version-independent system ID.
// If we need to look up URLs based on something other than systems, we will need to create another method.
func (c *Client) GetURLsForSystem(ctx context.Context, cedarSystemID string) ([]*models.CedarURL, error) {
	if !c.cedarCoreEnabled(ctx) {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		return []*models.CedarURL{}, nil
	}

	cedarSystem, err := c.GetSystem(ctx, cedarSystemID)
	if err != nil {
		return nil, err
	}

	// Construct the parameters
	params := apiurl.NewURLFindListParams()
	params.SetID(cedarSystem.VersionID)
	params.HTTPClient = c.hc

	// Make the API call
	resp, err := c.sdk.URL.URLFindList(params, c.auth)
	if err != nil {
		return []*models.CedarURL{}, err
	}

	if resp.Payload == nil {
		return []*models.CedarURL{}, fmt.Errorf("no body received")
	}

	// Convert the auto-generated struct to our own pkg/models struct
	retVal := []*models.CedarURL{}

	// convert items in response payload to our models
	for _, url := range resp.Payload.URLList {
		retVal = append(retVal, &models.CedarURL{
			ID:                             *url.URLID,
			Address:                        zero.StringFrom(url.Address),
			IsBehindWebApplicationFirewall: null.BoolFrom(url.IsBehindWebApplicationFirewall),
			IsAPIEndpoint:                  null.BoolFrom(url.IsAPIEndpoint),
			IsVersionCodeRepository:        null.BoolFrom(url.IsVersionCodeRepository),
			URLHostingEnv:                  zero.StringFrom(url.URLHostingEnv),
		})
	}

	return retVal, nil
}
