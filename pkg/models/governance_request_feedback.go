package models

import (
	"time"

	"github.com/google/uuid"
)

// Humanize translates a GovernanceRequestFeedbackTargetForm to human readable text
func (tf GovernanceRequestFeedbackTargetForm) Humanize() string {
	switch tf {

	case GovernanceRequestFeedbackTargetFormIntakeRequest:
		return "Intake Request Form"
	case GovernanceRequestFeedbackTargetFormDraftBusinessCase:
		return "Draft Business Case"
	case GovernanceRequestFeedbackTargetFormFinalBusinessCase:
		return "Final Business Case"
	case GovernanceRequestFeedbackTargetFormNoTargetProvided:
		fallthrough
	default:
		return "No Form Selected"

	}

}

// GovernanceRequestFeedback represents feedback given to the requester on a governance request
type GovernanceRequestFeedback struct {
	// Can't use BaseStruct here since CreatedBy is nullable in the DB
	ID         uuid.UUID  `json:"id" db:"id"`
	CreatedBy  *string    `json:"createdBy" db:"created_by"`
	CreatedAt  time.Time  `json:"createdAt" db:"created_at"`
	ModifiedBy *string    `json:"modifiedBy" db:"modified_by"`
	ModifiedAt *time.Time `json:"modifiedAt" db:"modified_at"`

	IntakeID     uuid.UUID                             `json:"intakeId" db:"intake_id"`
	Feedback     HTML                                  `json:"feedback" db:"feedback"`
	SourceAction GovernanceRequestFeedbackSourceAction `json:"sourceAction" db:"source_action"`
	TargetForm   GovernanceRequestFeedbackTargetForm   `json:"targetForm" db:"target_form"`
	Type         GovernanceRequestFeedbackType         `json:"type" db:"type"`
}
