package models

import (
	"time"

	"github.com/google/uuid"
)

// IBaseStruct is an interface that all models must implement
type IBaseStruct interface {
	GetBaseStruct() *baseStruct
	GetID() uuid.UUID
	GetCreatedBy() string
	GetModifiedBy() *string
}

// baseStruct represents the shared data in common betwen all models
type baseStruct struct {
	ID         uuid.UUID  `json:"id" db:"id"`
	CreatedBy  string     `json:"createdBy" db:"created_by"`
	CreatedAt  time.Time  `json:"createdAt" db:"created_at"`
	ModifiedBy *string    `json:"modifiedBy" db:"modified_by"`
	ModifiedAt *time.Time `json:"modifiedAt" db:"modified_at"`
}

// NewBaseStruct returns a base struct object
func NewBaseStruct(createdBy string) baseStruct {
	return baseStruct{
		CreatedBy: createdBy,
	}
}

// GetBaseStruct returns the Base Struct
func (b *baseStruct) GetBaseStruct() *baseStruct {
	return b
}

// GetID returns the ID property for a PlanBasics struct
func (b baseStruct) GetID() uuid.UUID {
	return b.ID
}

// GetModifiedBy returns the ModifiedBy property for a PlanBasics struct
func (b baseStruct) GetModifiedBy() *string {
	return b.ModifiedBy
}

// GetCreatedBy implements the CreatedBy property
func (b baseStruct) GetCreatedBy() string {
	return b.CreatedBy
}
