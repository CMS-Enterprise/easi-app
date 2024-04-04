package cedarcoremock

import (
	"github.com/guregu/null/zero"

	"github.com/cmsgov/easi-app/pkg/models"
)

// GetATOs returns a mock ATO
func GetBudgetSystemCost() *models.CedarBudgetSystemCost {
	return &models.CedarBudgetSystemCost{
		Count: 4,
		BudgetActualCosts: []*models.BudgetActualCost{
			{
				ActualSystemCost: zero.StringFrom("3.50"),
				FiscalYear:       zero.StringFrom("2021"),
				SystemID:         zero.StringFrom("1234"),
			},
			{
				ActualSystemCost: zero.StringFrom("7"),
				FiscalYear:       zero.StringFrom("2022"),
				SystemID:         zero.StringFrom("1235"),
			},
			{
				ActualSystemCost: zero.StringFrom("10.50"),
				FiscalYear:       zero.StringFrom("2023"),
				SystemID:         zero.StringFrom("1236"),
			},
			{
				ActualSystemCost: zero.StringFrom("14"),
				FiscalYear:       zero.StringFrom("2024"),
				SystemID:         zero.StringFrom("1237"),
			},
		},
	}
}
