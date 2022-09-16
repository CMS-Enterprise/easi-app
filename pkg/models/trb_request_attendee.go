package models

import (
	"github.com/google/uuid"
)

// TRBRequestAttendee represents an EUA user who is included as an attendee for a TRB request
type TRBRequestAttendee struct {
	baseStruct
	EUAUserID    string    `json:"euaUserId" db:"eua_user_id"`
	TRBRequestID uuid.UUID `json:"trbRequestId" db:"trb_request_id"`
	Component    string    `json:"component" db:"component"`
	Role         string    `json:"role" db:"role"`
}
