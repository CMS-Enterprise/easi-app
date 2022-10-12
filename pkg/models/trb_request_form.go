package models

import (
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
	TRBRequestID             uuid.UUID               `json:"trbRequestId" db:"trb_request_id"`
	Component                string                  `json:"component" db:"component"`
	NeedsAssistanceWith      string                  `json:"needsAssistanceWith" db:"needs_assistance_with"`
	HasSolutionInMind        bool                    `json:"hasSolutionInMind" db:"has_solution_in_mind"`
	WhereInProcess           TRBWhereInProcessOption `json:"whereInProcess" db:"where_in_process"`
	HasExpectedStartEndDates bool                    `json:"hasExpectedStartEndDates" db:"has_expected_start_end_dates"`
	CollabGroups             pq.StringArray          `json:"collabGroups" db:"collab_groups"`
}
