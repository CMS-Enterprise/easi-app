package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
	"github.com/lib/pq"
)

type SoftwareAcquisitionMethod string

const (
	SoftwareAcquisitionContractorFurnished SoftwareAcquisitionMethod = "CONTRACTOR_FURNISHED"
	SoftwareAcquisitionFedFurnished        SoftwareAcquisitionMethod = "FED_FURNISHED"
	SoftwareAcquisitionELAOrInternal       SoftwareAcquisitionMethod = "ELA_OR_INTERNAL"
	SoftwareAcquisitionOther               SoftwareAcquisitionMethod = "OTHER"
)

// TODO: NJD - use BaseStruct?

// SystemIntakeSoftwareAcquisition represents the software acquisition information associated with a SystemIntake
type SystemIntakeSoftwareAcquisition struct {
	ID                 uuid.UUID      `json:"id"`
	SystemIntakeID     uuid.UUID      `json:"systemIntakeId" db:"system_intake_id"`
	UsingSoftware      null.String    `json:"usingSoftware" db:"using_software"`
	AcuqisitionMethods pq.StringArray `json:"acquisitionMethods" db:"acquisition_methods"`
	// TODO: NJD pq.StringArray vs enum array?
	// AcuqisitionMethods []SoftwareAcquisitionMethod `json:"acquisitionMethods" db:"acquisition_methods"`
	CreatedAt *time.Time `db:"created_at"`
}

func (s SystemIntakeSoftwareAcquisition) GetMappingKey() uuid.UUID {
	return s.SystemIntakeID
}
func (s SystemIntakeSoftwareAcquisition) GetMappingVal() *SystemIntakeSoftwareAcquisition {
	return &s
}
