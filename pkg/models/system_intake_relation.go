package models

import "github.com/google/uuid"

// SystemIntakeContractNumber is the insertion type for linking a system intake to
// contract number(s)
type SystemIntakeContractNumber struct {
	BaseStruct
	IntakeID       uuid.UUID `db:"intake_id"`
	ContractNumber string    `db:"contract_number"`
}
