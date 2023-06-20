package models

// ITGovTaskStatusesRequester is a helper struct used by GQL to wrap a returned ITGovTaskStatuses, so section statuses can be calculated onle when requested
type ITGovTaskStatusesRequester struct {
	ParentStatus *ITGovTaskStatuses
}

// ITGovIntakeStatusReq represents the types of ITGovIntakeStatusReq types. This is what the requester sees for the first task
type ITGovIntakeStatusReq string

// These are the options for ITGovIntakeStatusReq
const (
	ITGISRReady          ITGovIntakeStatusReq = "READY"
	ITGISRInProgress     ITGovIntakeStatusReq = "IN_PROGRESS"
	ITGISREditsRequested ITGovIntakeStatusReq = "EDITS_REQUESTED"
	ITGISRCompleted      ITGovIntakeStatusReq = "COMPLETED"
)

// ITGovFeedbackStatusReq represents the types of ITGovFeedbackStatusReq types. This is what the requestor sees for the second task.
type ITGovFeedbackStatusReq string

// These are the options for ITGovFeedbackStatusReq
const (
	ITGFBSRCantStart ITGovFeedbackStatusReq = "CANT_START"
	ITGFBSRInReview  ITGovFeedbackStatusReq = "IN_REVIEW"
	ITGFBSRCompleted ITGovFeedbackStatusReq = "COMPLETED"
)

// ITGovDecisionStatusReq represents the types of ITGovDecisionStatusReq types. This is what the requestor sees for the third task.
type ITGovDecisionStatusReq string

// These are the options for ITGovDecisionStatusReq
const (
	ITGDSRCantStart ITGovDecisionStatusReq = "CANT_START"
	ITGDSRInReview  ITGovDecisionStatusReq = "IN_REVIEW"
	ITGDSRCompleted ITGovDecisionStatusReq = "COMPLETED"
)

// ITGovDraftBuisnessCaseStatusReq represents the types of ITGovDraftBuisnessCaseStatusReq types. This is what the requestor sees for the  optional fourth task.
type ITGovDraftBuisnessCaseStatusReq string

// These are the options for ITGovDraftBuisnessCaseStatusReq
const (
	ITGDBCSRCantStart      ITGovDraftBuisnessCaseStatusReq = "CANT_START"
	ITGDBCSRNotNeeded      ITGovDraftBuisnessCaseStatusReq = "NOT_NEEDED"
	ITGDBCSRReady          ITGovDraftBuisnessCaseStatusReq = "READY"
	ITGDBCSRInProgress     ITGovDraftBuisnessCaseStatusReq = "IN_PROGRESS"
	ITGDBCSREditsRequested ITGovDraftBuisnessCaseStatusReq = "EDITS_REQUESTED"
	ITGDBCSRCompleted      ITGovDraftBuisnessCaseStatusReq = "COMPLETED"
)

// ITGovGRTStatusReq represents the types of ITGovGRTStatusReq types. This is what the requestor sees for the  optional fifth task.
type ITGovGRTStatusReq string

// These are the options for ITGovGRTStatusReq
const (
	ITGGRTSRCantStart        ITGovGRTStatusReq = "CANT_START"
	ITGGRTSRNotNeeded        ITGovGRTStatusReq = "NOT_NEEDED"
	ITGGRTSRReadyToSchedule  ITGovGRTStatusReq = "READY_TO_SCHEDULE"
	ITGGRTSRScheduled        ITGovGRTStatusReq = "SCHEDULED"
	ITGGRTSRAwaitingDecision ITGovGRTStatusReq = "AWAITING_DECISION"
	ITGGRTSRCompleted        ITGovGRTStatusReq = "COMPLETED"
)

// ITGovFinalBuisnessCaseStatusReq represents the types of ITGovFinalBuisnessCaseStatusReq types. This is what the requestor sees for the  optional sixth task.
type ITGovFinalBuisnessCaseStatusReq string

// These are the options for ITGovFinalBuisnessCaseStatusReq
const (
	ITGFBCSRCantStart      ITGovFinalBuisnessCaseStatusReq = "CANT_START"
	ITGFBCSRNotNeeded      ITGovFinalBuisnessCaseStatusReq = "NOT_NEEDED"
	ITGFBCSRReady          ITGovFinalBuisnessCaseStatusReq = "READY"
	ITGFBCSRInProgress     ITGovFinalBuisnessCaseStatusReq = "IN_PROGRESS"
	ITGFBCSREditsRequested ITGovFinalBuisnessCaseStatusReq = "EDITS_REQUESTED"
	ITGFBCSRCompleted      ITGovFinalBuisnessCaseStatusReq = "COMPLETED"
)

// ITGovGRBStatusReq represents the types of ITGovGRBStatusReq types.  This is what the requestor sees for the  optional seventh task.
type ITGovGRBStatusReq string

// These are the options for ITGovGRBStatusReq
const (
	ITGGRBSRCantStart       ITGovGRBStatusReq = "CANT_START"
	ITGGRBSRNotNeeded       ITGovGRBStatusReq = "NOT_NEEDED"
	ITGGRBSRReadyToSchedule ITGovGRBStatusReq = "READY_TO_SCHEDULE"
	ITGGRBSRScheduled       ITGovGRBStatusReq = "SCHEDULED"
	ITGGRBSRCompleted       ITGovGRBStatusReq = "COMPLETED"
)
