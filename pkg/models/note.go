package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
)

// Note holds commentary information submitted by the review team about
// a SystemIntake
type Note struct {
	ID             uuid.UUID   `json:"id"`
	SystemIntakeID uuid.UUID   `json:"systemIntakeId" db:"system_intake"`
	CreatedAt      *time.Time  `json:"createdAt" db:"created_at"`
	AuthorEUAID    null.String `json:"authorId" db:"eua_user_id"`
	AuthorName     null.String `json:"authorName" db:"author_name"`
	Content        null.String `json:"content" db:"content"`
}
