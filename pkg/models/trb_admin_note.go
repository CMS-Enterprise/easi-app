package models

import (
	"github.com/google/uuid"
	"github.com/guregu/null"
)

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

	// category-specific fields
	// all are nullable because that's how we represent them in SQL
	// but a category's specific fields should be treated as required for a note in that category

	// General Request - no additional fields

	// Initial Request Form
	AppliesToBasicRequestDetails null.Bool `json:"appliesToBasicRequestDetails" db:"applies_to_basic_request_details"`
	AppliesToSubjectAreas        null.Bool `json:"appliesToSubjectAreas" db:"applies_to_subject_areas"`
	AppliesToAttendees           null.Bool `json:"appliesToAttendees" db:"applies_to_attendees"`

	// Supporting Documents - no additional fields in this model
	// the list of supporting documents in the GQL schema is handled by a many-to-many link table with a separate model

	// Consult Session - no additional fields

	// Advice Letter
	AppliesToMeetingSummary null.Bool `json:"appliesToMeetingSummary" db:"applies_to_meeting_summary"`
	AppliesToNextSteps      null.Bool `json:"appliesToNextSteps" db:"applies_to_next_steps"`
	// the list of recommendations in the GQL schema is handled by a many-to-many link table with a separate model
}

func (n TRBAdminNote) GetMappingKey() uuid.UUID {
	return n.TRBRequestID
}
func (n TRBAdminNote) GetMappingVal() *TRBAdminNote {
	return &n
}
