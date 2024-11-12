package models

import (
	"time"

	"github.com/google/uuid"
)

// TRBGuidanceLetterStatus is an enumeration of the possible statuses of a TRBGuidanceLetter
type TRBGuidanceLetterStatus string

// These are the possible statuses for a TRB guidance letter
const (
	TRBGuidanceLetterStatusCannotStartYet TRBGuidanceLetterStatus = "CANNOT_START_YET"
	TRBGuidanceLetterStatusReadyToStart   TRBGuidanceLetterStatus = "READY_TO_START"
	TRBGuidanceLetterStatusInProgress     TRBGuidanceLetterStatus = "IN_PROGRESS"
	TRBGuidanceLetterStatusReadyForReview TRBGuidanceLetterStatus = "READY_FOR_REVIEW"
	TRBGuidanceLetterStatusCompleted      TRBGuidanceLetterStatus = "COMPLETED"
)

// TRBGuidanceLetterStatusTaskList is an enum of statuses for the task list page.
type TRBGuidanceLetterStatusTaskList string

// These statuses are a simplified version of the regular TRBGuidanceLetterStatus enum above that are computed in the resolver.
const (
	TRBGuidanceLetterStatusTaskListCannotStartYet TRBGuidanceLetterStatusTaskList = "CANNOT_START_YET"
	TRBGuidanceLetterStatusTaskListInReview       TRBGuidanceLetterStatusTaskList = "IN_REVIEW"
	TRBGuidanceLetterStatusTaskListCompleted      TRBGuidanceLetterStatusTaskList = "COMPLETED"
)

// TRBGuidanceLetter represents the data for a TRB guidance letter
type TRBGuidanceLetter struct {
	BaseStruct
	TRBRequestID          uuid.UUID               `json:"trbRequestId" db:"trb_request_id"`
	Status                TRBGuidanceLetterStatus `json:"status" db:"status"`
	MeetingSummary        *HTML                   `json:"meetingSummary" db:"meeting_summary"`
	NextSteps             *HTML                   `json:"nextSteps" db:"next_steps"`
	IsFollowupRecommended *bool                   `json:"isFollowupRecommended" db:"is_followup_recommended"`
	DateSent              *time.Time              `json:"dateSent" db:"date_sent"`

	// not necessarily a firm date; can be something like "In 6 months or when development is complete"
	FollowupPoint *string `json:"followupPoint" db:"followup_point"`
}

func (a TRBGuidanceLetter) GetMappingKey() uuid.UUID {
	return a.TRBRequestID
}
func (a TRBGuidanceLetter) GetMappingVal() *TRBGuidanceLetter {
	return &a
}
