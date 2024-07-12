package models

import "github.com/google/uuid"

// TRBRequestContractNumber is the insertion type for linking a TRB request to contract number(s)
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

func (t TRBRequestContractNumber) GetMappingKey() uuid.UUID {
	return t.TRBRequestID
}
func (t TRBRequestContractNumber) GetMappingVal() *TRBRequestContractNumber {
	return &t
}
