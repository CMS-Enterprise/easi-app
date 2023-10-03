package models

import (
	"github.com/google/uuid"
	"github.com/lib/pq"
)

// TRBAdviceLetterRecommendation represents the data for a TRB advice letter recommendation
type TRBAdviceLetterRecommendation struct {
	BaseStruct
	TRBRequestID   uuid.UUID      `json:"trbRequestId" db:"trb_request_id"`
	Title          string         `json:"title" db:"title"`
	Recommendation HTML           `json:"recommendation" db:"recommendation"`
	Links          pq.StringArray `json:"links" db:"links"`

	// TODO - should this just be a regular field? when inserting it, database is probably going to override it
	OrderInLetter int `json:"orderInLetter" db:"order_in_letter"`
}
