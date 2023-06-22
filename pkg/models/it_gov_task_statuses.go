package models

// ITGovTaskStatuses is a helper struct used by GQL to wrap a returned System Intake, so section statuses can be calculated only when requested
type ITGovTaskStatuses struct {
	ParentSystemIntake *SystemIntake
}

// ITGovIntakeStatus represents the types of ITGovIntakeStatus types. This is what the requester sees for the first task
type ITGovIntakeStatus string

// These are the options for ITGovIntakeStatus
const (
	ITGISReady          ITGovIntakeStatus = "READY"
	ITGISInProgress     ITGovIntakeStatus = "IN_PROGRESS"
	ITGISEditsRequested ITGovIntakeStatus = "EDITS_REQUESTED"
	ITGISCompleted      ITGovIntakeStatus = "COMPLETED"
)

// ITGovFeedbackStatus represents the types of ITGovFeedbackStatus types. This is what the requestor sees for the second task.
type ITGovFeedbackStatus string

// These are the options for ITGovFeedbackStatus
const (
	ITGFBSCantStart ITGovFeedbackStatus = "CANT_START"
	ITGFBSInReview  ITGovFeedbackStatus = "IN_REVIEW"
	ITGFBSCompleted ITGovFeedbackStatus = "COMPLETED"
)

// ITGovDecisionStatus represents the types of ITGovDecisionStatus types. This is what the requestor sees for the third task.
type ITGovDecisionStatus string

// These are the options for ITGovDecisionStatus
const (
	ITGDSCantStart ITGovDecisionStatus = "CANT_START"
	ITGDSInReview  ITGovDecisionStatus = "IN_REVIEW"
	ITGDSCompleted ITGovDecisionStatus = "COMPLETED"
)

// ITGovDraftBuisnessCaseStatus represents the types of ITGovDraftBuisnessCaseStatus types. This is what the requestor sees for the  optional fourth task.
type ITGovDraftBuisnessCaseStatus string

// These are the options for ITGovDraftBuisnessCaseStatus
const (
	ITGDBCSCantStart      ITGovDraftBuisnessCaseStatus = "CANT_START"
	ITGDBCSNotNeeded      ITGovDraftBuisnessCaseStatus = "NOT_NEEDED"
	ITGDBCSReady          ITGovDraftBuisnessCaseStatus = "READY"
	ITGDBCSInProgress     ITGovDraftBuisnessCaseStatus = "IN_PROGRESS"
	ITGDBCSEditsRequested ITGovDraftBuisnessCaseStatus = "EDITS_REQUESTED"
	ITGDBCSCompleted      ITGovDraftBuisnessCaseStatus = "COMPLETED"
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

// ITGovFinalBuisnessCaseStatus represents the types of ITGovFinalBuisnessCaseStatus types. This is what the requestor sees for the  optional sixth task.
type ITGovFinalBuisnessCaseStatus string

// These are the options for ITGovFinalBuisnessCaseStatus
const (
	ITGFBCSCantStart      ITGovFinalBuisnessCaseStatus = "CANT_START"
	ITGFBCSNotNeeded      ITGovFinalBuisnessCaseStatus = "NOT_NEEDED"
	ITGFBCSReady          ITGovFinalBuisnessCaseStatus = "READY"
	ITGFBCSInProgress     ITGovFinalBuisnessCaseStatus = "IN_PROGRESS"
	ITGFBCSEditsRequested ITGovFinalBuisnessCaseStatus = "EDITS_REQUESTED"
	ITGFBCSCompleted      ITGovFinalBuisnessCaseStatus = "COMPLETED"
)

// ITGovGRBStatus represents the types of ITGovGRBStatus types.  This is what the requestor sees for the  optional seventh task.
type ITGovGRBStatus string

// These are the options for ITGovGRBStatus
const (
	ITGGRBSCantStart       ITGovGRBStatus = "CANT_START"
	ITGGRBSNotNeeded       ITGovGRBStatus = "NOT_NEEDED"
	ITGGRBSReadyToSchedule ITGovGRBStatus = "READY_TO_SCHEDULE"
	ITGGRBSScheduled       ITGovGRBStatus = "SCHEDULED"
	ITGGRBSCompleted       ITGovGRBStatus = "COMPLETED"
)
