package models

import (
	"github.com/google/uuid"
)

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
	GRFTFNoTargetProvided  GovernanceRequestFeedbackTargetForm = "NO_TARGET_PROVIDED"
	GRFTFIntakeRequest     GovernanceRequestFeedbackTargetForm = "INTAKE_REQUEST"
	GRFTFDraftBusinessCase GovernanceRequestFeedbackTargetForm = "DRAFT_BUSINESS_CASE"
	GRFTFinalBusinessCase  GovernanceRequestFeedbackTargetForm = "FINAL_BUSINESS_CASE"
)

// Humanize translates a GovernanceRequestFeedbackTargetForm to human readable text
func (tf GovernanceRequestFeedbackTargetForm) Humanize() string {
	switch tf {

	case GRFTFIntakeRequest:
		return "Intake Request Form"
	case GRFTFDraftBusinessCase:
		return "Draft Business Case"
	case GRFTFinalBusinessCase:
		return "Final Business Case"
	case GRFTFNoTargetProvided:
		fallthrough
	default:
		return "No Form Selected"

	}

}

// GovernanceRequestFeedbackType is an enumeration of the possible types of feedback on governance requests, based on who it's directed to
type GovernanceRequestFeedbackType string

// These are the possible types of recipients of feedback on governanance requests
const (
	GRFTRequester GovernanceRequestFeedbackType = "REQUESTER"
	GRFTGRB       GovernanceRequestFeedbackType = "GRB"
)

// GovernanceRequestFeedback represents feedback given to the requester on a governance request
type GovernanceRequestFeedback struct {
	BaseStruct
	IntakeID     uuid.UUID                             `json:"intakeId" db:"intake_id"`
	Feedback     HTML                                  `json:"feedback" db:"feedback"`
	SourceAction GovernanceRequestFeedbackSourceAction `json:"sourceAction" db:"source_action"`
	TargetForm   GovernanceRequestFeedbackTargetForm   `json:"targetForm" db:"target_form"`
	Type         GovernanceRequestFeedbackType         `json:"type" db:"type"`
}
