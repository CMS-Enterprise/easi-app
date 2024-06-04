package models

import "github.com/google/uuid"

// SystemIntakeDocument represents a document attached to a system intake that has been uploaded to S3
type SystemIntakeDocument struct {
	BaseStruct
	SystemIntakeRequestID uuid.UUID                      `json:"systemIntakeId" db:"system_intake_id"`
	CommonDocumentType    SystemIntakeDocumentCommonType `db:"document_type"`
	OtherType             string                         `db:"other_type"`
	FileName              string                         `json:"fileName" db:"file_name"`
	Bucket                string                         `json:"bucket" db:"bucket"`
	S3Key                 string                         `json:"s3Key" db:"s3_key"` // The document's key inside an S3 bucket; does *not* include the bucket name.
}
