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
	Source         null.String `json:"source" db:"source"`
	FundingNumber  null.String `json:"fundingNumber" db:"funding_number"`
	CreatedAt      *time.Time  `db:"created_at"`
}

func (s SystemIntakeFundingSource) GetMappingKey() uuid.UUID {
	return s.SystemIntakeID
}
func (s SystemIntakeFundingSource) GetMappingVal() *SystemIntakeFundingSource {
	return &s
}
