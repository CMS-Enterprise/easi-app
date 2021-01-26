package models

import (
	"time"
)

// System represents something that may be tested for 508 compliance
type System struct {
	// IntakeID    uuid.UUID  `json:"intakeId" db:"id"` // TODO: is this actually necessary, if LCID is really the identifier?
	LCID        string     `json:"lcid" db:"lcid"`
	CreatedAt   *time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt   *time.Time `json:"updatedAt" db:"updated_at"`
	IssuedAt    *time.Time `json:"issuedAt" db:"decided_at"`
	ExpiresAt   *time.Time `json:"expiresAt" db:"lcid_expires_at"`
	ProjectName string     `json:"projectName" db:"project_name"`
	OwnerID     string     `json:"ownerId" db:"eua_user_id"`
	OwnerName   string     `json:"ownerName" db:"requester"` // TODO: wouldn't really be necessary at DB layer if we had performant access to LDAP
}
