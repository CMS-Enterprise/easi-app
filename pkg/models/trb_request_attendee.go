package models

import (
	"time"

	"github.com/google/uuid"
)

// TRBRequestAttendee represents an EUA user who is included as an attendee for a TRB request
type TRBRequestAttendee struct {
	ID           uuid.UUID  `json:"id"`
	EUAUserID    string     `json:"euaUserId" db:"eua_user_id"`
	TRBRequestID uuid.UUID  `json:"trbRequestId" db:"trb_request_id"`
	Component    string     `json:"component" db:"component"`
	Role         string     `json:"role" db:"role"`
	CreatedBy    string     `json:"createdBy" db:"created_by"`
	CreatedAt    time.Time  `json:"createdAt" db:"created_at"`
	ModifiedBy   *string    `json:"modifiedBy" db:"modified_by"`
	ModifiedAt   *time.Time `json:"modifiedAt" db:"modified_at"`
}
