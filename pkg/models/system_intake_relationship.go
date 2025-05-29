package models

import (
	"time"

	"github.com/google/uuid"
)

// SystemIntakeRelationship represents the relationshup between the intake system and another system
type SystemIntakeRelationship struct {
	ID                     uuid.UUID              `json:"id"`
	UpdatedAt              *time.Time             `db:"updated_at"`
	CreatedAt              *time.Time             `db:"created_at"`
	SystemRelationshipType SystemRelationshipType `db:"system_relationship_type"`
	OtherTypeDescription   string                 `db:"other_type_description"`
}
