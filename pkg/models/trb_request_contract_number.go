package models

import "github.com/google/uuid"

// TRBRequestContractNumber is the insertion type for linking a TRB request to contract nunber(s)
type TRBRequestContractNumber struct {
	BaseStructUser
	TRBRequestID   uuid.UUID `db:"trb_request_id"`
	ContractNumber string    `db:"contract_number"`
}

// NewTRBRequestContractNumber creates a TRBRequestContractNumber
func NewTRBRequestContractNumber(createdBy uuid.UUID) TRBRequestContractNumber {
	return TRBRequestContractNumber{
		BaseStructUser: NewBaseStructUser(createdBy),
	}
}
