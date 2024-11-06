package models

import (
	"github.com/guregu/null/zero"
)

// CedarBudgetSystemCost represents a single BudgetActualSystemCost object returned from the CEDAR API

type BudgetActualCost struct {
	ActualSystemCost zero.String `json:"actualSystemCost,omitempty"`
	FiscalYear       zero.String `json:"fiscalYear,omitempty"`
	SystemID         zero.String `json:"systemId,omitempty"`
}

type CedarBudgetSystemCost struct {
	// Always present fields
	BudgetActualCosts []*BudgetActualCost `json:"budgetActualCosts"`
}
