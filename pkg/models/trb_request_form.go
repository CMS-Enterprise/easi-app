package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

// NewTRBRequestForm instantiates a TRB request form with default field values
func NewTRBRequestForm(createdBy string) *TRBRequestForm {
	return &TRBRequestForm{
		BaseStruct:   NewBaseStruct(createdBy),
		Status:       TRBFormStatusReadyToStart, // This should could be handled by SQL default values
		CollabGroups: pq.StringArray{},          // This also might be more appropriate not initialized, and handled as null in SQL

	}

}

// TRBRequestForm represents the data entered into the TRB request form
type TRBRequestForm struct {
	BaseStruct
	TRBRequestID             uuid.UUID                `json:"trbRequestId" db:"trb_request_id"`
	Status                   TRBFormStatus            `json:"status" db:"status"`
	Component                *string                  `json:"component" db:"component"`
	NeedsAssistanceWith      *string                  `json:"needsAssistanceWith" db:"needs_assistance_with"`
	HasSolutionInMind        *bool                    `json:"hasSolutionInMind" db:"has_solution_in_mind"`
	ProposedSolution         *string                  `json:"proposedSolution" db:"proposed_solution"`
	WhereInProcess           *TRBWhereInProcessOption `json:"whereInProcess" db:"where_in_process"`
	WhereInProcessOther      *string                  `json:"whereInProcessOther" db:"where_in_process_other"`
	HasExpectedStartEndDates *bool                    `json:"hasExpectedStartEndDates" db:"has_expected_start_end_dates"`
	ExpectedStartDate        *time.Time               `json:"expectedStartDate" db:"expected_start_date"`
	ExpectedEndDate          *time.Time               `json:"expectedEndDate" db:"expected_end_date"`
	// FundingSources                   []*TRBFundingSource      `json:"fundingSources"`
	CollabGroups                     pq.StringArray `json:"collabGroups" db:"collab_groups"`
	CollabDateSecurity               *string        `json:"collabDateSecurity" db:"collab_date_security"`
	CollabDateEnterpriseArchitecture *string        `json:"collabDateEnterpriseArchitecture" db:"collab_date_enterprise_architecture"`
	CollabDateCloud                  *string        `json:"collabDateCloud" db:"collab_date_cloud"`
	CollabDatePrivacyAdvisor         *string        `json:"collabDatePrivacyAdvisor" db:"collab_date_privacy_advisor"`
	CollabDateGovernanceReviewBoard  *string        `json:"collabDateGovernanceReviewBoard" db:"collab_date_governance_review_board"`
	CollabDateOther                  *string        `json:"collabDateOther" db:"collab_date_other"`
	CollabGroupOther                 *string        `json:"collabGroupOther" db:"collab_group_other"`
	CollabGRBConsultRequested        *bool          `json:"collabGRBConsultRequested" db:"collab_grb_consult_requested"`
	SubjectAreaOptions               pq.StringArray `json:"subjectAreaOptions" db:"subject_area_options"`
	SubjectAreaOptionOther           *string        `json:"subjectAreaOptionOther" db:"subject_area_option_other"`
	SubmittedAt                      *time.Time     `json:"submittedAt" db:"submitted_at"`
}
