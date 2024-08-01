package models

import (
	"time"

	"github.com/google/uuid"
)

// TRBRequestDocumentStatus represents the availability of a document in regards to virus scanning
type TRBRequestDocumentStatus string

// TRBDocumentCommonType represents the document type, including an "OTHER" option for user-specified types
type TRBDocumentCommonType string

const (
	// TRBRequestDocumentStatusAvailable means that the document passed the virus scanning
	TRBRequestDocumentStatusAvailable TRBRequestDocumentStatus = "AVAILABLE"
	// TRBRequestDocumentStatusPending means that the document was just uploaded and hasn't yet been scanned for viruses
	TRBRequestDocumentStatusPending TRBRequestDocumentStatus = "PENDING"
	// TRBRequestDocumentStatusUnavailable means that the document failed virus scanning
	TRBRequestDocumentStatusUnavailable TRBRequestDocumentStatus = "UNAVAILABLE"

	// TRBRequestDocumentCommonTypeArchitectureDiagram means the document is an architecture diagram
	TRBRequestDocumentCommonTypeArchitectureDiagram TRBDocumentCommonType = "ARCHITECTURE_DIAGRAM"
	// TRBRequestDocumentCommonTypePresentationSlideDeck means the document is a presentation slide deck
	TRBRequestDocumentCommonTypePresentationSlideDeck TRBDocumentCommonType = "PRESENTATION_SLIDE_DECK"
	// TRBRequestDocumentCommonTypeBusinessCase means the document is a business case
	TRBRequestDocumentCommonTypeBusinessCase TRBDocumentCommonType = "BUSINESS_CASE"
	// TRBRequestDocumentCommonTypeOther means the document is some type other than the common document types
	TRBRequestDocumentCommonTypeOther TRBDocumentCommonType = "OTHER"
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

func (d TRBRequestDocument) GetMappingKey() uuid.UUID {
	return d.TRBRequestID
}
func (d TRBRequestDocument) GetMappingVal() *TRBRequestDocument {
	return &d
}
