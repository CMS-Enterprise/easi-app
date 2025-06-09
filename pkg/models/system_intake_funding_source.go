package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
)

// SystemIntakeFundingSource represents one of multiple funding selections that can be added to a SystemIntake
type SystemIntakeFundingSource struct {
	ID             uuid.UUID   `json:"id"`
	SystemIntakeID uuid.UUID   `json:"systemIntakeId" db:"system_intake_id"`
	Investment     null.String `json:"investment" db:"investment"`
	ProjectNumber  null.String `json:"projectNumber" db:"project_number"`
	CreatedAt      *time.Time  `db:"created_at"`
}

func (s SystemIntakeFundingSource) GetMappingKey() uuid.UUID {
	return s.SystemIntakeID
}
func (s SystemIntakeFundingSource) GetMappingVal() *SystemIntakeFundingSource {
	return &s
}
