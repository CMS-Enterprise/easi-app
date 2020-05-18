package models

import (
	"encoding/json"

	"github.com/google/uuid"
	"github.com/guregu/null"
)

// LifecycleCostPhase represents the phase of a lifecycle cost line
type LifecycleCostPhase string

// LifecycleCostSolution represents the solution associated with the line
type LifecycleCostSolution string

// LifecycleCostYear represents the year associated with the line
type LifecycleCostYear string

const (
	// LifecycleCostPhaseINITIATE captures enum value "Initiate"
	LifecycleCostPhaseINITIATE LifecycleCostPhase = "Initiate"
	// LifecycleCostPhaseDEVELOPMENT captures enum value "Development"
	LifecycleCostPhaseDEVELOPMENT LifecycleCostPhase = "Development"
	// LifecycleCostPhaseOPERATIONMAINTENANCE captures enum value "Operation & Maintenance"
	LifecycleCostPhaseOPERATIONMAINTENANCE LifecycleCostPhase = "Operation & Maintenance"

	// LifecycleCostSolutionASIS captures enum value "As Is"
	LifecycleCostSolutionASIS LifecycleCostSolution = "As Is"
	// LifecycleCostSolutionPREFERRED captures enum value "Preferred"
	LifecycleCostSolutionPREFERRED LifecycleCostSolution = "Preferred"
	// LifecycleCostSolutionA captures enum value "A"
	LifecycleCostSolutionA LifecycleCostSolution = "A"
	// LifecycleCostSolutionB captures enum value "B"
	LifecycleCostSolutionB LifecycleCostSolution = "B"

	// LifecycleCostYear1 captures enum value "1"
	LifecycleCostYear1 LifecycleCostYear = "1"
	// LifecycleCostYear2 captures enum value "2"
	LifecycleCostYear2 LifecycleCostYear = "2"
	// LifecycleCostYear3 captures enum value "3"
	LifecycleCostYear3 LifecycleCostYear = "3"
	// LifecycleCostYear4 captures enum value "4"
	LifecycleCostYear4 LifecycleCostYear = "4"
	// LifecycleCostYear5 captures enum value "5"
	LifecycleCostYear5 LifecycleCostYear = "5"
)

// EstimatedLifecycleCost is the model for the cost of an estimated lifecycle line in the business case.
type EstimatedLifecycleCost struct {
	ID             uuid.UUID
	BusinessCaseID uuid.UUID `db:"business_case" json:"business_case"`
	Solution       LifecycleCostSolution
	Phase          LifecycleCostPhase
	Year           LifecycleCostYear
	Cost           int
}

// EstimatedLifecycleCosts models a list of EstimatedLifecycleCost line items
type EstimatedLifecycleCosts []EstimatedLifecycleCost

// Scan implements the sql.Scanner interface
func (e *EstimatedLifecycleCosts) Scan(src interface{}) error {
	return json.Unmarshal(src.([]byte), e)
}

// BusinessCase is the model for the business case form.
type BusinessCase struct {
	ID                              uuid.UUID
	EUAUserID                       string      `db:"eua_user_id"`
	SystemIntakeID                  uuid.UUID   `db:"system_intake"`
	ProjectName                     null.String `db:"project_name"`
	Requester                       null.String
	RequesterPhoneNumber            null.String             `db:"requester_phone_number"`
	BusinessOwner                   null.String             `db:"business_owner"`
	BusinessNeed                    null.String             `db:"business_need"`
	CMSBenefit                      null.String             `db:"cms_benefit"`
	PriorityAlignment               null.String             `db:"priority_alignment"`
	SuccessIndicators               null.String             `db:"success_indicators"`
	AsIsTitle                       null.String             `db:"as_is_title"`
	AsIsSummary                     null.String             `db:"as_is_summary"`
	AsIsPros                        null.String             `db:"as_is_pros"`
	AsIsCons                        null.String             `db:"as_is_cons"`
	AsIsCostSavings                 null.String             `db:"as_is_cost_savings"`
	PreferredTitle                  null.String             `db:"preferred_title"`
	PreferredSummary                null.String             `db:"preferred_summary"`
	PreferredAcquisitionApproach    null.String             `db:"preferred_acquisition_approach"`
	PreferredPros                   null.String             `db:"preferred_pros"`
	PreferredCons                   null.String             `db:"preferred_cons"`
	PreferredCostSavings            null.String             `db:"preferred_cost_savings"`
	AlternativeATitle               null.String             `db:"alternative_a_title"`
	AlternativeASummary             null.String             `db:"alternative_a_summary"`
	AlternativeAAcquisitionApproach null.String             `db:"alternative_a_acquisition_approach"`
	AlternativeAPros                null.String             `db:"alternative_a_pros"`
	AlternativeACons                null.String             `db:"alternative_a_cons"`
	AlternativeACostSavings         null.String             `db:"alternative_a_cost_savings"`
	AlternativeBTitle               null.String             `db:"alternative_b_title"`
	AlternativeBSummary             null.String             `db:"alternative_b_summary"`
	AlternativeBAcquisitionApproach null.String             `db:"alternative_b_acquisition_approach"`
	AlternativeBPros                null.String             `db:"alternative_b_pros"`
	AlternativeBCons                null.String             `db:"alternative_b_cons"`
	AlternativeBCostSavings         null.String             `db:"alternative_b_cost_savings"`
	LifecycleCostLines              EstimatedLifecycleCosts `db:"lifecycle_cost_lines"`
}

// BusinessCases is the model for a list of business cases
type BusinessCases []BusinessCase
