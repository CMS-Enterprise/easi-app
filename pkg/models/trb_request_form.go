package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

// TRBFormStatus is an enumeration of the possible statuses of a TRBRequestForm
type TRBFormStatus string

// These are the possible statuses for a TRB request form
const (
	TRBFormStatusReadyToStart TRBFormStatus = "READY_TO_START"
	TRBFormStatusInProgress   TRBFormStatus = "IN_PROGRESS"
	TRBFormStatusCompleted    TRBFormStatus = "COMPLETED"
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

// TRBSubjectAreaOption is an enum of the possible answers to the input on the TRB "Subject Areas" page
type TRBSubjectAreaOption string

// These are the individual options for the "technical reference architecture" input
const (
	TRBSubjectAreaOptionAccessControlAndIdentityMgmt   TRBSubjectAreaOption = "ACCESS_CONTROL_AND_IDENTITY_MANAGEMENT"
	TRBSubjectAreaOptionAccessibilityCompliance        TRBSubjectAreaOption = "ACCESSIBILITY_COMPLIANCE"
	TRBSubjectAreaOptionAssistanceWithSystemConceptDev TRBSubjectAreaOption = "ASSISTANCE_WITH_SYSTEM_CONCEPT_DEVELOPMENT"
	TRBSubjectAreaOptionBusinessIntelligence           TRBSubjectAreaOption = "BUSINESS_INTELLIGENCE"
	TRBSubjectAreaOptionCloudMigration                 TRBSubjectAreaOption = "CLOUD_MIGRATION"
	TRBSubjectAreaOptionContainersAndMicroservices     TRBSubjectAreaOption = "CONTAINERS_AND_MICROSERVICES"
	TRBSubjectAreaOptionDisasterRecovery               TRBSubjectAreaOption = "DISASTER_RECOVERY"
	TRBSubjectAreaOptionEmailIntegration               TRBSubjectAreaOption = "EMAIL_INTEGRATION"
	TRBSubjectAreaOptionEnterpriseDataLakeIntegration  TRBSubjectAreaOption = "ENTERPRISE_DATA_LAKE_INTEGRATION"
	TRBSubjectAreaOptionFrameworkOrToolAlternatives    TRBSubjectAreaOption = "FRAMEWORK_OR_TOOL_ALTERNATIVES"
	TRBSubjectAreaOptionOpenSourceSoftware             TRBSubjectAreaOption = "OPEN_SOURCE_SOFTWARE"
	TRBSubjectAreaOptionPortalIntegration              TRBSubjectAreaOption = "PORTAL_INTEGRATION"
	TRBSubjectAreaOptionTechnicalReferenceArchitecture TRBSubjectAreaOption = "TECHNICAL_REFERENCE_ARCHITECTURE"
	TRBSubjectAreaOptionSystemArchitectureReview       TRBSubjectAreaOption = "SYSTEM_ARCHITECTURE_REVIEW"
	TRBSubjectAreaOptionSystemDispositionPlanning      TRBSubjectAreaOption = "SYSTEM_DISPOSITION_PLANNING"
	TRBSubjectAreaOptionWebServicesAndAPIs             TRBSubjectAreaOption = "WEB_SERVICES_AND_APIS"
	TRBSubjectAreaOptionWebBasedUIService              TRBSubjectAreaOption = "WEB_BASED_UI_SERVICE"
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

func (f TRBRequestForm) GetMappingKey() uuid.UUID {
	return f.TRBRequestID
}
func (f TRBRequestForm) GetMappingVal() *TRBRequestForm {
	return &f
}
