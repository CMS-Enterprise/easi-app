package cedarcore

import (
	"context"

	"github.com/guregu/null/zero"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/client/budget"
	"github.com/cms-enterprise/easi-app/pkg/local/cedarcoremock"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// GetBudgetBySystem queries CEDAR for budget information associated with a particular system, taking the version-independent ID of a system
func (c *Client) GetBudgetBySystem(ctx context.Context, cedarSystemID string) ([]*models.CedarBudget, error) {
	if c.mockEnabled {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		if cedarcoremock.IsMockSystem(cedarSystemID) {
			return cedarcoremock.GetBudgets(), nil
		}
		return nil, cedarcoremock.NoSystemFoundError()
	}
	cedarSystem, err := c.GetSystem(ctx, cedarSystemID)
	if err != nil {
		return nil, err
	}

	params := budget.NewBudgetFindParams()

	// Construct the parameters
	params.SetSystemID(cedarSystem.VersionID.Ptr())
	params.HTTPClient = c.hc

	// Make the API call
	resp, err := c.sdk.Budget.BudgetFind(params, c.auth)
	if err != nil {
		return nil, err
	}

	// Convert the auto-generated struct to our own pkg/models struct
	retVal := make([]*models.CedarBudget, 0, len(resp.Payload.Budgets))

	for _, budget := range resp.Payload.Budgets {

		retVal = append(retVal, &models.CedarBudget{
			FiscalYear:    zero.StringFrom(budget.FiscalYear),
			Funding:       zero.StringFrom(budget.Funding),
			FundingID:     zero.StringFrom(budget.FundingID),
			FundingSource: zero.StringFrom(budget.FundingSource),
			ID:            zero.StringFrom(budget.ID),
			Name:          zero.StringFrom(budget.Name),
			ProjectID:     zero.StringFromPtr(budget.ProjectID),
			ProjectTitle:  zero.StringFrom(budget.ProjectTitle),
			SystemID:      zero.StringFrom(budget.SystemID),
		})
	}
	return retVal, nil
}
