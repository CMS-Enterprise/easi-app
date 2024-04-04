package cedarcore

import (
	"context"
	"fmt"

	"github.com/guregu/null/zero"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/cedar/core/gen/client/budget_system_cost"
	"github.com/cmsgov/easi-app/pkg/local/cedarcoremock"
	"github.com/cmsgov/easi-app/pkg/models"
)

// GetBudgetSystemCostBySystem queries CEDAR for budget system cost information associated with a particular system, taking the version-independent ID of a system
func (c *Client) GetBudgetSystemCostBySystem(ctx context.Context, cedarSystemID string) (*models.CedarBudgetSystemCost, error) {
	if c.mockEnabled {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		if cedarcoremock.IsMockSystem(cedarSystemID) {
			return cedarcoremock.GetBudgetSystemCost(), nil
		}
		return nil, cedarcoremock.NoSystemFoundError()
	}
	cedarSystem, err := c.GetSystem(ctx, cedarSystemID)
	if err != nil {
		return nil, err
	}

	params := budget_system_cost.NewBudgetSystemCostFindParams()

	// Construct the parameters
	params.SetSystemID(cedarSystem.VersionID.Ptr())
	params.HTTPClient = c.hc

	if err != nil {
		return nil, err
	}

	// Make the API call
	// resp, err := c.sdk.Budget.BudgetFind(params, c.auth)
	resp, err := c.sdk.BudgetSystemCost.BudgetSystemCostFind(params, c.auth)

	if err != nil {
		return nil, err
	}

	if resp.Payload == nil {
		return nil, fmt.Errorf("no body received")
	}

	// Convert the auto-generated struct to our own pkg/models struct

	// Start by converting child BudgetActualCost object array
	budgetActualCosts := make([]*models.BudgetActualCost, 0, len(resp.Payload.BudgetActualCost))

	for _, budget := range resp.Payload.BudgetActualCost {

		budgetActualCosts = append(budgetActualCosts, &models.BudgetActualCost{
			ActualSystemCost: zero.StringFrom(budget.ActualSystemCost),
			FiscalYear:       zero.StringFrom(budget.FiscalYear),
			SystemID:         zero.StringFrom(budget.SystemID),
		})
	}

	// Convert the rest of the parent CedarBudgetSystemCost object
	retVal := &models.CedarBudgetSystemCost{
		Count:             *resp.Payload.Count,
		BudgetActualCosts: budgetActualCosts,
	}

	return retVal, nil
}
