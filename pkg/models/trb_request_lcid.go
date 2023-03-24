package models

import (
	"github.com/google/uuid"
)

// TRBRequestSystemIntake represents a system intake that has been associated with a TRB request
type TRBRequestSystemIntake struct {
	baseStruct
	TRBRequestID   uuid.UUID `json:"trbRequestId" db:"trb_request_id"`
	SystemIntakeID uuid.UUID `json:"systemIntakeId" db:"system_intake_id"`
}
