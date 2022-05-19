package models

import (
	"time"

	"github.com/google/uuid"
)

// AugmentedSystemIntakeContact enhances SystemIntakeContact with user info fetched from CEDAR
type AugmentedSystemIntakeContact struct {
	SystemIntakeContact
	CommonName string       `json:"commonName"`
	Email      EmailAddress `json:"email"`
}

// SystemIntakeContact represents an EUA user's association with a system intake
type SystemIntakeContact struct {
	EUAUserID      string     `json:"euaUserId" db:"eua_user_id"`
	SystemIntakeID uuid.UUID  `json:"systemIntakeId" db:"system_intake_id"`
	CreatedAt      *time.Time `db:"created_at"`
	Component      string     `json:"component" db:"component"`
	Role           string     `json:"role" db:"role"`
}
