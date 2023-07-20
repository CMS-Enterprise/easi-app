package models

import "github.com/google/uuid"

// GovernanceRequestFeedbackSourceAction is an eumeration of the possible actions that can provide feedback on a governance request
type GovernanceRequestFeedbackSourceAction string

// These are the possible forms that can provide feedback
const (
	GRFSARequestEdits      GovernanceRequestFeedbackSourceAction = "REQUEST_EDITS"
	GRFSAProgressToNewStep GovernanceRequestFeedbackSourceAction = "PROGRESS_TO_NEW_STEP"
)

// GovernanceRequestFeedbackTargetForm is an enumeration of the possible forms on a governance intake request that can receive feedback
type GovernanceRequestFeedbackTargetForm string

// These are the possible forms that can have governance request feedback
const (
	GRFTNoTargetProvided  GovernanceRequestFeedbackTargetForm = "NO_TARGET_PROVIDED"
	GRFTIntakeRequest     GovernanceRequestFeedbackTargetForm = "INTAKE_REQUEST"
	GRFTDraftBusinessCase GovernanceRequestFeedbackTargetForm = "DRAFT_BUSINESS_CASE"
	GRFTFinalBusinessCase GovernanceRequestFeedbackTargetForm = "FINAL_BUSINESS_CASE"
)

// GovernanceRequestFeedback represents feedback given to the requester on a governance request
type GovernanceRequestFeedback struct {
	BaseStruct
	IntakeID     uuid.UUID                             `json:"intakeId" db:"intake_id"`
	Feedback     string                                `json:"feedback" db:"feedback"`
	SourceAction GovernanceRequestFeedbackSourceAction `json:"sourceAction" db:"source_action"`
	TargetForm   GovernanceRequestFeedbackTargetForm   `json:"targetForm" db:"target_form"`
}
