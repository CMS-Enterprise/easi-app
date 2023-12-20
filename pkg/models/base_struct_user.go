package models

import (
	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/authentication"
)

//TODO: This will replace base struct when the user table is fully implemented

// BaseStructUser represents the shared data in common betwen all models
type BaseStructUser struct {
	ID uuid.UUID `json:"id" db:"id"`
	createdByRelation
	modifiedByRelation
}

// NewBaseStructUser returns a base struct object
func NewBaseStructUser(createdBy uuid.UUID) BaseStructUser {
	return BaseStructUser{
		createdByRelation: createdByRelation{
			CreatedBy: createdBy,
		},
	}
}

// SetModifiedBy is the implementation of the BaseStruct interface. It sets the modifiedByProperty based on
func (b *BaseStructUser) SetModifiedBy(principal authentication.Principal) error {

	userID := principal.Account().ID

	b.ModifiedBy = &userID
	return nil
}

// GetBaseStruct returns the Base Struct User Object
func (b *BaseStructUser) GetBaseStruct() *BaseStructUser {
	return b
}

// GetID returns the ID property for a PlanBasics struct
func (b BaseStructUser) GetID() uuid.UUID {
	return b.ID
}

// GetModifiedBy returns the ModifiedBy property for a PlanBasics struct
func (b BaseStructUser) GetModifiedBy() *string {
	modifiedBy := b.ModifiedBy.String()
	return &modifiedBy
}

// GetCreatedBy implements the CreatedBy property
func (b BaseStructUser) GetCreatedBy() string {
	createdBy := b.CreatedBy.String()
	return createdBy
}
