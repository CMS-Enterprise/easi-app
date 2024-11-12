package models

import (
	"fmt"

	"github.com/google/uuid"
)

// TagType represents the possible types of tags you can have in an HTML Mention
type TagType string

const (
	TagTypeUserAccount      TagType = "USER_ACCOUNT"
	TagTypePossibleSolution TagType = "POSSIBLE_SOLUTION"
)

func (tt TagType) Validate() error {
	switch tt {
	case TagTypeUserAccount, TagTypePossibleSolution:
		return nil
	}

	return fmt.Errorf("%s is not a valid value for TagType", tt)
}

// Tag represents a reference to another data structure in the database
type Tag struct {
	BaseStructUser
	EntityRaw          string
	TagType            TagType    `json:"tagType" db:"tag_type"`
	TaggedField        string     `json:"taggedField" db:"tagged_field"`
	TaggedContentTable string     `json:"taggedContentTable" db:"tagged_content_table"`
	TaggedContentID    uuid.UUID  `json:"taggedContentID" db:"tagged_content_id"`
	EntityUUID         *uuid.UUID `json:"entityUUID" db:"entity_uuid"`
	EntityIntID        *int       `json:"entityIntID" db:"entity_intid"`
}
