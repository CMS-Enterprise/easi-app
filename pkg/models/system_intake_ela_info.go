package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
)

// SystemIntakeELAInfo represents one of multiple ELA selections that can be added to a SystemIntake
type SystemIntakeELAInfo struct {
	ID             uuid.UUID   `json:"id"`
	SystemIntakeID uuid.UUID   `json:"systemIntakeId" db:"system_intake_id"`
	ElaName        null.String `json:"elaName" db:"ela_name"`
	CreatedAt      *time.Time  `db:"created_at"`
}

func (s SystemIntakeELAInfo) GetMappingKey() uuid.UUID {
	return s.SystemIntakeID
}
func (s SystemIntakeELAInfo) GetMappingVal() *SystemIntakeELAInfo {
	return &s
}
