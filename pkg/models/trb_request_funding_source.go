package models

import (
	"github.com/google/uuid"
)

// TRBFundingSource represents one of multiple funding selections that can be added to a TRBRequestForm
type TRBFundingSource struct {
	baseStruct
	TRBRequestID  uuid.UUID `json:"trbRequestId" db:"trb_request_id"`
	Source        string    `json:"source" db:"source"`
	FundingNumber string    `json:"fundingNumber" db:"funding_number"`
}
