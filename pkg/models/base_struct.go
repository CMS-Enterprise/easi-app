package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/samber/lo"
)

// IBaseStruct is an interface that all models must implement
type IBaseStruct interface {
	GetBaseStruct() *BaseStruct
	GetID() uuid.UUID
	GetCreatedBy() string
	GetModifiedBy() *string
}

// BaseStruct represents the shared data in common betwen all models
type BaseStruct struct {
	ID         uuid.UUID  `json:"id" db:"id"`
	CreatedBy  string     `json:"createdBy" db:"created_by"`
	CreatedAt  time.Time  `json:"createdAt" db:"created_at"`
	ModifiedBy *string    `json:"modifiedBy" db:"modified_by"`
	ModifiedAt *time.Time `json:"modifiedAt" db:"modified_at"`
}

// NewBaseStruct returns a base struct object
func NewBaseStruct(createdBy string) BaseStruct {
	return BaseStruct{
		CreatedBy: createdBy,
	}
}

// GetBaseStruct returns the Base Struct
func (b *BaseStruct) GetBaseStruct() *BaseStruct {
	return b
}

// GetID returns the ID property for a PlanBasics struct
func (b BaseStruct) GetID() uuid.UUID {
	return b.ID
}

// GetModifiedBy returns the ModifiedBy property for a PlanBasics struct
func (b BaseStruct) GetModifiedBy() *string {
	return b.ModifiedBy
}

// GetCreatedBy implements the CreatedBy property
func (b BaseStruct) GetCreatedBy() string {
	return b.CreatedBy
}

// ContainsAllIDs checks if the IDs from a slice of BaseStructs contain all the given IDs
func ContainsAllIDs[BS IBaseStruct](models []BS, ids []uuid.UUID) bool {
	allModelIDs := lo.Map(models, func(model BS, _ int) uuid.UUID {
		return model.GetID()
	})

	return lo.Every(allModelIDs, ids)
}
