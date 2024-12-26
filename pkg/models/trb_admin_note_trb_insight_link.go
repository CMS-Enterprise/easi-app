package models

import "github.com/google/uuid"

// TRBAdminNoteTRBGuidanceLetterInsightLink represents an association between a TRB admin note (in the Guidance Letter category)
// and a TRB guidance letter insight
type TRBAdminNoteTRBGuidanceLetterInsightLink struct {
	BaseStruct
	TRBRequestID                      uuid.UUID `json:"trbRequestId" db:"trb_request_id"`
	TRBAdminNoteID                    uuid.UUID `json:"trbAdminNoteId" db:"trb_admin_note_id"`
	TRBGuidanceLetterRecommendationID uuid.UUID `json:"trbGuidanceLetterRecommendationId" db:"trb_guidance_letter_recommendation_id"`
}
