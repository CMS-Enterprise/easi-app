package models

import (
	"time"

	"github.com/google/uuid"
)

// SystemIntakeContact represents an EUA user's association with a system intake
type SystemIntakeContact struct {
	userIDRelation
	ID             uuid.UUID  `json:"id"`
	EUAUserID      string     `json:"euaUserId" db:"eua_user_id"`
	SystemIntakeID uuid.UUID  `json:"systemIntakeId" db:"system_intake_id"`
	Component      string     `json:"component" db:"component"`
	Role           string     `json:"role" db:"role"`
	UpdatedAt      *time.Time `db:"updated_at"`
	CreatedAt      *time.Time `db:"created_at"`
}

// NewSystemIntakeContact creates a new SystemIntakeContact with the related userAccount
func NewSystemIntakeContact(userID uuid.UUID) *SystemIntakeContact {
	return &SystemIntakeContact{
		userIDRelation: NewUserIDRelation(userID),
	}
}
