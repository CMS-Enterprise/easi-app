package models

import "github.com/google/uuid"

// TRBRequestSystem is the insertion type for linking a trb request to
// system(s)
type TRBRequestSystem struct {
	BaseStructUser
	TRBRequestID uuid.UUID `db:"trb_request_id"`
	SystemID     string    `db:"system_id"`
}

// NewTRBRequestSystem creates a TRBRequestSystemLink
func NewTRBRequestSystem(createdBy uuid.UUID) TRBRequestSystem {
	return TRBRequestSystem{
		BaseStructUser: NewBaseStructUser(createdBy),
	}
}
