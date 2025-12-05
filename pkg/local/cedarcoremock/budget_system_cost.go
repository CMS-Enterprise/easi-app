package cedarcoremock

import (
	"github.com/google/uuid"
	"github.com/guregu/null/zero"

	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// GetBudgetSystemCost returns a mock BudgetSystemCost
func GetBudgetSystemCost() *models.CedarBudgetSystemCost {
	return &models.CedarBudgetSystemCost{
		BudgetActualCosts: []*models.BudgetActualCost{
			{
				ActualSystemCost: zero.StringFrom("3.50"),
				FiscalYear:       zero.StringFrom("2024"),
				SystemID:         helpers.PointerTo(uuid.New()),
			},
			{
				ActualSystemCost: zero.StringFrom("7"),
				FiscalYear:       zero.StringFrom("2023"),
				SystemID:         helpers.PointerTo(uuid.New()),
			},
			{
				ActualSystemCost: zero.StringFrom("10.50"),
				FiscalYear:       zero.StringFrom("2022"),
				SystemID:         helpers.PointerTo(uuid.New()),
			},
			{
				ActualSystemCost: zero.StringFrom("14"),
				FiscalYear:       zero.StringFrom("2021"),
				SystemID:         helpers.PointerTo(uuid.New()),
			},
			{
				ActualSystemCost: zero.StringFrom("3.50"),
				FiscalYear:       zero.StringFrom("2020"),
				SystemID:         helpers.PointerTo(uuid.New()),
			},
			{
				ActualSystemCost: zero.StringFrom("7"),
				FiscalYear:       zero.StringFrom("2019"),
				SystemID:         helpers.PointerTo(uuid.New()),
			},
			{
				ActualSystemCost: zero.StringFrom("10.50"),
				FiscalYear:       zero.StringFrom("2018"),
				SystemID:         helpers.PointerTo(uuid.New()),
			},
			{
				ActualSystemCost: zero.StringFrom("14"),
				FiscalYear:       zero.StringFrom("2017"),
				SystemID:         helpers.PointerTo(uuid.New()),
			},
			{
				ActualSystemCost: zero.StringFrom(""),
				FiscalYear:       zero.StringFrom("2016"),
				SystemID:         nil,
			},
			{
				ActualSystemCost: zero.StringFrom("1000"),
				FiscalYear:       zero.StringFrom(""),
				SystemID:         nil,
			},
		},
	}
}
