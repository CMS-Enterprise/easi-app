package models

import "github.com/google/uuid"

// SystemIntakeDocumentCommonType represents the document type, including an "OTHER" option for user-specified types
type SystemIntakeDocumentCommonType string

const (
	// SystemIntakeDocumentCommonTypeSOOSOW means the document is an SOO or SOW
	SystemIntakeDocumentCommonTypeSOOSOW SystemIntakeDocumentCommonType = "SOO_SOW"
	// SystemIntakeDocumentCommonTypeDraftICGE means the document is a draft ICGE
	SystemIntakeDocumentCommonTypeDraftICGE SystemIntakeDocumentCommonType = "DRAFT_ICGE"
	// SystemIntakeDocumentCommonTypeDraftOther means the document is some type other than the common document types
	SystemIntakeDocumentCommonTypeDraftOther SystemIntakeDocumentCommonType = "OTHER"
)

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
