package models

import (
	"github.com/google/uuid"
)

type SystemRelationshipType string

const (
	SystemRelationshipTypePrimarySupport     SystemRelationshipType = "PRIMARY_SUPPORT"
	SystemRelationshipTypePartialSupport     SystemRelationshipType = "PARTIAL_SUPPORT"
	SystemRelationshipTypeUsesInTechSolution SystemRelationshipType = "USES_OR_IMPACTED_BY_SELECTED_SYSTEM"
	SystemRelationshipTypeUsedInTechSolution SystemRelationshipType = "IMPACTS_SELECTED_SYSTEM"
	SystemRelationshipTypeOther              SystemRelationshipType = "OTHER"
)

// SystemIntakeSystem is the insertion type for linking a system intake to
// system(s)
type SystemIntakeSystem struct {
	BaseStructUser
	SystemIntakeID                     uuid.UUID                         `json:"systemIntakeId" db:"system_intake_id"`
	SystemID                           string                            `json:"systemId" db:"system_id"`
	SystemRelationshipType             EnumArray[SystemRelationshipType] `json:"relationshipType" db:"relationship_type"`
	OtherSystemRelationshipDescription *string                           `json:"otherSystemRelationshipDescription" db:"other_system_relationship_description"`
}

// NewSystemIntakeSystem creates a SystemIntakeSystemLink
func NewSystemIntakeSystem(createdBy uuid.UUID) SystemIntakeSystem {
	return SystemIntakeSystem{
		BaseStructUser: NewBaseStructUser(createdBy),
	}
}

func (s SystemIntakeSystem) GetMappingKey() uuid.UUID {
	return s.SystemIntakeID
}
func (s SystemIntakeSystem) GetMappingVal() *SystemIntakeSystem {
	return &s
}
