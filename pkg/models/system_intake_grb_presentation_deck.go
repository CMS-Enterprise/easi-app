package models

import (
	"time"
)

// PresentationDeck represents a presentation deck uploaded by a user
type PresentationDeck struct {
	BaseStruct
	FileName  string     `json:"fileName" db:"file_name"`
	Bucket    string     `json:"bucket" db:"bucket"`
	S3Key     string     `json:"s3Key" db:"s3_key"` // The document's key inside an S3 bucket; does *not* include the bucket name.
	DeletedAt *time.Time `json:"deletedAt" db:"deleted_at"`
}
