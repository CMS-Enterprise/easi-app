package models

import "github.com/google/uuid"

// GovernanceRequestFeedbackTarget is an enumeration of the possible items that a GovernanceRequestFeedback is providing feedback for
type GovernanceRequestFeedbackTarget string

// These are the possible targets for governance request feedback
const (
	GovernanceRequestFeedbackTargetNoTargetProvided  GovernanceRequestFeedbackTarget = "NO_TARGET_PROVIDED"
	GovernanceRequestFeedbackTargetIntakeRequest     GovernanceRequestFeedbackTarget = "INTAKE_REQUEST"
	GovernanceRequestFeedbackTargetDraftBusinessCase GovernanceRequestFeedbackTarget = "DRAFT_BUSINESS_CASE"
	GovernanceRequestFeedbackTargetFinalBusinessCase GovernanceRequestFeedbackTarget = "FINAL_BUSINESS_CASE"
)

// GovernanceRequestFeedback represents feedback given to the requester on a governance request
type GovernanceRequestFeedback struct {
	BaseStruct
	IntakeID uuid.UUID `db:"intake_id"`
	Feedback string
	Target   GovernanceRequestFeedbackTarget
}
