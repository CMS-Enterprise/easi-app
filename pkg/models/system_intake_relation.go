package models

import "github.com/google/uuid"

// CreateSystemIntakeContractNumbersLink is the insertion type for linking a system intake to
// contract number(s)
type CreateSystemIntakeContractNumbersLink struct {
	IntakeID       uuid.UUID `db:"intake_id"`
	ContractNumber string    `db:"contract_number"`
	CreatedBy      string    `db:"created_by"`
	ModifiedBy     string    `db:"modified_by"`
}
