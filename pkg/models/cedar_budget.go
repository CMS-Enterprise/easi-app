package models

import (
	"github.com/guregu/null/zero"
)

// CedarBudget represents a single Budget object returned from the CEDAR API

type CedarBudget struct {
	FiscalYear    zero.String `json:"fiscalYear,omitempty"`
	Funding       zero.String `json:"funding,omitempty"`
	FundingID     zero.String `json:"fundingId,omitempty"`
	FundingSource zero.String `json:"fundingSource,omitempty"`
	ID            zero.String `json:"id,omitempty"`
	Name          zero.String `json:"name,omitempty"`
	ProjectID     zero.String `json:"projectId"`
	ProjectTitle  zero.String `json:"projectTitle,omitempty"`
	SystemID      zero.String `json:"systemId,omitempty"`
}
