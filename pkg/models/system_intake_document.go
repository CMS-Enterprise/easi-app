package models

import "github.com/google/uuid"

// SystemIntakeDocumentStatus represents the availability of a document in regards to virus scanning
type SystemIntakeDocumentStatus string

// SystemIntakeDocumentCommonType represents the document type, including an "OTHER" option for user-specified types
type SystemIntakeDocumentCommonType string

// SystemIntakeDocumentVersion represents whether a document is recent and relevant or included for historical purposes
type SystemIntakeDocumentVersion string

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
	// SystemIntakeDocumentCommonTypeDraftIGCE means the document is a draft IGCE
	SystemIntakeDocumentCommonTypeDraftIGCE SystemIntakeDocumentCommonType = "DRAFT_IGCE"
	// SystemIntakeDocumentCommonTypeACQPLANSTRAT means the document is an Acquisition Plan or Strategy
	SystemIntakeDocumentCommonTypeACQPLANSTRAT SystemIntakeDocumentCommonType = "ACQUISITION_PLAN_OR_STRATEGY"
	// SystemIntakeDocumentCommonTypeMEETINGMINS means the document is Meeting Minutes
	SystemIntakeDocumentCommonTypeMEETINGMINS SystemIntakeDocumentCommonType = "MEETING_MINUTES"
	// SystemIntakeDocumentCommonTypeRAF means the document is a Request for Add'l Funding
	SystemIntakeDocumentCommonTypeRAF SystemIntakeDocumentCommonType = "REQUEST_FOR_ADDITIONAL_FUNDING"
	// SystemIntakeDocumentCommonTypeDraftOther means the document is some type other than the common document types
	SystemIntakeDocumentCommonTypeDraftOther SystemIntakeDocumentCommonType = "OTHER"

	// SystemIntakeDocumentVersionCURRENT means the document is current and relevant to the request
	SystemIntakeDocumentVersionCURRENT SystemIntakeDocumentVersion = "CURRENT"
	// SystemIntakeDocumentVersionHISTORICAL means the doc is included for historical context
	SystemIntakeDocumentVersionHISTORICAL SystemIntakeDocumentVersion = "HISTORICAL"

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
	Version               SystemIntakeDocumentVersion    `db:"document_version" json:"version"`
	OtherType             string                         `db:"other_type"`
	FileName              string                         `json:"fileName" db:"file_name"`
	Bucket                string                         `json:"bucket" db:"bucket"`
	S3Key                 string                         `json:"s3Key" db:"s3_key"` // The document's key inside an S3 bucket; does *not* include the bucket name.
	UploaderRole          DocumentUploaderRole           `json:"uploaderRole" db:"uploader_role"`
}

func (d SystemIntakeDocument) GetMappingKey() uuid.UUID {
	return d.SystemIntakeRequestID
}
func (d SystemIntakeDocument) GetMappingVal() *SystemIntakeDocument {
	return &d
}
