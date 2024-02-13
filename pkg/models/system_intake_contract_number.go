package models

import "github.com/google/uuid"

// SystemIntakeContractNumber is the insertion type for linking a system intake to
// contract number(s)
type SystemIntakeContractNumber struct {
	BaseStructUser
	SystemIntakeID uuid.UUID `db:"system_intake_id"`
	ContractNumber string    `db:"contract_number"`
}

// NewSystemIntakeContractNumber creates a SystemIntakeContractNumberLink
func NewSystemIntakeContractNumber(createdBy uuid.UUID) SystemIntakeContractNumber {
	return SystemIntakeContractNumber{
		BaseStructUser: NewBaseStructUser(createdBy),
	}

}
