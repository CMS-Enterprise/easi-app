package models

import (
	"github.com/guregu/null/zero"
)

// CedarBudget represents a single Budget object returned from the CEDAR API

type CedarBudget struct {
	Funding      zero.String `json:"funding,omitempty"`
	FundingID    zero.String `json:"fundingId,omitempty"`
	ID           zero.String `json:"id,omitempty"`
	ProjectID    *string     `json:"projectId"`
	ProjectTitle zero.String `json:"projectTitle,omitempty"`
	SystemID     zero.String `json:"systemId,omitempty"`
}
