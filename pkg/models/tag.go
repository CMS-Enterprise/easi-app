package models

import (
	"github.com/google/uuid"
)

// Tag represents a tagged item in HTML
type Tag struct {
	// BaseStructUser // TODO Introduce again if we store tags in the database
	TagType         TagType   `json:"tagType" db:"tag_type"`
	TaggedContentID uuid.UUID `json:"taggedContentID" db:"tagged_content_id"`
}

func (t TagType) IsGroup() bool {
	switch t {
	case TagTypeGroupItGov, TagTypeGroupGrbReviewers:
		return true
	default:
		return false
	}
}
