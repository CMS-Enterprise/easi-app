package cedarcore

import (
	"context"

	"github.com/guregu/null/zero"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/cedar/core/gen/client/contract"
	"github.com/cmsgov/easi-app/pkg/models"
)

// GetContractBySystem queries CEDAR for contract information associated with a particular system, taking the version-independent ID of a system
func (c *Client) GetContractBySystem(ctx context.Context, cedarSystemID string) ([]*models.CedarContract, error) {
	if c.mockEnabled {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		return []*models.CedarContract{}, nil
	}
	cedarSystem, err := c.GetSystem(ctx, cedarSystemID)

	params := contract.NewContractFindParams()

	// Construct the parameters
	params.SetSystemID(&cedarSystem.VersionID)
	params.HTTPClient = c.hc

	if err != nil {
		return nil, err
	}

	// Make the API call
	resp, err := c.sdk.Contract.ContractFind(params, c.auth)
	if err != nil {
		return nil, err
	}

	// Convert the auto-generated struct to our own pkg/models struct
	retVal := make([]*models.CedarContract, 0, len(resp.Payload.Contracts))

	for _, contract := range resp.Payload.Contracts {

		retVal = append(retVal, &models.CedarContract{
			AwardID:       contract.AwardID,
			ID:            contract.ID,
			ParentAwardID: contract.ParentAwardID,

			ContractAdo:           zero.StringFrom(contract.ContractADO),
			ContractDeliverableID: zero.StringFrom(contract.ContractDeliverableID),
			ContractName:          zero.StringFrom(contract.ContractName),
			Description:           zero.StringFrom(contract.Description),
			SystemID:              zero.StringFrom(contract.SystemID),
		})
	}
	return retVal, nil
}
