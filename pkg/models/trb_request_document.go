package models

import (
	"time"

	"github.com/google/uuid"
)

// TRBRequestDocument represents a document attached to a TRB request that has been uploaded to S3
type TRBRequestDocument struct {
	BaseStruct
	TRBRequestID       uuid.UUID             `json:"trbRequestId" db:"trb_request_id"`
	CommonDocumentType TRBDocumentCommonType `db:"document_type"`
	OtherType          string                `db:"other_type"`
	FileName           string                `json:"fileName" db:"file_name"`
	Bucket             string                `json:"bucket" db:"bucket"`
	S3Key              string                `json:"s3Key" db:"s3_key"` // The document's key inside an S3 bucket; does *not* include the bucket name.
	DeletedAt          *time.Time            `json:"deletedAt" db:"deleted_at"`
}
