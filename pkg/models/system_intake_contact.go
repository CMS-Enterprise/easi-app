package models

import (
	"time"

	"github.com/google/uuid"
)

// SystemIntakeContact represents an EUA user has that is associated with a system intake
type SystemIntakeContact struct {
	EUAUserID      string       `json:"euaUserId" db:"eua_user_id"`
	SystemIntakeID uuid.UUID    `json:"systemIntakeId" db:"system_intake_id"`
	CreatedAt      *time.Time   `db:"created_at"`
	CommonName     string       `json:"commonName"`
	Email          EmailAddress `json:"email"`
}
