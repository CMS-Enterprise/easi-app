package models

import (
	"github.com/google/uuid"
)

// TRBRequestLCID represents an LCID that has been associated with a TRB request
type TRBRequestLCID struct {
	baseStruct
	TRBRequestID uuid.UUID `json:"trbRequestId" db:"trb_request_id"`
	LCID         string    `json:"lcid" db:"lcid"`
}
