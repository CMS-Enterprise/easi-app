package models

import "github.com/google/uuid"

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
	IntakeID   uuid.UUID `db:"intake_id"`
	Feedback   string
	TargetForm GovernanceRequestFeedbackTargetForm `db:"target_form"`
}
