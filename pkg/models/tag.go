package models

import (
	"github.com/google/uuid"
)

// Tag represents a reference to another data structure in the database
type Tag struct {
	BaseStructUser
	EntityRaw          string
	TagType            TagType    `json:"tagType" db:"tag_type"`
	TaggedField        string     `json:"taggedField" db:"tagged_field"`
	TaggedContentTable string     `json:"taggedContentTable" db:"tagged_content_table"`
	TaggedContentID    uuid.UUID  `json:"taggedContentID" db:"tagged_content_id"`
	EntityUUID         *uuid.UUID `json:"entityUUID" db:"entity_uuid"`
}
