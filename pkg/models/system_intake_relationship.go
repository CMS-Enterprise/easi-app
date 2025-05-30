package models

import (
	"time"

	"github.com/google/uuid"
)

// SystemIntakeRelationship represents the relationshup between the intake system and another system
type SystemIntakeRelationship struct {
	UpdatedAt              *time.Time             `db:"updated_at"`
	CreatedAt              *time.Time             `db:"created_at"`
	SystemID               uuid.UUID              `db:"system_id"`
	SystemIntakeSystemID   uuid.UUID              `db:"system_intake_systems_id"`
	SystemRelationshipType SystemRelationshipType `db:"system_relationship_type"`
	OtherTypeDescription   string                 `db:"other_type_description"`
}
