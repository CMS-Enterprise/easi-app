package cedarcoremock

import (
	"github.com/guregu/null/zero"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

// GetBudgetSystemCost returns a mock BudgetSystemCost
func GetBudgetSystemCost() *models.CedarBudgetSystemCost {
	return &models.CedarBudgetSystemCost{
		BudgetActualCosts: []*models.BudgetActualCost{
			{
				ActualSystemCost: zero.StringFrom("3.50"),
				FiscalYear:       zero.StringFrom("2024"),
				SystemID:         zero.StringFrom("1234"),
			},
			{
				ActualSystemCost: zero.StringFrom("7"),
				FiscalYear:       zero.StringFrom("2023"),
				SystemID:         zero.StringFrom("1235"),
			},
			{
				ActualSystemCost: zero.StringFrom("10.50"),
				FiscalYear:       zero.StringFrom("2022"),
				SystemID:         zero.StringFrom("1236"),
			},
			{
				ActualSystemCost: zero.StringFrom("14"),
				FiscalYear:       zero.StringFrom("2021"),
				SystemID:         zero.StringFrom("1237"),
			},
			{
				ActualSystemCost: zero.StringFrom("3.50"),
				FiscalYear:       zero.StringFrom("2020"),
				SystemID:         zero.StringFrom("1234"),
			},
			{
				ActualSystemCost: zero.StringFrom("7"),
				FiscalYear:       zero.StringFrom("2019"),
				SystemID:         zero.StringFrom("1235"),
			},
			{
				ActualSystemCost: zero.StringFrom("10.50"),
				FiscalYear:       zero.StringFrom("2018"),
				SystemID:         zero.StringFrom("1236"),
			},
			{
				ActualSystemCost: zero.StringFrom("14"),
				FiscalYear:       zero.StringFrom("2017"),
				SystemID:         zero.StringFrom("1237"),
			},
			{
				ActualSystemCost: zero.StringFrom(""),
				FiscalYear:       zero.StringFrom("2016"),
				SystemID:         zero.StringFrom(""),
			},
			{
				ActualSystemCost: zero.StringFrom("1000"),
				FiscalYear:       zero.StringFrom(""),
				SystemID:         zero.StringFrom(""),
			},
		},
	}
}
