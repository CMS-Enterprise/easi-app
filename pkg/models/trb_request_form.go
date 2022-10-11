package models

import (
	"github.com/google/uuid"
	"github.com/lib/pq"
)

// TRBWhereInProcessOption is an enumeration of possible responses to the "where are you in the
// process" question on the TRB request form
type TRBWhereInProcessOption string

const (
	// TRBWhereInProcessOptionIHaveAnIdeaAndWantToBrainstorm TODO
	TRBWhereInProcessOptionIHaveAnIdeaAndWantToBrainstorm TRBWhereInProcessOption = "I_HAVE_AN_IDEA_AND_WANT_TO_BRAINSTORM"

	// TRBWhereInProcessOptionContractingWorkHasStarted TODO
	TRBWhereInProcessOptionContractingWorkHasStarted TRBWhereInProcessOption = "CONTRACTING_WORK_HAS_STARTED"

	// TRBWhereInProcessOptionDevelopmentHasRecentlyStarted TODO
	TRBWhereInProcessOptionDevelopmentHasRecentlyStarted TRBWhereInProcessOption = "DEVELOPMENT_HAS_RECENTLY_STARTED"

	// TRBWhereInProcessOptionDevelopmentIsSignificantlyUnderway TODO
	TRBWhereInProcessOptionDevelopmentIsSignificantlyUnderway TRBWhereInProcessOption = "DEVELOPMENT_IS_SIGNIFICANTLY_UNDERWAY"

	// TRBWhereInProcessOptionTheSystemIsInOperationAndMaintenance TODO
	TRBWhereInProcessOptionTheSystemIsInOperationAndMaintenance TRBWhereInProcessOption = "THE_SYSTEM_IS_IN_OPERATION_AND_MAINTENANCE"

	// TRBWhereInProcessOptionOther TODO
	TRBWhereInProcessOptionOther TRBWhereInProcessOption = "OTHER"

	// TRBWhereInProcessOptionUnknown TODO
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
