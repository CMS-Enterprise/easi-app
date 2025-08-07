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
	ID             uuid.UUID  `json:"id"`
	EUAUserID      string     `json:"euaUserId" db:"eua_user_id"`
	SystemIntakeID uuid.UUID  `json:"systemIntakeId" db:"system_intake_id"`
	Component      string     `json:"component" db:"component"`
	Role           string     `json:"role" db:"role"`
	UserID         uuid.UUID  `json:"userID" db:"user_id"`
	UpdatedAt      *time.Time `db:"updated_at"`
	CreatedAt      *time.Time `db:"created_at"`
}
