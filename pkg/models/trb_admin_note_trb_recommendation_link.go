package models

import "github.com/google/uuid"

// TRBAdminNoteTRBAdviceLetterRecommendationLink represents an association between a TRB admin note (in the Advice Letter category)
// and a TRB advice letter recommendation
type TRBAdminNoteTRBAdviceLetterRecommendationLink struct {
	BaseStruct
	TRBRequestID                    uuid.UUID `json:"trbRequestId" db:"trb_request_id"`
	TRBAdminNoteID                  uuid.UUID `json:"trbAdminNoteId" db:"trb_admin_note_id"`
	TRBAdviceLetterRecommendationID uuid.UUID `json:"trbAdviceLetterRecommendationId" db:"trb_advice_letter_recommendation_id"`
}
