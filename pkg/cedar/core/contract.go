package cedarcore

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null/zero"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/client/contract"
	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/local/cedarcoremock"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// GetContractBySystem queries CEDAR for contract information associated with a particular system, taking the version-independent ID of a system
func (c *Client) GetContractBySystem(ctx context.Context, cedarSystemID uuid.UUID) ([]*models.CedarContract, error) {
	if c.mockEnabled {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		if cedarcoremock.IsMockSystem(cedarSystemID) {
			return cedarcoremock.GetContractsBySystem(cedarSystemID), nil
		}
		return nil, cedarcoremock.NoSystemFoundError()
	}

	params := contract.NewContractFindParams()

	// Construct the parameters
	params.SetSystemID(helpers.PointerTo(formatIDForCEDAR(cedarSystemID)))
	params.HTTPClient = c.hc

	// Make the API call
	resp, err := c.sdk.Contract.ContractFind(params, c.auth)
	if err != nil {
		return nil, err
	}

	// Convert the auto-generated struct to our own pkg/models struct
	retVal := make([]*models.CedarContract, 0, len(resp.Payload.Contracts))

	for _, contractData := range resp.Payload.Contracts {
		parsedUUID, err := uuid.Parse(contractData.SystemID)
		if err != nil {
			return nil, fmt.Errorf("unable to parse UUID when getting contract: %w", err)
		}

		var isDeliveryOrg bool
		if strings.ToLower(contractData.IsDeliveryOrg) == "yes" {
			isDeliveryOrg = true
		}

		endDate, err := time.Parse(time.RFC3339, contractData.POPEndDate)
		if err != nil {
			endDate = time.Time{}
		}
		startDate, err := time.Parse(time.RFC3339, contractData.POPStartDate)
		if err != nil {
			startDate = time.Time{}
		}

		retVal = append(retVal, &models.CedarContract{
			EndDate:         zero.TimeFrom(endDate),
			StartDate:       zero.TimeFrom(startDate),
			ContractNumber:  zero.StringFrom(contractData.ContractNumber),
			ContractName:    zero.StringFrom(contractData.ProjectTitle),
			Description:     zero.StringFrom(contractData.Description),
			OrderNumber:     zero.StringFrom(contractData.OrderNumber),
			ServiceProvided: zero.StringFrom(contractData.ServiceProvided),
			IsDeliveryOrg:   isDeliveryOrg,
			SystemID:        &parsedUUID,
		})
	}
	return retVal, nil
}
