package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

// TRBWhereInProcessOption is an enumeration of possible responses to the "Where are you in
// your process?" question on the TRB request form
type TRBWhereInProcessOption string

// These are the individual options for the response to the "Where are you in your process?"
// question on the TRB request form
const (
	TRBWhereInProcessOptionIHaveAnIdeaAndWantToBrainstorm       TRBWhereInProcessOption = "I_HAVE_AN_IDEA_AND_WANT_TO_BRAINSTORM"
	TRBWhereInProcessOptionContractingWorkHasStarted            TRBWhereInProcessOption = "CONTRACTING_WORK_HAS_STARTED"
	TRBWhereInProcessOptionDevelopmentHasRecentlyStarted        TRBWhereInProcessOption = "DEVELOPMENT_HAS_RECENTLY_STARTED"
	TRBWhereInProcessOptionDevelopmentIsSignificantlyUnderway   TRBWhereInProcessOption = "DEVELOPMENT_IS_SIGNIFICANTLY_UNDERWAY"
	TRBWhereInProcessOptionTheSystemIsInOperationAndMaintenance TRBWhereInProcessOption = "THE_SYSTEM_IS_IN_OPERATION_AND_MAINTENANCE"
	TRBWhereInProcessOptionOther                                TRBWhereInProcessOption = "OTHER"
	TRBWhereInProcessOptionUnknown                              TRBWhereInProcessOption = "UNKNOWN"
)

// TRBCollabGroupOption is an enumeration of the possible OIT collaboration groups that can be
// selected for a TRB request form
type TRBCollabGroupOption string

// These are the individual options for responses to the "Select any other OIT groups that you
// have met with or collaborated with" on the TRB request form
const (
	TRBCollabGroupOptionSecurity               TRBCollabGroupOption = "SECURITY"
	TRBCollabGroupOptionEnterpriseArchitecture TRBCollabGroupOption = "ENTERPRISE_ARCHITECTURE"
	TRBCollabGroupOptionCloud                  TRBCollabGroupOption = "CLOUD"
	TRBCollabGroupOptionPrivacyAdvisor         TRBCollabGroupOption = "PRIVACY_ADVISOR"
	TRBCollabGroupOptionGovernanceReviewBoard  TRBCollabGroupOption = "GOVERNANCE_REVIEW_BOARD"
	TRBCollabGroupOptionOther                  TRBCollabGroupOption = "OTHER"
)

// TRBRequestForm represents the data entered into the TRB request form
type TRBRequestForm struct {
	baseStruct
	TRBRequestID                     uuid.UUID                `json:"trbRequestId" db:"trb_request_id"`
	Component                        *string                  `json:"component" db:"component"`
	NeedsAssistanceWith              *string                  `json:"needsAssistanceWith" db:"needs_assistance_with"`
	HasSolutionInMind                *bool                    `json:"hasSolutionInMind" db:"has_solution_in_mind"`
	ProposedSolution                 *string                  `json:"proposedSolution" db:"proposed_solution"`
	WhereInProcess                   *TRBWhereInProcessOption `json:"whereInProcess" db:"where_in_process"`
	WhereInProcessOther              *string                  `json:"whereInProcessOther" db:"where_in_process_other"`
	HasExpectedStartEndDates         *bool                    `json:"hasExpectedStartEndDates" db:"has_expected_start_end_dates"`
	ExpectedStartDate                *time.Time               `json:"expectedStartDate" db:"expected_start_date"`
	ExpectedEndDate                  *time.Time               `json:"expectedEndDate" db:"expected_end_date"`
	CollabGroups                     pq.StringArray           `json:"collabGroups" db:"collab_groups"`
	CollabDateSecurity               *time.Time               `json:"collabDateSecurity" db:"collab_date_security"`
	CollabDateEnterpriseArchitecture *time.Time               `json:"collabDateEnterpriseArchitecture" db:"collab_date_enterprise_architecture"`
	CollabDateCloud                  *time.Time               `json:"collabDateCloud" db:"collab_date_cloud"`
	CollabDatePrivacyAdvisor         *time.Time               `json:"collabDatePrivacyAdvisor" db:"collab_date_privacy_advisor"`
	CollabDateGovernanceReviewBoard  *time.Time               `json:"collabDateGovernanceReviewBoard" db:"collab_date_governance_review_board"`
	CollabDateOther                  *time.Time               `json:"collabDateOther" db:"collab_date_other"`
	CollabGroupOther                 *string                  `json:"collabGroupOther" db:"collab_group_other"`
}
