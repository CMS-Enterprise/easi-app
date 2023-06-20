package models

import "github.com/google/uuid"

// GovernanceRequestFeedbackSourceAction is an eumeration of the possible actions that can provide feedback on a governance request
type GovernanceRequestFeedbackSourceAction string

// These are the possible forms that can provide feedback
const (
	GovernanceRequestFeedbackSourceActionRequestEdits      GovernanceRequestFeedbackSourceAction = "REQUEST_EDITS"
	GovernanceRequestFeedbackSourceActionProgressToNewStep GovernanceRequestFeedbackSourceAction = "PROGRESS_TO_NEW_STEP"
)

// GovernanceRequestFeedbackTargetForm is an enumeration of the possible forms on a governance intake request that can receive feedback
type GovernanceRequestFeedbackTargetForm string

// These are the possible forms that can have governance request feedback
const (
	GovernanceRequestFeedbackTargetNoTargetProvided  GovernanceRequestFeedbackTargetForm = "NO_TARGET_PROVIDED"
	GovernanceRequestFeedbackTargetIntakeRequest     GovernanceRequestFeedbackTargetForm = "INTAKE_REQUEST"
	GovernanceRequestFeedbackTargetDraftBusinessCase GovernanceRequestFeedbackTargetForm = "DRAFT_BUSINESS_CASE"
	GovernanceRequestFeedbackTargetFinalBusinessCase GovernanceRequestFeedbackTargetForm = "FINAL_BUSINESS_CASE"
)

// GovernanceRequestFeedback represents feedback given to the requester on a governance request
type GovernanceRequestFeedback struct {
	BaseStruct
	IntakeID     uuid.UUID `db:"intake_id"`
	Feedback     string
	SourceAction GovernanceRequestFeedbackSourceAction `db:"source_action"`
	TargetForm   GovernanceRequestFeedbackTargetForm   `db:"target_form"`
}
