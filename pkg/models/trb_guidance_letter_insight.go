package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
	"github.com/lib/pq"
)

// TRBGuidanceLetterInsight represents the data for a TRB guidance letter insight
type TRBGuidanceLetterInsight struct {
	BaseStruct
	TRBRequestID     uuid.UUID                        `json:"trbRequestId" db:"trb_request_id"`
	Title            string                           `json:"title" db:"title"`
	Recommendation   HTML                             `json:"recommendation" db:"recommendation"`
	Links            pq.StringArray                   `json:"links" db:"links"`
	PositionInLetter null.Int                         `json:"positionInLetter" db:"position_in_letter"` // 0-based indexing
	DeletedAt        *time.Time                       `json:"deletedAt" db:"deleted_at"`
	Category         TRBGuidanceLetterInsightCategory `json:"category" db:"category"`
}

// TRBGuidanceLetterInsightCategory implemented here instead of in gen files
// see Note [gql enums]
type TRBGuidanceLetterInsightCategory string

const (
	TRBGuidanceLetterInsightCategoryRequirement    TRBGuidanceLetterInsightCategory = "REQUIREMENT"
	TRBGuidanceLetterInsightCategoryRecommendation TRBGuidanceLetterInsightCategory = "RECOMMENDATION"
	TRBGuidanceLetterInsightCategoryConsideration  TRBGuidanceLetterInsightCategory = "CONSIDERATION"
	TRBGuidanceLetterInsightCategoryUncategorized  TRBGuidanceLetterInsightCategory = "UNCATEGORIZED"
)

var AllTRBGuidanceLetterInsightCategory = []TRBGuidanceLetterInsightCategory{
	TRBGuidanceLetterInsightCategoryRequirement,
	TRBGuidanceLetterInsightCategoryRecommendation,
	TRBGuidanceLetterInsightCategoryConsideration,
	TRBGuidanceLetterInsightCategoryUncategorized,
}

func (t TRBGuidanceLetterInsightCategory) String() string {
	return string(t)
}

// Note [gql enums]
// For cases where the error "enums must be strings" is seen, this can be caused by sending an enum value
// to an endpoint which takes in a @goModel(model: "map[string]interface{}")
// GQL is unable to interpret the incoming value as a string, so we have to customize this behavior
// possibly a bug in gqlgen library
