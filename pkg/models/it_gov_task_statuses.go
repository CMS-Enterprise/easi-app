package models

// ITGovTaskStatuses is a helper struct used by GQL to wrap a returned System Intake, so section statuses can be calculated only when requested
type ITGovTaskStatuses struct {
	ParentSystemIntake *SystemIntake
}

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
