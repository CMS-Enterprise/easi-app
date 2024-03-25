package cedarcore

import (
	"context"
	"strings"
	"time"

	"github.com/guregu/null/zero"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/cedar/core/gen/client/contract"
	cedarcoremock "github.com/cmsgov/easi-app/pkg/local/cedarcore"
	"github.com/cmsgov/easi-app/pkg/models"
)

// GetContractBySystem queries CEDAR for contract information associated with a particular system, taking the version-independent ID of a system
func (c *Client) GetContractBySystem(ctx context.Context, cedarSystemID string) ([]*models.CedarContract, error) {
	if c.mockEnabled {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		return cedarcoremock.GetContractsBySystem(cedarSystemID), nil
	}
	cedarSystem, err := c.GetSystem(ctx, cedarSystemID)
	if err != nil {
		return nil, err
	}
	if cedarSystem == nil {
		return nil, nil
	}

	params := contract.NewContractFindParams()

	// Construct the parameters
	params.SetSystemID(cedarSystem.VersionID.Ptr())
	params.HTTPClient = c.hc

	// Make the API call
	resp, err := c.sdk.Contract.ContractFind(params, c.auth)
	if err != nil {
		return nil, err
	}

	// Convert the auto-generated struct to our own pkg/models struct
	retVal := make([]*models.CedarContract, 0, len(resp.Payload.Contracts))

	for _, contract := range resp.Payload.Contracts {
		var isDeliveryOrg bool
		if strings.ToLower(contract.IsDeliveryOrg) == "yes" {
			isDeliveryOrg = true
		}

		endDate, err := time.Parse(time.RFC3339, contract.POPEndDate)
		if err != nil {
			endDate = time.Time{}
		}
		startDate, err := time.Parse(time.RFC3339, contract.POPStartDate)
		if err != nil {
			startDate = time.Time{}
		}

		retVal = append(retVal, &models.CedarContract{
			EndDate:         zero.TimeFrom(endDate),
			StartDate:       zero.TimeFrom(startDate),
			ContractNumber:  contract.AwardID,
			ContractName:    zero.StringFrom(contract.ProjectTitle),
			Description:     zero.StringFrom(contract.Description),
			OrderNumber:     zero.StringFrom(contract.OrderNumber),
			ServiceProvided: zero.StringFrom(contract.ServiceProvided),
			IsDeliveryOrg:   isDeliveryOrg,
			SystemID:        zero.StringFrom(contract.SystemID),
		})
	}
	return retVal, nil
}
