package models

import (
	"github.com/google/uuid"
)

// TRBFundingSource represents one of multiple funding selections that can be added to a TRBRequestForm
type TRBFundingSource struct {
	BaseStruct
	TRBRequestID  uuid.UUID `json:"trbRequestId" db:"trb_request_id"`
	Source        string    `json:"source" db:"source"`
	FundingNumber string    `json:"fundingNumber" db:"funding_number"`
}

func (f TRBFundingSource) GetMappingKey() uuid.UUID {
	return f.TRBRequestID
}
func (f TRBFundingSource) GetMappingVal() *TRBFundingSource {
	return &f
}
