package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
)

// SystemIntakeNote holds commentary information submitted by the review team about
// a SystemIntake
type SystemIntakeNote struct {
	ID             uuid.UUID   `json:"id"`
	SystemIntakeID uuid.UUID   `json:"systemIntakeId" db:"system_intake"`
	CreatedAt      *time.Time  `json:"createdAt" db:"created_at"`
	AuthorEUAID    string      `json:"authorId" db:"eua_user_id"`
	AuthorName     null.String `json:"authorName" db:"author_name"`
	Content        *HTML       `json:"content" db:"content"`
	ModifiedAt     *time.Time  `json:"modifiedAt" db:"modified_at"`
	ModifiedBy     *string     `json:"modifiedBy" db:"modified_by"`
	IsArchived     bool        `json:"isArchived" db:"is_archived"`
}

func (n SystemIntakeNote) GetMappingKey() uuid.UUID {
	return n.SystemIntakeID
}
func (n SystemIntakeNote) GetMappingVal() *SystemIntakeNote {
	return &n
}
