package models

import (
	"time"

	"github.com/google/uuid"
)

// TRBAdviceLetter represents the data for a TRB advice letter
type TRBAdviceLetter struct {
	BaseStruct
	TRBRequestID          uuid.UUID             `json:"trbRequestId" db:"trb_request_id"`
	Status                TRBAdviceLetterStatus `json:"status" db:"status"`
	MeetingSummary        *HTML                 `json:"meetingSummary" db:"meeting_summary"`
	NextSteps             *HTML                 `json:"nextSteps" db:"next_steps"`
	IsFollowupRecommended *bool                 `json:"isFollowupRecommended" db:"is_followup_recommended"`
	DateSent              *time.Time            `json:"dateSent" db:"date_sent"`

	// not necessarily a firm date; can be something like "In 6 months or when development is complete"
	FollowupPoint *string `json:"followupPoint" db:"followup_point"`
}
