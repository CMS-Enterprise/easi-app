package models

// ITGovTaskStatuses is a helper struct used by GQL to wrap a returned System Intake, so section statuses can be calculated only when requested
type ITGovTaskStatuses struct {
	ParentSystemIntake *SystemIntake
}

// ITGovIntakeStatus represents the types of ITGovIntakeStatus types. This is what the requester sees for the first task
type ITGovIntakeStatus string

// These are the options for ITGovIntakeStatus
const (
	ITGISRReady          ITGovIntakeStatus = "READY"
	ITGISRInProgress     ITGovIntakeStatus = "IN_PROGRESS"
	ITGISREditsRequested ITGovIntakeStatus = "EDITS_REQUESTED"
	ITGISRCompleted      ITGovIntakeStatus = "COMPLETED"
)

// ITGovFeedbackStatus represents the types of ITGovFeedbackStatus types. This is what the requestor sees for the second task.
type ITGovFeedbackStatus string

// These are the options for ITGovFeedbackStatus
const (
	ITGFBSRCantStart ITGovFeedbackStatus = "CANT_START"
	ITGFBSRInReview  ITGovFeedbackStatus = "IN_REVIEW"
	ITGFBSRCompleted ITGovFeedbackStatus = "COMPLETED"
)

// ITGovDecisionStatus represents the types of ITGovDecisionStatus types. This is what the requestor sees for the third task.
type ITGovDecisionStatus string

// These are the options for ITGovDecisionStatus
const (
	ITGDSRCantStart ITGovDecisionStatus = "CANT_START"
	ITGDSRInReview  ITGovDecisionStatus = "IN_REVIEW"
	ITGDSRCompleted ITGovDecisionStatus = "COMPLETED"
)

// ITGovDraftBuisnessCaseStatus represents the types of ITGovDraftBuisnessCaseStatus types. This is what the requestor sees for the  optional fourth task.
type ITGovDraftBuisnessCaseStatus string

// These are the options for ITGovDraftBuisnessCaseStatus
const (
	ITGDBCSRCantStart      ITGovDraftBuisnessCaseStatus = "CANT_START"
	ITGDBCSRNotNeeded      ITGovDraftBuisnessCaseStatus = "NOT_NEEDED"
	ITGDBCSRReady          ITGovDraftBuisnessCaseStatus = "READY"
	ITGDBCSRInProgress     ITGovDraftBuisnessCaseStatus = "IN_PROGRESS"
	ITGDBCSREditsRequested ITGovDraftBuisnessCaseStatus = "EDITS_REQUESTED"
	ITGDBCSRCompleted      ITGovDraftBuisnessCaseStatus = "COMPLETED"
)

// ITGovGRTStatus represents the types of ITGovGRTStatus types. This is what the requestor sees for the  optional fifth task.
type ITGovGRTStatus string

// These are the options for ITGovGRTStatus
const (
	ITGGRTSRCantStart        ITGovGRTStatus = "CANT_START"
	ITGGRTSRNotNeeded        ITGovGRTStatus = "NOT_NEEDED"
	ITGGRTSRReadyToSchedule  ITGovGRTStatus = "READY_TO_SCHEDULE"
	ITGGRTSRScheduled        ITGovGRTStatus = "SCHEDULED"
	ITGGRTSRAwaitingDecision ITGovGRTStatus = "AWAITING_DECISION"
	ITGGRTSRCompleted        ITGovGRTStatus = "COMPLETED"
)

// ITGovFinalBuisnessCaseStatus represents the types of ITGovFinalBuisnessCaseStatus types. This is what the requestor sees for the  optional sixth task.
type ITGovFinalBuisnessCaseStatus string

// These are the options for ITGovFinalBuisnessCaseStatus
const (
	ITGFBCSRCantStart      ITGovFinalBuisnessCaseStatus = "CANT_START"
	ITGFBCSRNotNeeded      ITGovFinalBuisnessCaseStatus = "NOT_NEEDED"
	ITGFBCSRReady          ITGovFinalBuisnessCaseStatus = "READY"
	ITGFBCSRInProgress     ITGovFinalBuisnessCaseStatus = "IN_PROGRESS"
	ITGFBCSREditsRequested ITGovFinalBuisnessCaseStatus = "EDITS_REQUESTED"
	ITGFBCSRCompleted      ITGovFinalBuisnessCaseStatus = "COMPLETED"
)

// ITGovGRBStatus represents the types of ITGovGRBStatus types.  This is what the requestor sees for the  optional seventh task.
type ITGovGRBStatus string

// These are the options for ITGovGRBStatus
const (
	ITGGRBSRCantStart       ITGovGRBStatus = "CANT_START"
	ITGGRBSRNotNeeded       ITGovGRBStatus = "NOT_NEEDED"
	ITGGRBSRReadyToSchedule ITGovGRBStatus = "READY_TO_SCHEDULE"
	ITGGRBSRScheduled       ITGovGRBStatus = "SCHEDULED"
	ITGGRBSRCompleted       ITGovGRBStatus = "COMPLETED"
)
