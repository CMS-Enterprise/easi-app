package models

import (
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
	"github.com/lib/pq"
)

// TRBGuidanceLetterRecommendation represents the data for a TRB guidance letter recommendation
type TRBGuidanceLetterRecommendation struct {
	BaseStruct
	TRBRequestID     uuid.UUID                               `json:"trbRequestId" db:"trb_request_id"`
	Title            string                                  `json:"title" db:"title"`
	Recommendation   HTML                                    `json:"recommendation" db:"recommendation"`
	Links            pq.StringArray                          `json:"links" db:"links"`
	PositionInLetter null.Int                                `json:"positionInLetter" db:"position_in_letter"` // 0-based indexing
	DeletedAt        *time.Time                              `json:"deletedAt" db:"deleted_at"`
	Category         TRBGuidanceLetterRecommendationCategory `json:"category" db:"category"`
}

type TRBGuidanceLetterRecommendationCategory string

const (
	TRBGuidanceLetterRecommendationCategoryRequirement    TRBGuidanceLetterRecommendationCategory = "REQUIREMENT"
	TRBGuidanceLetterRecommendationCategoryRecommendation TRBGuidanceLetterRecommendationCategory = "RECOMMENDATION"
	TRBGuidanceLetterRecommendationCategoryConsideration  TRBGuidanceLetterRecommendationCategory = "CONSIDERATION"
	TRBGuidanceLetterRecommendationCategoryUncategorized  TRBGuidanceLetterRecommendationCategory = "UNCATEGORIZED"
)

var AllTRBGuidanceLetterRecommendationCategory = []TRBGuidanceLetterRecommendationCategory{
	TRBGuidanceLetterRecommendationCategoryRequirement,
	TRBGuidanceLetterRecommendationCategoryRecommendation,
	TRBGuidanceLetterRecommendationCategoryConsideration,
	TRBGuidanceLetterRecommendationCategoryUncategorized,
}

func (e TRBGuidanceLetterRecommendationCategory) IsValid() bool {
	switch e {
	case TRBGuidanceLetterRecommendationCategoryRequirement, TRBGuidanceLetterRecommendationCategoryRecommendation, TRBGuidanceLetterRecommendationCategoryConsideration, TRBGuidanceLetterRecommendationCategoryUncategorized:
		return true
	}
	return false
}

func (e TRBGuidanceLetterRecommendationCategory) String() string {
	return string(e)
}

// UnmarshalGQL is a custom implementation of what gqlgen would normally generate
// this allows for both required (TRBGuidanceLetterRecommendationCategory!) and optional (TRBGuidanceLetterRecommendationCategory) values
// see Note [gql enums]
func (e *TRBGuidanceLetterRecommendationCategory) UnmarshalGQL(v interface{}) error {
	switch t := v.(type) {
	case *TRBGuidanceLetterRecommendationCategory:
		if t == nil {
			return errors.New("unexpected nil TRBGuidanceLetterRecommendationCategory when unmarshalling")
		}

		*e = *t
		if !e.IsValid() {
			return fmt.Errorf("%s is not a valid TRBGuidanceLetterRecommendationCategory", t.String())
		}

		return nil
	case TRBGuidanceLetterRecommendationCategory:
		*e = t
		if !e.IsValid() {
			return fmt.Errorf("%s is not a valid TRBGuidanceLetterRecommendationCategory", t.String())
		}

		return nil

	case string:
		*e = TRBGuidanceLetterRecommendationCategory(t)
		if !e.IsValid() {
			return fmt.Errorf("%s is not a valid TRBGuidanceLetterRecommendationCategory", t)
		}

		return nil

	case *string:
		if t == nil {
			return errors.New("unexpected nil string when unmarshalling TRBGuidanceLetterRecommendationCategory")
		}

		*e = TRBGuidanceLetterRecommendationCategory(*t)
		if !e.IsValid() {
			return fmt.Errorf("%s is not a valid TRBGuidanceLetterRecommendationCategory", *t)
		}

		return nil
	}

	return fmt.Errorf("could not parse %v as a TRBGuidanceLetterRecommendationCategory", v)
}

// Note [gql enums]
// For cases where the error "enums must be strings" is seen, this can be caused by sending an enum value
// to an endpoint which takes in a @goModel(model: "map[string]interface{}")
// GQL is unable to interpret the incoming value as a string, so we have to customize this behavior
// possibly a bug in gqlgen library
