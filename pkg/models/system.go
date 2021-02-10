package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
)

// System represents something that may be tested for 508 compliance
type System struct {
	IntakeID    uuid.UUID   `json:"intakeId" db:"id"`
	LCID        string      `json:"lcid" db:"lcid"`
	CreatedAt   *time.Time  `json:"createdAt" db:"created_at"`
	UpdatedAt   *time.Time  `json:"updatedAt" db:"updated_at"`
	IssuedAt    *time.Time  `json:"issuedAt" db:"decided_at"`
	ExpiresAt   *time.Time  `json:"expiresAt" db:"lcid_expires_at"`
	ProjectName string      `json:"projectName" db:"project_name"`
	OwnerID     null.String `json:"ownerId" db:"eua_user_id"` // backfill data in PROD has NULLs
	OwnerName   string      `json:"ownerName" db:"requester"` // TODO: wouldn't really be necessary at DB layer if we had performant access to LDAP
}
