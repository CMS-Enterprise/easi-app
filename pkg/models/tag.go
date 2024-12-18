package models

import (
	"github.com/google/uuid"
)

// Tag represents a tagged item in HTML
type Tag struct {
	// BaseStructUser // Introduce this if we end up storing tags in the database
	TagType         TagType   `json:"tagType" db:"tag_type"`
	TaggedContentID uuid.UUID `json:"taggedContentID" db:"tagged_content_id"`
}
