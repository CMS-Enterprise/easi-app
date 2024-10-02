package models

import (
	"github.com/google/uuid"
	"github.com/guregu/null"
	"github.com/lib/pq"
)

type SoftwareAcquisitionMethod string

const (
	SoftwareAcquisitionContractorFurnished SoftwareAcquisitionMethod = "CONTRACTOR_FURNISHED"
	SoftwareAcquisitionFedFurnished        SoftwareAcquisitionMethod = "FED_FURNISHED"
	SoftwareAcquisitionELAOrInternal       SoftwareAcquisitionMethod = "ELA_OR_INTERNAL"
	SoftwareAcquisitionNotYetDetermined    SoftwareAcquisitionMethod = "NOT_YET_DETERMINED"
	SoftwareAcquisitionOther               SoftwareAcquisitionMethod = "OTHER"
)

// SystemIntakeSoftwareAcquisition represents the software acquisition information associated with a SystemIntake
type SystemIntakeSoftwareAcquisition struct {
	BaseStruct
	SystemIntakeID     uuid.UUID      `json:"systemIntakeId" db:"system_intake_id"`
	UsingSoftware      null.String    `json:"usingSoftware" db:"using_software"`
	AcquisitionMethods pq.StringArray `json:"acquisitionMethods" db:"acquisition_methods"`
}

// NewTRBRequest returns a new trb request object
func NewSystemIntakeSoftwareAcquisition(createdBy string) *SystemIntakeSoftwareAcquisition {
	return &SystemIntakeSoftwareAcquisition{
		BaseStruct: NewBaseStruct(createdBy),
	}
}

func (s SystemIntakeSoftwareAcquisition) GetMappingKey() uuid.UUID {
	return s.SystemIntakeID
}
func (s SystemIntakeSoftwareAcquisition) GetMappingVal() *SystemIntakeSoftwareAcquisition {
	return &s
}
