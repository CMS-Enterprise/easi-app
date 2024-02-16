package models

import "github.com/google/uuid"

// SystemIntakeSystem is the insertion type for linking a system intake to
// system(s)
type SystemIntakeSystem struct {
	BaseStructUser
	SystemIntakeID uuid.UUID `db:"system_intake_id"`
	SystemID       string    `db:"system_id"`
}

// NewSystemIntakeSystem creates a SystemIntakeSystemLink
func NewSystemIntakeSystem(createdBy uuid.UUID) SystemIntakeSystem {
	return SystemIntakeSystem{
		BaseStructUser: NewBaseStructUser(createdBy),
	}
}
