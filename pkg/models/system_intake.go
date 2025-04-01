package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
	"github.com/guregu/null/zero"
	"github.com/lib/pq"
)

// SystemIntakeRequestType represents the type of a system intake
type SystemIntakeRequestType string

const (
	// SystemIntakeRequestTypeNEW captures enum value of "NEW"
	SystemIntakeRequestTypeNEW SystemIntakeRequestType = "NEW"
	// SystemIntakeRequestTypeMAJORCHANGES captures enum value of "MAJOR_CHANGES"
	SystemIntakeRequestTypeMAJORCHANGES SystemIntakeRequestType = "MAJOR_CHANGES"
	// SystemIntakeRequestTypeRECOMPETE captures enum value of "RECOMPETE"
	SystemIntakeRequestTypeRECOMPETE SystemIntakeRequestType = "RECOMPETE"
	// SystemIntakeRequestTypeSHUTDOWN captures enum value of "SHUTDOWN"
	SystemIntakeRequestTypeSHUTDOWN SystemIntakeRequestType = "SHUTDOWN"
)

// SystemIntakeState represents whether the intake is open or closed
type SystemIntakeState string

const (
	// SystemIntakeStateOpen captures enum value "OPEN"
	SystemIntakeStateOpen SystemIntakeState = "OPEN"
	// SystemIntakeStateClosed captures enum value "CLOSED"
	SystemIntakeStateClosed SystemIntakeState = "CLOSED"
)

// SystemIntakeStep represents the current step in the intake process
type SystemIntakeStep string

const (
	// SystemIntakeStepINITIALFORM captures enum value "INITIAL_REQUEST_FORM"
	SystemIntakeStepINITIALFORM SystemIntakeStep = "INITIAL_REQUEST_FORM"
	// SystemIntakeStepDRAFTBIZCASE captures enum value "DRAFT_BUSINESS_CASE"
	SystemIntakeStepDRAFTBIZCASE SystemIntakeStep = "DRAFT_BUSINESS_CASE"
	// SystemIntakeStepGRTMEETING captures enum value "GRT_MEETING"
	SystemIntakeStepGRTMEETING SystemIntakeStep = "GRT_MEETING"
	// SystemIntakeStepFINALBIZCASE captures enum value "FINAL_BUSINESS_CASE"
	SystemIntakeStepFINALBIZCASE SystemIntakeStep = "FINAL_BUSINESS_CASE"
	// SystemIntakeStepGRBMEETING captures enum value "GRB_MEETING"
	SystemIntakeStepGRBMEETING SystemIntakeStep = "GRB_MEETING"
	// SystemIntakeStepDECISION captures enum value "DECISION_AND_NEXT_STEPS"
	SystemIntakeStepDECISION SystemIntakeStep = "DECISION_AND_NEXT_STEPS"
	// SystemIntakeStepGRBREVIEW captures enum value "GRB_REVIEW"
	SystemIntakeStepGRBREVIEW SystemIntakeStep = "GRB_REVIEW"
)

// SystemIntakeLCIDStatus represents the possible statuses that an issued LCID can be in
type SystemIntakeLCIDStatus string

// possible values of SystemIntakeLCIDStatus - corresponds to SystemIntakeLCIDStatus enum in GraphQL schema
const (
	SystemIntakeLCIDStatusIssued  SystemIntakeLCIDStatus = "ISSUED"
	SystemIntakeLCIDStatusExpired SystemIntakeLCIDStatus = "EXPIRED"
	SystemIntakeLCIDStatusRetired SystemIntakeLCIDStatus = "RETIRED"
)

type SystemIntakeSoftwareAcquisitionMethod string

const (
	SystemIntakeSoftwareAcquisitionContractorFurnished SystemIntakeSoftwareAcquisitionMethod = "CONTRACTOR_FURNISHED"
	SystemIntakeSoftwareAcquisitionFedFurnished        SystemIntakeSoftwareAcquisitionMethod = "FED_FURNISHED"
	SystemIntakeSoftwareAcquisitionELAOrInternal       SystemIntakeSoftwareAcquisitionMethod = "ELA_OR_INTERNAL"
	SystemIntakeSoftwareAcquisitionNotYetDetermined    SystemIntakeSoftwareAcquisitionMethod = "NOT_YET_DETERMINED"
	SystemIntakeSoftwareAcquisitionOther               SystemIntakeSoftwareAcquisitionMethod = "OTHER"
)

type SystemIntakeGRBReviewType string

const (
	SystemIntakeGRBReviewTypeStandard SystemIntakeGRBReviewType = "STANDARD"
	SystemIntakeGRBReviewTypeAsync    SystemIntakeGRBReviewType = "ASYNC"
)

// SystemIntake is the model for the system intake form
type SystemIntake struct {
	ID                                                uuid.UUID                    `json:"id"`
	EUAUserID                                         null.String                  `json:"euaUserId" db:"eua_user_id"`
	State                                             SystemIntakeState            `json:"state" db:"state"`
	Step                                              SystemIntakeStep             `json:"step" db:"step"`
	RequestType                                       SystemIntakeRequestType      `json:"requestType" db:"request_type"`
	Requester                                         string                       `json:"requester"`
	Component                                         null.String                  `json:"component"`
	BusinessOwner                                     null.String                  `json:"businessOwner" db:"business_owner"`
	BusinessOwnerComponent                            null.String                  `json:"businessOwnerComponent" db:"business_owner_component"`
	ProductManager                                    null.String                  `json:"productManager" db:"product_manager"`
	ProductManagerComponent                           null.String                  `json:"productManagerComponent" db:"product_manager_component"`
	ISSO                                              null.String                  `json:"isso"`
	ISSOName                                          null.String                  `json:"issoName" db:"isso_name"`
	TRBCollaborator                                   null.String                  `json:"trbCollaborator" db:"trb_collaborator"`
	TRBCollaboratorName                               null.String                  `json:"trbCollaboratorName" db:"trb_collaborator_name"`
	OITSecurityCollaborator                           null.String                  `json:"oitSecurityCollaborator" db:"oit_security_collaborator"`
	OITSecurityCollaboratorName                       null.String                  `json:"oitSecurityCollaboratorName" db:"oit_security_collaborator_name"`
	EACollaborator                                    null.String                  `json:"eaCollaborator" db:"ea_collaborator"`
	EACollaboratorName                                null.String                  `json:"eaCollaboratorName" db:"ea_collaborator_name"`
	ProjectName                                       null.String                  `json:"projectName" db:"project_name"`
	ProjectAcronym                                    null.String                  `json:"projectAcronym" db:"project_acronym"`
	BusinessNeed                                      null.String                  `json:"businessNeed" db:"business_need"`
	Solution                                          null.String                  `json:"solution"`
	ProcessStatus                                     null.String                  `json:"processStatus" db:"process_status"`
	EASupportRequest                                  null.Bool                    `json:"eaSupportRequest" db:"ea_support_request"`
	ExistingContract                                  null.String                  `json:"existingContract" db:"existing_contract"`
	CostIncrease                                      null.String                  `json:"costIncrease" db:"cost_increase"`
	CostIncreaseAmount                                null.String                  `json:"costIncreaseAmount" db:"cost_increase_amount"`
	CurrentAnnualSpending                             null.String                  `json:"currentAnnualSpending" db:"current_annual_spending"`
	CurrentAnnualSpendingITPortion                    null.String                  `json:"currentAnnualSpendingITPortion" db:"current_annual_spending_it_portion"`
	PlannedYearOneSpending                            null.String                  `json:"plannedYearOneSpending" db:"planned_year_one_spending"`
	PlannedYearOneSpendingITPortion                   null.String                  `json:"plannedYearOneSpendingITPortion" db:"planned_year_one_spending_it_portion"`
	Contractor                                        null.String                  `json:"contractor" db:"contractor"`
	ContractVehicle                                   null.String                  `json:"contractVehicle" db:"contract_vehicle"`
	ContractStartDate                                 *time.Time                   `json:"contractStartDate" db:"contract_start_date"`
	ContractStartMonth                                null.String                  `json:"contractStartMonth" db:"contract_start_month"`
	ContractStartYear                                 null.String                  `json:"contractStartYear" db:"contract_start_year"`
	ContractEndDate                                   *time.Time                   `json:"contractEndDate" db:"contract_end_date"`
	ContractEndMonth                                  null.String                  `json:"contractEndMonth" db:"contract_end_month"`
	ContractEndYear                                   null.String                  `json:"contractEndYear" db:"contract_end_year"`
	CreatedAt                                         *time.Time                   `json:"createdAt" db:"created_at"`
	UpdatedAt                                         *time.Time                   `json:"updatedAt" db:"updated_at"`
	SubmittedAt                                       *time.Time                   `json:"submittedAt" db:"submitted_at"`
	DecidedAt                                         *time.Time                   `json:"decidedAt" db:"decided_at"`
	ArchivedAt                                        *time.Time                   `json:"archivedAt" db:"archived_at"`
	GRTDate                                           *time.Time                   `json:"grtDate" db:"grt_date"`
	GRBDate                                           *time.Time                   `json:"grbDate" db:"grb_date"`
	GRBReviewStartedAt                                *time.Time                   `json:"grbReviewStartedAt" db:"grb_review_started_at"`
	AlfabetID                                         null.String                  `json:"alfabetID" db:"alfabet_id"`
	GrtReviewEmailBody                                null.String                  `json:"grtReviewEmailBody" db:"grt_review_email_body"`
	RequesterEmailAddress                             null.String                  `json:"requesterEmailAddress" db:"requester_email_address"` // Deprecated
	BusinessCaseID                                    *uuid.UUID                   `json:"businessCase" db:"business_case_id"`
	LifecycleID                                       null.String                  `json:"lcid" db:"lcid"`
	LifecycleExpiresAt                                *time.Time                   `json:"lcidExpiresAt" db:"lcid_expires_at" gqlgen:"lcidExpiresAt"`
	LifecycleScope                                    *HTML                        `json:"lcidScope" db:"lcid_scope"`
	LifecycleCostBaseline                             null.String                  `json:"lcidCostBaseline" db:"lcid_cost_baseline"`
	LifecycleExpirationAlertTS                        *time.Time                   `json:"lcidExpirationAlertTS" db:"lcid_expiration_alert_ts"`
	LifecycleRetiresAt                                *time.Time                   `json:"lcidRetiresAt" db:"lcid_retires_at" gqlgen:"lcidRetiresAt"`
	LifecycleIssuedAt                                 *time.Time                   `json:"lcidIssuedAt" db:"lcid_issued_at" gqlgen:"lcidIssuedAt"`
	DecisionNextSteps                                 *HTML                        `json:"decisionNextSteps" db:"decision_next_steps"`
	RejectionReason                                   *HTML                        `json:"rejectionReason" db:"rejection_reason"`
	AdminLead                                         null.String                  `json:"adminLead" db:"admin_lead"`
	CedarSystemID                                     null.String                  `json:"cedarSystemId" db:"cedar_system_id"`
	ExistingFunding                                   null.Bool                    `json:"existingFunding" db:"existing_funding"`
	FundingSource                                     null.String                  `json:"fundingSource" db:"funding_source"`
	FundingNumber                                     null.String                  `json:"fundingNumber" db:"funding_number"`
	FundingSources                                    []*SystemIntakeFundingSource `json:"fundingSources"`
	HasUIChanges                                      null.Bool                    `json:"hasUiChanges" db:"has_ui_changes"`
	UsesAITech                                        null.Bool                    `json:"usesAiTech" db:"uses_ai_tech"`
	UsingSoftware                                     zero.String                  `json:"usingSoftware" db:"using_software"`
	AcquisitionMethods                                pq.StringArray               `json:"acquisitionMethods" db:"acquisition_methods"`
	RequestFormState                                  SystemIntakeFormState        `json:"requestFormState" db:"request_form_state"`
	DraftBusinessCaseState                            SystemIntakeFormState        `json:"draftBusinessCaseState" db:"draft_business_case_state"`
	FinalBusinessCaseState                            SystemIntakeFormState        `json:"finalBusinessCaseState" db:"final_business_case_state"`
	DecisionState                                     SystemIntakeDecisionState    `json:"decisionState" db:"decision_state"`
	TRBFollowUpRecommendation                         *SystemIntakeTRBFollowUp     `json:"trbFollowUpRecommendation" db:"trb_follow_up_recommendation"`
	ContractName                                      zero.String                  `json:"contractName" db:"contract_name"`
	SystemRelationType                                *RequestRelationType         `json:"relationType" db:"system_relation_type"`
	GrbPresentationDeckRequesterReminderEmailSentTime *time.Time                   `json:"grbPresentationDeckRequesterReminderEmailSentTime" db:"grb_presentation_deck_requester_reminder_email_sent_time"`
	GrbReviewType                                     SystemIntakeGRBReviewType    `json:"grbReviewType" db:"grb_review_type"`
	GrbReviewAsyncReportingDate                       *time.Time                   `json:"grbReviewAsyncReportingDate" db:"grb_review_async_reporting_date"`
	GrbReviewAsyncRecordingTime                       *time.Time                   `json:"grbReviewAsyncRecordingTime" db:"grb_review_async_recording_time"`
	GrbReviewAsyncEndDate                             *time.Time                   `json:"grbReviewAsyncEndDate" db:"grb_review_async_end_date"`
	GrbReviewAsyncGRBMeetingTime                      *time.Time                   `json:"grbReviewAsyncGRBMeetingTime" db:"grb_review_async_grb_meeting_time"`
	GrbReviewAsyncManualEndDate                       *time.Time                   `json:"grbReviewAsyncManualEndDate" db:"grb_review_async_manual_end_date"`
	GrbReviewReminderLastSent                         *time.Time                   `json:"grbReviewReminderLastSent" db:"grb_review_reminder_last_sent"`
}

// SystemIntakes is a list of System Intakes
type SystemIntakes []SystemIntake

// SystemIntakeFormState represents the possible states of of any System Intake form types.
type SystemIntakeFormState string

// These are the options for SystemIntakeRequestFormState
const (
	SIRFSNotStarted     SystemIntakeFormState = "NOT_STARTED"
	SIRFSInProgress     SystemIntakeFormState = "IN_PROGRESS"
	SIRFSEditsRequested SystemIntakeFormState = "EDITS_REQUESTED"
	SIRFSSubmitted      SystemIntakeFormState = "SUBMITTED"
)

// SystemIntakeDecisionState represents the types of SystemIntakeDecisionState types.
type SystemIntakeDecisionState string

// These are the options for SystemIntakeDecisionState
const (
	SIDSNoDecision    SystemIntakeDecisionState = "NO_DECISION"
	SIDSLcidIssued    SystemIntakeDecisionState = "LCID_ISSUED"
	SIDSNotApproved   SystemIntakeDecisionState = "NOT_APPROVED"
	SIDSNotGovernance SystemIntakeDecisionState = "NOT_GOVERNANCE"
)

// SystemIntakeMeetingState is the state for any meeting for a system intake
type SystemIntakeMeetingState string

// These are the options for SystemIntakeMeetingState
const (
	SIMSScheduled    SystemIntakeMeetingState = "SCHEDULED"
	SIMSNotScheduled SystemIntakeMeetingState = "NOT_SCHEDULED"
)

// GRTMeetingState returns if a GRTMeeting has been scheduled or not
func (si *SystemIntake) GRTMeetingState() SystemIntakeMeetingState {
	return isMeetingScheduled(si.GRTDate)
}

// GRBMeetingState returns if a GRBMeeting has been scheduled or not
func (si *SystemIntake) GRBMeetingState() SystemIntakeMeetingState {
	return isMeetingScheduled(si.GRBDate)
}

func isMeetingScheduled(date *time.Time) SystemIntakeMeetingState {
	if date == nil {
		return SIMSNotScheduled
	}
	return SIMSScheduled
}

// SystemIntakeTRBFollowUp represents whether a requester is recommended to follow up by consulting the TRB
type SystemIntakeTRBFollowUp string

// These are the options for SystemIntakeTRBFollowUp
const (
	TRBFRStronglyRecommended       SystemIntakeTRBFollowUp = "STRONGLY_RECOMMENDED"
	TRBFRRecommendedButNotCritical SystemIntakeTRBFollowUp = "RECOMMENDED_BUT_NOT_CRITICAL"
	TRBFRNotRecommended            SystemIntakeTRBFollowUp = "NOT_RECOMMENDED"
)

// LCIDStatus returns the status of this intake's LCID, if present
func (si *SystemIntake) LCIDStatus(currentTime time.Time) *SystemIntakeLCIDStatus {
	// copies of the constants, declared as local variables instead of constants so we can get pointers to them,
	// which we need so we can return a *SystemIntakeLCIDStatus that can be nil
	issuedStatus := SystemIntakeLCIDStatusIssued
	expiredStatus := SystemIntakeLCIDStatusExpired
	retiredStatus := SystemIntakeLCIDStatusRetired

	if si == nil || si.LifecycleID.ValueOrZero() == "" {
		return nil
	}

	// check retirement date first - if both retirement date and expiration date have passed, retirement takes precedence
	if si.LifecycleRetiresAt != nil && si.LifecycleRetiresAt.Before(currentTime) {
		return &retiredStatus
	}

	// LifecycleExpiresAt should always be non-nil if an LCID has been issued; check just to avoid a panic if there's inconsistent data
	if si.LifecycleExpiresAt != nil && si.LifecycleExpiresAt.Before(currentTime) {
		return &expiredStatus
	}

	return &issuedStatus
}

// RelatedSystemIntake is used when intakes are selected from the DB using linking tables and the related request ID is added as an aliased column.
// This struct with the added related request ID allows for using the mapping helpers in the dataloader package.
type RelatedSystemIntake struct {
	SystemIntake
	RelatedRequestID uuid.UUID `db:"related_request_id"`
}

func (s RelatedSystemIntake) GetMappingKey() uuid.UUID {
	return s.RelatedRequestID
}
func (s RelatedSystemIntake) GetMappingVal() *SystemIntake {
	return &s.SystemIntake
}

type SystemIntakesByCedarSystemIDsRequest struct {
	CedarSystemID string
	State         SystemIntakeState
}

type SystemIntakesByCedarSystemIDsResponse struct {
	CedarSystemID string `db:"system_id"`
	SystemIntake
}

func (s SystemIntakesByCedarSystemIDsResponse) GetMappingKey() string {
	return s.CedarSystemID
}

func (s SystemIntakesByCedarSystemIDsResponse) GetMappingVal() *SystemIntake {
	return &s.SystemIntake
}
