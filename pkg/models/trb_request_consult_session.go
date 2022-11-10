package models

import (
	"time"

	"github.com/google/uuid"
)

// TRBRequestConsultSession represents the data entered into the TRB request form
type TRBRequestConsultSession struct {
	baseStruct
	TRBRequestID uuid.UUID  `json:"trbRequestId" db:"trb_request_id"`
	SessionTime  *time.Time `json:"sessionTime" db:"session_time"`
	Notes        *string    `json:"notes" db:"notes"`
}
