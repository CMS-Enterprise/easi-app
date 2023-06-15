package models

import "github.com/google/uuid"

// GovernanceRequestFeedback represents feedback given to the requester on a governance request
type GovernanceRequestFeedback struct {
	BaseStruct
	IntakeID uuid.UUID `db:"intake_id"`
	Feedback string
}
