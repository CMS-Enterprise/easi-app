package models

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
)

// BusinessCaseStatus represents the status of a system intake
type BusinessCaseStatus string

// LifecycleCostPhase represents the phase of a lifecycle cost line
type LifecycleCostPhase string

// LifecycleCostSolution represents the solution associated with the line
type LifecycleCostSolution string

// LifecycleCostYear represents the year associated with the line
type LifecycleCostYear string

const (
	// BusinessCaseStatusOPEN captures enum value "OPEN"
	BusinessCaseStatusOPEN BusinessCaseStatus = "OPEN"
	// BusinessCaseStatusCLOSED captures enum value "CLOSED"
	BusinessCaseStatusCLOSED BusinessCaseStatus = "CLOSED"

	// LifecycleCostPhaseDEVELOPMENT captures enum value "Development"
	LifecycleCostPhaseDEVELOPMENT LifecycleCostPhase = "Development"
	// LifecycleCostPhaseOPERATIONMAINTENANCE captures enum value "Operations and Maintenance"
	LifecycleCostPhaseOPERATIONMAINTENANCE LifecycleCostPhase = "Operations and Maintenance"
	// LifecycleCostPhaseHELPDESK captures enum value "Help desk/call center"
	LifecycleCostPhaseHELPDESK LifecycleCostPhase = "Help desk/call center"
	// LifecycleCostPhaseSOFTWARE captures enum value "Software licenses"
	LifecycleCostPhaseSOFTWARE LifecycleCostPhase = "Software licenses"
	// LifecycleCostPhasePLANNING captures enum value "Planning, support, and professional services"
	LifecycleCostPhasePLANNING LifecycleCostPhase = "Planning, support, and professional services"
	// LifecycleCostPhaseINFRASTRUCTURE captures enum value "Infrastructure"
	LifecycleCostPhaseINFRASTRUCTURE LifecycleCostPhase = "Infrastructure"
	// LifecycleCostPhaseOIT captures enum value "OIT Services, tools, and pilots"
	LifecycleCostPhaseOIT LifecycleCostPhase = "OIT Services, tools, and pilots"
	// LifecycleCostPhaseOTHER captures enum value "Other"
	LifecycleCostPhaseOTHER LifecycleCostPhase = "Other"

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

// EstimatedLifecycleCost is the model for the cost of an estimated lifecycle line in the Business Case.
type EstimatedLifecycleCost struct {
	ID             uuid.UUID             `json:"id"`
	BusinessCaseID uuid.UUID             `json:"business_case" db:"business_case"`
	Solution       LifecycleCostSolution `json:"solution"`
	Phase          *LifecycleCostPhase   `json:"phase"`
	Year           LifecycleCostYear     `json:"year"`
	Cost           *int64                `json:"cost"`
}

func (e EstimatedLifecycleCost) GetMappingKey() uuid.UUID {
	return e.BusinessCaseID
}

func (e EstimatedLifecycleCost) GetMappingVal() *EstimatedLifecycleCost {
	return &e
}

// EstimatedLifecycleCosts models a list of EstimatedLifecycleCost line items
type EstimatedLifecycleCosts []EstimatedLifecycleCost

// Scan implements the sql.Scanner interface
func (e *EstimatedLifecycleCosts) Scan(src interface{}) error {
	return json.Unmarshal(src.([]byte), e)
}

// BusinessCase is the model for the Business Case form.
type BusinessCase struct {
	ID                                  uuid.UUID          `json:"id"`
	EUAUserID                           string             `json:"euaUserId" db:"eua_user_id"`
	SystemIntakeID                      uuid.UUID          `json:"systemIntakeId" db:"system_intake"`
	Status                              BusinessCaseStatus `json:"status"`
	ProjectName                         null.String        `json:"projectName" db:"project_name"`
	ProjectAcronym                      null.String        `json:"projectAcronym" db:"project_acronym"`
	Requester                           null.String        `json:"requester"`
	RequesterPhoneNumber                null.String        `json:"requesterPhoneNumber" db:"requester_phone_number"`
	BusinessOwner                       null.String        `json:"businessOwner" db:"business_owner"`
	BusinessNeed                        null.String        `json:"businessNeed" db:"business_need"`
	CollaborationNeeded                 null.String        `json:"collaborationNeeded" db:"collaboration_needed"`
	CurrentSolutionSummary              null.String        `json:"currentSolutionSummary" db:"current_solution_summary"`
	CMSBenefit                          null.String        `json:"cmsBenefit" db:"cms_benefit"`
	PriorityAlignment                   null.String        `json:"priorityAlignment" db:"priority_alignment"`
	SuccessIndicators                   null.String        `json:"successIndicators" db:"success_indicators"`
	ResponseToGRTFeedback               null.String        `json:"responseToGRTFeedback" db:"response_to_grt_feedback"`
	PreferredTitle                      null.String        `json:"preferredTitle" db:"preferred_title"`
	PreferredSummary                    null.String        `json:"preferredSummary" db:"preferred_summary"`
	PreferredAcquisitionApproach        null.String        `json:"preferredAcquisitionApproach" db:"preferred_acquisition_approach"`
	PreferredTargetContractAwardDate    *time.Time         `json:"preferredTargetContractAwardDate" db:"preferred_target_contract_award_date"`
	PreferredTargetCompletionDate       *time.Time         `json:"preferredTargetCompletionDate" db:"preferred_target_completion_date"`
	PreferredSecurityIsApproved         null.Bool          `json:"preferredSecurityIsApproved" db:"preferred_security_is_approved"`
	PreferredSecurityIsBeingReviewed    null.String        `json:"preferredSecurityIsBeingReviewed" db:"preferred_security_is_being_reviewed"`
	PreferredZeroTrustAlignment         null.String        `json:"preferredZeroTrustAlignment" db:"preferred_zero_trust_alignment"`
	PreferredHostingType                null.String        `json:"preferredHostingType" db:"preferred_hosting_type"`
	PreferredHostingLocation            null.String        `json:"preferredHostingLocation" db:"preferred_hosting_location"`
	PreferredHostingCloudStrategy       null.String        `json:"preferredHostingCloudStrategy" db:"preferred_hosting_cloud_strategy"`
	PreferredHostingCloudServiceType    null.String        `json:"preferredHostingCloudServiceType" db:"preferred_hosting_cloud_service_type"`
	PreferredHasUI                      null.String        `json:"preferredHasUI" db:"preferred_has_ui"`
	PreferredPros                       null.String        `json:"preferredPros" db:"preferred_pros"`
	PreferredCons                       null.String        `json:"preferredCons" db:"preferred_cons"`
	PreferredCostSavings                null.String        `json:"preferredCostSavings" db:"preferred_cost_savings"`
	PreferredWorkforceTrainingReqs      null.String        `json:"preferredWorkforceTrainingReqs" db:"preferred_workforce_training_reqs"`
	AlternativeATitle                   null.String        `json:"alternativeATitle" db:"alternative_a_title"`
	AlternativeASummary                 null.String        `json:"alternativeASummary" db:"alternative_a_summary"`
	AlternativeAAcquisitionApproach     null.String        `json:"alternativeAAcquisitionApproach" db:"alternative_a_acquisition_approach"`
	AlternativeATargetContractAwardDate *time.Time         `json:"alternativeATargetContractAwardDate" db:"alternative_a_target_contract_award_date"`
	AlternativeATargetCompletionDate    *time.Time         `json:"alternativeATargetCompletionDate" db:"alternative_a_target_completion_date"`
	AlternativeASecurityIsApproved      null.Bool          `json:"alternativeASecurityIsApproved" db:"alternative_a_security_is_approved"`
	AlternativeASecurityIsBeingReviewed null.String        `json:"alternativeASecurityIsBeingReviewed" db:"alternative_a_security_is_being_reviewed"`
	AlternativeAZeroTrustAlignment      null.String        `json:"alternativeAZeroTrustAlignment" db:"alternative_a_zero_trust_alignment"`
	AlternativeAHostingType             null.String        `json:"alternativeAHostingType" db:"alternative_a_hosting_type"`
	AlternativeAHostingLocation         null.String        `json:"alternativeAHostingLocation" db:"alternative_a_hosting_location"`
	AlternativeAHostingCloudStrategy    null.String        `json:"alternativeAHostingCloudStrategy" db:"alternative_a_hosting_cloud_strategy"`
	AlternativeAHostingCloudServiceType null.String        `json:"alternativeAHostingCloudServiceType" db:"alternative_a_hosting_cloud_service_type"`
	AlternativeAHasUI                   null.String        `json:"alternativeAHasUI" db:"alternative_a_has_ui"`
	AlternativeAPros                    null.String        `json:"alternativeAPros" db:"alternative_a_pros"`
	AlternativeACons                    null.String        `json:"alternativeACons" db:"alternative_a_cons"`
	AlternativeACostSavings             null.String        `json:"alternativeACostSavings" db:"alternative_a_cost_savings"`
	AlternativeAWorkforceTrainingReqs   null.String        `json:"alternativeAWorkforceTrainingReqs" db:"alternative_a_workforce_training_reqs"`
	AlternativeBTitle                   null.String        `json:"alternativeBTitle" db:"alternative_b_title"`
	AlternativeBSummary                 null.String        `json:"alternativeBSummary" db:"alternative_b_summary"`
	AlternativeBAcquisitionApproach     null.String        `json:"alternativeBAcquisitionApproach" db:"alternative_b_acquisition_approach"`
	AlternativeBTargetContractAwardDate *time.Time         `json:"alternativeBTargetContractAwardDate" db:"alternative_b_target_contract_award_date"`
	AlternativeBTargetCompletionDate    *time.Time         `json:"alternativeBTargetCompletionDate" db:"alternative_b_target_completion_date"`
	AlternativeBSecurityIsApproved      null.Bool          `json:"alternativeBSecurityIsApproved" db:"alternative_b_security_is_approved"`
	AlternativeBSecurityIsBeingReviewed null.String        `json:"alternativeBSecurityIsBeingReviewed" db:"alternative_b_security_is_being_reviewed"`
	AlternativeBZeroTrustAlignment      null.String        `json:"alternativeBZeroTrustAlignment" db:"alternative_b_zero_trust_alignment"`
	AlternativeBHostingType             null.String        `json:"alternativeBHostingType" db:"alternative_b_hosting_type"`
	AlternativeBHostingLocation         null.String        `json:"alternativeBHostingLocation" db:"alternative_b_hosting_location"`
	AlternativeBHostingCloudStrategy    null.String        `json:"alternativeBHostingCloudStrategy" db:"alternative_b_hosting_cloud_strategy"`
	AlternativeBHostingCloudServiceType null.String        `json:"alternativeBHostingCloudServiceType" db:"alternative_b_hosting_cloud_service_type"`
	AlternativeBHasUI                   null.String        `json:"alternativeBHasUI" db:"alternative_b_has_ui"`
	AlternativeBPros                    null.String        `json:"alternativeBPros" db:"alternative_b_pros"`
	AlternativeBCons                    null.String        `json:"alternativeBCons" db:"alternative_b_cons"`
	AlternativeBCostSavings             null.String        `json:"alternativeBCostSavings" db:"alternative_b_cost_savings"`
	AlternativeBWorkforceTrainingReqs   null.String        `json:"alternativeBWorkforceTrainingReqs" db:"alternative_b_workforce_training_reqs"`
	CreatedAt                           *time.Time         `json:"createdAt" db:"created_at"`
	UpdatedAt                           *time.Time         `json:"updatedAt" db:"updated_at"`
	ArchivedAt                          *time.Time         `db:"archived_at"`

	// TODO: these fields are unused in GQL Schema but still exist as DB columns.
	// Write a migration to drop these columns
	// See https://jiraent.cms.gov/browse/EASI-1693
	InitialSubmittedAt *time.Time `json:"initialSubmittedAt" db:"initial_submitted_at"`
	LastSubmittedAt    *time.Time `json:"lastSubmittedAt" db:"last_submitted_at"`
}

// TODO: NJD - do I needto do something similar with ProposedSolutions?

// BusinessCaseWithCosts is a helper to allow for legacy REST code
// to function that combines lifecycle costs with the Business Case model
type BusinessCaseWithCosts struct {
	BusinessCase
	LifecycleCostLines EstimatedLifecycleCosts `json:"lifecycleCostLines" db:"lifecycle_cost_lines"`
}

// BusinessCases is the model for a list of Business Cases
type BusinessCases []BusinessCase

func (b BusinessCase) GetMappingKey() uuid.UUID {
	return b.SystemIntakeID
}
func (b BusinessCase) GetMappingVal() *BusinessCase {
	return &b
}
