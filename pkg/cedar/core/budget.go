package cedarcore

import (
	"context"

	"github.com/guregu/null/zero"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/cedar/core/gen/client/budget"
	"github.com/cmsgov/easi-app/pkg/models"
)

// GetBudgetBySystem queries CEDAR for budget information associated with a particular system, taking the version-independent ID of a system
func (c *Client) GetBudgetBySystem(ctx context.Context, cedarSystemID string) ([]*models.CedarBudget, error) {
	if c.mockEnabled {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		return []*models.CedarBudget{}, nil
	}
	cedarSystem, err := c.GetSystem(ctx, cedarSystemID)

	params := budget.NewBudgetFindParams()

	// Construct the parameters
	params.SetSystemID(&cedarSystem.VersionID)
	params.HTTPClient = c.hc

	if err != nil {
		return nil, err
	}

	// Make the API call
	resp, err := c.sdk.Budget.BudgetFind(params, c.auth)
	if err != nil {
		return nil, err
	}

	// Convert the auto-generated struct to our own pkg/models struct
	retVal := make([]*models.CedarBudget, 0, len(resp.Payload.Budgets))

	for _, budget := range resp.Payload.Budgets {

		retVal = append(retVal, &models.CedarBudget{
			Funding:      zero.StringFrom(budget.Funding),
			FundingID:    zero.StringFrom(budget.FundingID),
			ID:           zero.StringFrom(budget.ID),
			ProjectID:    budget.ProjectID,
			ProjectTitle: zero.StringFrom(budget.ProjectTitle),
			SystemID:     zero.StringFrom(budget.SystemID),
		})
	}
	return retVal, nil
}
