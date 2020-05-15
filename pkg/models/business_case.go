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
	ID             uuid.UUID             `json:"id"`
	BusinessCaseID uuid.UUID             `json:"business_case" db:"business_case"`
	Solution       LifecycleCostSolution `json:"solution"`
	Phase          LifecycleCostPhase    `json:"phase"`
	Year           LifecycleCostYear     `json:"year"`
	Cost           int                   `json:"cost"`
}

// EstimatedLifecycleCosts models a list of EstimatedLifecycleCost line items
type EstimatedLifecycleCosts []EstimatedLifecycleCost

// Scan implements the sql.Scanner interface
func (e *EstimatedLifecycleCosts) Scan(src interface{}) error {
	return json.Unmarshal(src.([]byte), e)
}

// BusinessCase is the model for the business case form.
type BusinessCase struct {
	ID                              uuid.UUID               `json:"id"`
	EUAUserID                       string                  `json:"euaUserId" db:"eua_user_id"`
	ProjectName                     null.String             `json:"projectName" db:"project_name"`
	Requester                       null.String             `json:"requester"`
	RequesterPhoneNumber            null.String             `json:"requesterPhoneNumber" db:"requester_phone_number"`
	BusinessOwner                   null.String             `json:"businessOwner" db:"business_owner"`
	BusinessNeed                    null.String             `json:"businessNeed" db:"business_need"`
	CMSBenefit                      null.String             `json:"cmsBenefit" db:"cms_benefit"`
	PriorityAlignment               null.String             `json:"priorityAlignment" db:"priority_alignment"`
	SuccessIndicators               null.String             `json:"successIndicators" db:"success_indicators"`
	AsIsTitle                       null.String             `json:"asIsTitle" db:"as_is_title"`
	AsIsSummary                     null.String             `json:"asIsSummary" db:"as_is_summary"`
	AsIsPros                        null.String             `json:"asIsPros" db:"as_is_pros"`
	AsIsCons                        null.String             `json:"asIsCons" db:"as_is_cons"`
	AsIsCostSavings                 null.String             `json:"asIsCostSavings" db:"as_is_cost_savings"`
	PreferredTitle                  null.String             `json:"preferredTitle" db:"preferred_title"`
	PreferredSummary                null.String             `json:"preferredSummary" db:"preferred_summary"`
	PreferredAcquisitionApproach    null.String             `json:"preferredAcquisitionApproach" db:"preferred_acquisition_approach"`
	PreferredPros                   null.String             `json:"preferredPros" db:"preferred_pros"`
	PreferredCons                   null.String             `json:"preferredCons" db:"preferred_cons"`
	PreferredCostSavings            null.String             `json:"preferredCostSavings" db:"preferred_cost_savings"`
	AlternativeATitle               null.String             `json:"alternativeATitle" db:"alternative_a_title"`
	AlternativeASummary             null.String             `json:"alternativeASummary" db:"alternative_a_summary"`
	AlternativeAAcquisitionApproach null.String             `json:"alternativeAAcquisitionApproach" db:"alternative_a_acquisition_approach"`
	AlternativeAPros                null.String             `json:"alternativeAPros" db:"alternative_a_pros"`
	AlternativeACons                null.String             `json:"alternativeACons" db:"alternative_a_cons"`
	AlternativeACostSavings         null.String             `json:"alternativeACostSavings" db:"alternative_a_cost_savings"`
	AlternativeBTitle               null.String             `json:"alternativeBTitle" db:"alternative_b_title"`
	AlternativeBSummary             null.String             `json:"alternativeBSummary" db:"alternative_b_summary"`
	AlternativeBAcquisitionApproach null.String             `json:"alternativeBAcquisitionApproach" db:"alternative_b_acquisition_approach"`
	AlternativeBPros                null.String             `json:"alternativeBPros" db:"alternative_b_pros"`
	AlternativeBCons                null.String             `json:"alternativeBCons" db:"alternative_b_cons"`
	AlternativeBCostSavings         null.String             `json:"alternativeBCostSavings" db:"alternative_b_cost_savings"`
	LifecycleCostLines              EstimatedLifecycleCosts `json:"lifecycleCostLines" db:"lifecycle_cost_lines"`
}
