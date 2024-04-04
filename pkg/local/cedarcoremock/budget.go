package cedarcoremock

import (
	"github.com/guregu/null/zero"

	"github.com/cmsgov/easi-app/pkg/models"
)

var mockBudgets = []*models.CedarBudget{
	{
		FiscalYear:    zero.StringFrom("2023"),
		Funding:       zero.StringFrom("Most of this funding is directly and only for this system (over 80%)"),
		FundingID:     zero.StringFrom("12345"),
		FundingSource: zero.StringFrom("Prog Ops"),
		ID:            zero.StringFrom("12345"),
		Name:          zero.StringFrom("Budget Project 1"),
		ProjectID:     zero.StringFrom("12345"),
		ProjectTitle:  zero.StringFrom("Budget X"),
		SystemID:      zero.StringFrom("12345"),
	},
	{
		FiscalYear:    zero.StringFrom("2023"),
		Funding:       zero.StringFrom("Only part of this funding is directly for this system (less than 40%)"),
		FundingID:     zero.StringFrom("12345"),
		FundingSource: zero.StringFrom("Fed Admin"),
		ID:            zero.StringFrom("12345"),
		Name:          zero.StringFrom("Budget Project 1"),
		ProjectID:     zero.StringFrom("12345"),
		ProjectTitle:  zero.StringFrom("Budget X"),
		SystemID:      zero.StringFrom("12345"),
	},
}

// GetATOs returns a mock ATO
func GetBudgets() []*models.CedarBudget {
	return mockBudgets
}
