package models

import (
	"time"

	"github.com/google/uuid"
)

// AccessibilityRequest models a 508 request
type AccessibilityRequest struct {
	ID        uuid.UUID  `json:"id"`
	Name      string     `json:"name"`
	IntakeID  uuid.UUID  `db:"intake_id"`
	CreatedAt *time.Time `db:"created_at" gqlgen:"submittedAt"`
	UpdatedAt *time.Time `db:"updated_at"`
	EUAUserID string     `json:"euaUserId" db:"eua_user_id"`
	DeletedAt *time.Time `db:"deleted_at" json:"deletedAt"`
}
