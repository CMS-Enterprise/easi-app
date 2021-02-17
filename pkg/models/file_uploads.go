package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
)

//PreSignedURL is the model to return S3 pre-signed URLs
type PreSignedURL struct {
	URL      string `json:"URL"`
	Filename string `json:"filename"`
}

// UploadedFile is the representation of stored files uploaded to S3
type UploadedFile struct {
	ID           uuid.UUID   `json:"id"`
	FileType     null.String `json:"fileType" db:"file_type"`
	Bucket       null.String `json:"bucket" db:"bucket"`
	Key          null.String `json:"fileKey" db:"file_key"`
	CreatedAt    *time.Time  `json:"createdAt" db:"created_at"`
	UpdatedAt    *time.Time  `json:"updatedAt" db:"updated_at"`
	VirusScanned null.Bool   `json:"virusScanned" db:"virus_scanned"`
	VirusClean   null.Bool   `json:"virusClean" db:"virus_clean"`
	RequestID    uuid.UUID   `json:"requestId" db:"request_id"`
}
