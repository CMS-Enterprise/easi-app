package cedarcore

import (
	"context"
	"fmt"

	"github.com/guregu/null/zero"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	apithreat "github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/client/threat"
	"github.com/cms-enterprise/easi-app/pkg/local/cedarcoremock"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// GetThreat makes a GET call to the /threat endpoint
func (c *Client) GetThreat(ctx context.Context, cedarSystemID string) ([]*models.CedarThreat, error) {
	if c.mockEnabled {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		if cedarcoremock.IsMockSystem(cedarSystemID) {
			return cedarcoremock.GetThreats(), nil
		}
		return nil, cedarcoremock.NoSystemFoundError()
	}

	// NOTE: We do not need to use the GetSystem call or check the cache here b/c
	//   the GetAuthorityToOperate call will do that when called below

	// Use GetAuthorityToOperate to retrieve ATO for system
	cedarATOs, err := c.GetAuthorityToOperate(ctx, cedarSystemID)
	if err != nil {
		return nil, err
	}

	// if there aren't any ATOS, early return;
	// otherwise /threat endpoint in CEDAR will return an error when no IDs are specified
	if len(cedarATOs) == 0 {
		return []*models.CedarThreat{}, nil
	}

	// List of ATO ID(s) to be passed into Threat endpoint
	var atoIDs []string

	// Run through all ATO objects and append ATO ID(s) to id list
	for _, ato := range cedarATOs {
		atoIDs = append(atoIDs, ato.CedarID.String)
	}

	// Construct the parameters
	params := apithreat.NewThreatFindListParams()
	params.SetIds(atoIDs)
	params.HTTPClient = c.hc

	// Make the API call
	resp, err := c.sdk.Threat.ThreatFindList(params, c.auth)
	if err != nil {
		return []*models.CedarThreat{}, err
	}

	if resp.Payload == nil {
		return []*models.CedarThreat{}, fmt.Errorf("no body received")
	}

	// Convert the auto-generated struct to our own pkg/models struct
	retVal := []*models.CedarThreat{}

	for _, threat := range resp.Payload.Threats {
		retVal = append(retVal, &models.CedarThreat{
			AlternativeID:     zero.StringFrom(threat.AlternativeID),
			ControlFamily:     zero.StringFrom(threat.ControlFamily),
			DaysOpen:          int(threat.DaysOpen),
			ID:                zero.StringFrom(threat.ID),
			ParentID:          zero.StringFrom(threat.ParentID),
			Type:              zero.StringFrom(threat.Type),
			WeaknessRiskLevel: zero.StringFrom(threat.WeaknessRiskLevel),
		})
	}

	return retVal, nil
}
