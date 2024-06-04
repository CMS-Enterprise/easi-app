package models

// ITGovTaskStatuses is a helper struct used by GQL to wrap a returned System Intake, so section statuses can be calculated only when requested
type ITGovTaskStatuses struct {
	ParentSystemIntake *SystemIntake
}

// ITGovDecisionStatus represents the types of ITGovDecisionStatus types. This is what the requestor sees for the third task.
type ITGovDecisionStatus string

// These are the options for ITGovDecisionStatus
const (
	ITGDSCantStart ITGovDecisionStatus = "CANT_START"
	ITGDSInReview  ITGovDecisionStatus = "IN_REVIEW"
	ITGDSCompleted ITGovDecisionStatus = "COMPLETED"
)

// ITGovDraftBusinessCaseStatus represents the types of ITGovDraftBusinessCaseStatus types. This is what the requestor sees for the  optional fourth task.
type ITGovDraftBusinessCaseStatus string

// These are the options for ITGovDraftBusinessCaseStatus
const (
	ITGDBCSCantStart      ITGovDraftBusinessCaseStatus = "CANT_START"
	ITGDBCSNotNeeded      ITGovDraftBusinessCaseStatus = "NOT_NEEDED"
	ITGDBCSReady          ITGovDraftBusinessCaseStatus = "READY"
	ITGDBCSInProgress     ITGovDraftBusinessCaseStatus = "IN_PROGRESS"
	ITGDBCSEditsRequested ITGovDraftBusinessCaseStatus = "EDITS_REQUESTED"
	ITGDBCSSubmitted      ITGovDraftBusinessCaseStatus = "SUBMITTED"
	ITGDBCSDone           ITGovDraftBusinessCaseStatus = "DONE"
)

// ITGovGRTStatus represents the types of ITGovGRTStatus types. This is what the requestor sees for the  optional fifth task.
type ITGovGRTStatus string

// These are the options for ITGovGRTStatus
const (
	ITGGRTSCantStart        ITGovGRTStatus = "CANT_START"
	ITGGRTSNotNeeded        ITGovGRTStatus = "NOT_NEEDED"
	ITGGRTSReadyToSchedule  ITGovGRTStatus = "READY_TO_SCHEDULE"
	ITGGRTSScheduled        ITGovGRTStatus = "SCHEDULED"
	ITGGRTSAwaitingDecision ITGovGRTStatus = "AWAITING_DECISION"
	ITGGRTSCompleted        ITGovGRTStatus = "COMPLETED"
)

// ITGovFinalBusinessCaseStatus represents the types of ITGovFinalBusinessCaseStatus types. This is what the requestor sees for the  optional sixth task.
type ITGovFinalBusinessCaseStatus string

// These are the options for ITGovFinalBusinessCaseStatus
const (
	ITGFBCSCantStart      ITGovFinalBusinessCaseStatus = "CANT_START"
	ITGFBCSNotNeeded      ITGovFinalBusinessCaseStatus = "NOT_NEEDED"
	ITGFBCSReady          ITGovFinalBusinessCaseStatus = "READY"
	ITGFBCSInProgress     ITGovFinalBusinessCaseStatus = "IN_PROGRESS"
	ITGFBCSEditsRequested ITGovFinalBusinessCaseStatus = "EDITS_REQUESTED"
	ITGFBCSSubmitted      ITGovFinalBusinessCaseStatus = "SUBMITTED"
	ITGFBCSDone           ITGovFinalBusinessCaseStatus = "DONE"
)

// ITGovGRBStatus represents the types of ITGovGRBStatus types.  This is what the requestor sees for the  optional seventh task.
type ITGovGRBStatus string

// These are the options for ITGovGRBStatus
const (
	ITGGRBSCantStart        ITGovGRBStatus = "CANT_START"
	ITGGRBSNotNeeded        ITGovGRBStatus = "NOT_NEEDED"
	ITGGRBSReadyToSchedule  ITGovGRBStatus = "READY_TO_SCHEDULE"
	ITGGRBSScheduled        ITGovGRBStatus = "SCHEDULED"
	ITGGRBSAwaitingDecision ITGovGRBStatus = "AWAITING_DECISION"
	ITGGRBSCompleted        ITGovGRBStatus = "COMPLETED"
)
