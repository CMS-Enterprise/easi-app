package models

import (
	"time"

	"github.com/google/uuid"
)

// AccessibilityNote represents data about a status that has been set
type AccessibilityNote struct {
	ID        uuid.UUID `json:"id"`
	Note      string
	RequestID uuid.UUID  `json:"requestId" db:"request_id"`
	CreatedAt *time.Time `json:"createdAt" db:"created_at"`
	EUAUserID string     `json:"euaUserId" db:"eua_user_id"`
}
