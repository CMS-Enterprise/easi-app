package models

import "github.com/google/uuid"

// TRBAdminNoteCategory is an enumeration of the possible categories of a TRBAdminNote
type TRBAdminNoteCategory string

// These are the possible categories for a TRB admin note
const (
	TRBAdminNoteCategoryGeneralRequest      TRBAdminNoteCategory = "GENERAL_REQUEST"
	TRBAdminNoteCategoryInitialRequestForm  TRBAdminNoteCategory = "INITIAL_REQUEST_FORM"
	TRBAdminNoteCategorySupportingDocuments TRBAdminNoteCategory = "SUPPORTING_DOCUMENTS"
	TRBAdminNoteCategoryConsultSession      TRBAdminNoteCategory = "CONSULT_SESSION"
	TRBAdminNoteCategoryAdviceLetter        TRBAdminNoteCategory = "ADVICE_LETTER"
)

// TRBAdminNote represents the data for a note attached to a TRB request by an admin
type TRBAdminNote struct {
	BaseStruct
	TRBRequestID uuid.UUID            `json:"trbRequestId" db:"trb_request_id"`
	Category     TRBAdminNoteCategory `json:"category" db:"category"`
	NoteText     HTML                 `json:"noteText" db:"note_text"`
	IsArchived   bool                 `json:"isArchived" db:"is_archived"`
}
