package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

// TRBWhereInProcessOption is an enumeration of possible responses to the "where are you in the
// process" question on the TRB request form
type TRBWhereInProcessOption string

const (
	// TRBWhereInProcessOptionIHaveAnIdeaAndWantToBrainstorm represents selection indicating the "I
	// have an idea and want to brainstorm" option
	TRBWhereInProcessOptionIHaveAnIdeaAndWantToBrainstorm TRBWhereInProcessOption = "I_HAVE_AN_IDEA_AND_WANT_TO_BRAINSTORM"

	// TRBWhereInProcessOptionContractingWorkHasStarted  represents selection indicating the "contracting work has started" option
	TRBWhereInProcessOptionContractingWorkHasStarted TRBWhereInProcessOption = "CONTRACTING_WORK_HAS_STARTED"

	// TRBWhereInProcessOptionDevelopmentHasRecentlyStarted  represents selection indicating the "development has recently started" option
	TRBWhereInProcessOptionDevelopmentHasRecentlyStarted TRBWhereInProcessOption = "DEVELOPMENT_HAS_RECENTLY_STARTED"

	// TRBWhereInProcessOptionDevelopmentIsSignificantlyUnderway  represents selection indicating
	// the "development is significantly underway" option
	TRBWhereInProcessOptionDevelopmentIsSignificantlyUnderway TRBWhereInProcessOption = "DEVELOPMENT_IS_SIGNIFICANTLY_UNDERWAY"

	// TRBWhereInProcessOptionTheSystemIsInOperationAndMaintenance  represents selection indicating the "the system is in operation and maintenance" option
	TRBWhereInProcessOptionTheSystemIsInOperationAndMaintenance TRBWhereInProcessOption = "THE_SYSTEM_IS_IN_OPERATION_AND_MAINTENANCE"

	// TRBWhereInProcessOptionOther  represents selection indicating the "other" option
	TRBWhereInProcessOptionOther TRBWhereInProcessOption = "OTHER"

	// TRBWhereInProcessOptionUnknown  represents selection indicating the "unknown" option
	TRBWhereInProcessOptionUnknown TRBWhereInProcessOption = "UNKNOWN"
)

// TRBCollabGroupOption is an enumeration of the possible OIT collaboration groups that can be
// selected for a TRB request form
type TRBCollabGroupOption string

const (
	// TRBCollabGroupOptionSecurity TODO
	TRBCollabGroupOptionSecurity TRBCollabGroupOption = "SECURITY"

	// TRBCollabGroupOptionEnterpriseArchitecture TODO
	TRBCollabGroupOptionEnterpriseArchitecture TRBCollabGroupOption = "ENTERPRISE_ARCHITECTURE"

	// TRBCollabGroupOptionCloud TODO
	TRBCollabGroupOptionCloud TRBCollabGroupOption = "CLOUD"

	// TRBCollabGroupOptionPrivacyAdvisor TODO
	TRBCollabGroupOptionPrivacyAdvisor TRBCollabGroupOption = "PRIVACY_ADVISOR"

	// TRBCollabGroupOptionGovernanceReviewBoard TODO
	TRBCollabGroupOptionGovernanceReviewBoard TRBCollabGroupOption = "GOVERNANCE_REVIEW_BOARD"

	// TRBCollabGroupOptionOther TODO
	TRBCollabGroupOptionOther TRBCollabGroupOption = "OTHER"
)

// TRBRequestForm represents the data entered into the TRB request form
type TRBRequestForm struct {
	baseStruct
	TRBRequestID                     uuid.UUID                `json:"trbRequestId" db:"trb_request_id"`
	Component                        *string                  `json:"component" db:"component"`
	NeedsAssistanceWith              *string                  `json:"needsAssistanceWith" db:"needs_assistance_with"`
	HasSolutionInMind                *bool                    `json:"hasSolutionInMind" db:"has_solution_in_mind"`
	ProposedSolutionDescription      *string                  `json:"proposedSolutionDescription" db:"proposed_solution_description"`
	WhereInProcess                   *TRBWhereInProcessOption `json:"whereInProcess" db:"where_in_process"`
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
	CollabGroupOtherDescription      *string                  `json:"collabGroupOtherDescription" db:"collab_group_other_description"`
}
