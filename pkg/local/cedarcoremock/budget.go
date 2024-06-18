package cedarcoremock

import (
	"github.com/guregu/null/zero"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

var mockBudgets = []*models.CedarBudget{
	{
		FiscalYear:    zero.StringFrom("2023"),
		Funding:       zero.StringFrom("Most of this funding is directly and only for this system (over 80%)"),
		FundingID:     zero.StringFrom("b9b5568a-6ef5-4a7f-94e2-5bfc76ffd4a3"),
		FundingSource: zero.StringFrom("Prog Ops"),
		ID:            zero.StringFrom("485f8040-b008-4ad2-9b49-bd5fdf79a45c"),
		Name:          zero.StringFrom("Budget Project 1"),
		ProjectID:     zero.StringFrom("12345"),
		ProjectTitle:  zero.StringFrom("Budget X"),
		SystemID:      zero.StringFrom("12345"),
	},
	{
		FiscalYear:    zero.StringFrom("2023"),
		Funding:       zero.StringFrom("Only part of this funding is directly for this system (less than 40%)"),
		FundingID:     zero.StringFrom("a21f368e-98c1-4b9f-8efd-38361bc34934"),
		FundingSource: zero.StringFrom("Fed Admin"),
		ID:            zero.StringFrom("4f9cc4cb-8a06-4375-99bd-2cabd64d8f0c"),
		Name:          zero.StringFrom("Budget Project 1"),
		ProjectID:     zero.StringFrom("12345"),
		ProjectTitle:  zero.StringFrom("Budget X"),
		SystemID:      zero.StringFrom("12345"),
	},
	{
		FiscalYear:    zero.StringFrom(""),
		Funding:       zero.StringFrom(""),
		FundingID:     zero.StringFrom(""),
		FundingSource: zero.StringFrom(""),
		ID:            zero.StringFrom(""),
		Name:          zero.StringFrom(""),
		ProjectID:     zero.StringFrom("12345"),
		ProjectTitle:  zero.StringFrom(""),
		SystemID:      zero.StringFrom(""),
	},
}

// GetBudgets returns a mock Budget
func GetBudgets() []*models.CedarBudget {
	return mockBudgets
}
