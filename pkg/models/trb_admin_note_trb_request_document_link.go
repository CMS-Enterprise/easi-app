package models

import "github.com/google/uuid"

// TRBAdminNoteTRBRequestDocumentLink represents an association between a TRB admin note (in the Supporting Documents category) and a TRB document
type TRBAdminNoteTRBRequestDocumentLink struct {
	BaseStruct
	TRBAdminNoteID       uuid.UUID `json:"trbAdminNoteId" db:"trb_admin_note_id"`
	TRBRequestDocumentID uuid.UUID `json:"trbRequestDocumentId" db:"trb_request_document_id"`
}
