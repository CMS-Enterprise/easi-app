package models

import (
	"github.com/guregu/null/zero"
)

// CedarThreat is the model for threat information that comes back from the CEDAR Core API
type CedarThreat struct {
	// possibly-null fields
	AlternativeID     zero.String `json:"alternativeId"`
	ControlFamily     zero.String `json:"controlFamily"`
	DaysOpen          int         `json:"daysOpen"`
	ID                zero.String `json:"id"`
	ParentID          zero.String `json:"parentId"`
	Type              zero.String `json:"type"`
	WeaknessRiskLevel zero.String `json:"weaknessRiskLevel"`
}
