package models

import "github.com/google/uuid"

// SystemIntakeDocumentStatus represents the availability of a document in regards to virus scanning
type SystemIntakeDocumentStatus string

// SystemIntakeDocumentCommonType represents the document type, including an "OTHER" option for user-specified types
type SystemIntakeDocumentCommonType string

type DocumentUploaderRole string

const (
	// SystemIntakeDocumentStatusAvailable means that the document passed the virus scanning
	SystemIntakeDocumentStatusAvailable SystemIntakeDocumentStatus = "AVAILABLE"
	// SystemIntakeDocumentStatusPending means that the document was just uploaded and hasn't yet been scanned for viruses
	SystemIntakeDocumentStatusPending SystemIntakeDocumentStatus = "PENDING"
	// SystemIntakeDocumentStatusUnavailable means that the document failed virus scanning
	SystemIntakeDocumentStatusUnavailable SystemIntakeDocumentStatus = "UNAVAILABLE"

	// SystemIntakeDocumentCommonTypeSOOSOW means the document is an SOO or SOW
	SystemIntakeDocumentCommonTypeSOOSOW SystemIntakeDocumentCommonType = "SOO_SOW"
	// SystemIntakeDocumentCommonTypeDraftICGE means the document is a draft ICGE
	SystemIntakeDocumentCommonTypeDraftICGE SystemIntakeDocumentCommonType = "DRAFT_ICGE"
	// SystemIntakeDocumentCommonTypeDraftOther means the document is some type other than the common document types
	SystemIntakeDocumentCommonTypeDraftOther SystemIntakeDocumentCommonType = "OTHER"

	// RequesterUploaderRole signifies a Requester uploaded a document
	RequesterUploaderRole DocumentUploaderRole = "REQUESTER"
	// AdminUploaderRole signifies an Admin uploaded a document
	AdminUploaderRole DocumentUploaderRole = "ADMIN"
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
	UploaderRole          DocumentUploaderRole           `json:"uploaderRole" db:"uploader_role"`
}
