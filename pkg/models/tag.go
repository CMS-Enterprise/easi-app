package models

import (
	"github.com/google/uuid"
)

// Tag represents a reference to another data structure in the database
type Tag struct {
	BaseStructUser
	TagType         TagType   `json:"tagType" db:"tag_type"`
	TaggedContentID uuid.UUID `json:"taggedContentID" db:"tagged_content_id"`
}
