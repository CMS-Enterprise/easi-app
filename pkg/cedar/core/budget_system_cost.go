package cedarcore

import (
	"context"
	"fmt"
	"sort"

	"github.com/guregu/null/zero"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/client/budget_system_cost"
	"github.com/cms-enterprise/easi-app/pkg/local/cedarcoremock"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

/*
GetBudgetSystemCostBySystem queries CEDAR for budget system cost information associated with a particular system,
taking the version-independent ID of a system.

NOTE: This function sorts the data returned by CEDAR to ensure ordering by descending FiscalYear
*/
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

	// Sort the slice to ensure ordering by descending FiscalYear.
	// This may produce weird ordering/grouping if some of the strings returned by CEDAR are not actually numbers
	sort.Slice(budgetActualCosts[:], func(i, j int) bool {
		return budgetActualCosts[i].FiscalYear.String > budgetActualCosts[j].FiscalYear.String
	})

	// Convert the rest of the parent CedarBudgetSystemCost object
	retVal := &models.CedarBudgetSystemCost{
		BudgetActualCosts: budgetActualCosts,
	}

	return retVal, nil
}
