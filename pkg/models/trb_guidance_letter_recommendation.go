package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
	"github.com/lib/pq"
)

// TRBGuidanceLetterRecommendation represents the data for a TRB guidance letter recommendation
type TRBGuidanceLetterRecommendation struct {
	BaseStruct
	TRBRequestID     uuid.UUID      `json:"trbRequestId" db:"trb_request_id"`
	Title            string         `json:"title" db:"title"`
	Recommendation   HTML           `json:"recommendation" db:"recommendation"`
	Links            pq.StringArray `json:"links" db:"links"`
	PositionInLetter null.Int       `json:"positionInLetter" db:"position_in_letter"` // 0-based indexing
	DeletedAt        *time.Time     `json:"deletedAt" db:"deleted_at"`
}
