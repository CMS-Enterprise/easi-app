package models

import (
	"time"

	"github.com/google/uuid"
)

// TRBAdviceLetterStatus is an enumeration of the possible statuses of a TRBAdviceLetter
type TRBAdviceLetterStatus string

// These are the possible statuses for a TRB advice letter
const (
	TRBAdviceLetterStatusCannotStartYet TRBAdviceLetterStatus = "CANNOT_START_YET"
	TRBAdviceLetterStatusReadyToStart   TRBAdviceLetterStatus = "READY_TO_START"
	TRBAdviceLetterStatusInProgress     TRBAdviceLetterStatus = "IN_PROGRESS"
	TRBAdviceLetterStatusReadyForReview TRBAdviceLetterStatus = "READY_FOR_REVIEW"
	TRBAdviceLetterStatusCompleted      TRBAdviceLetterStatus = "COMPLETED"
)

// TRBAdviceLetterStatusTaskList is an enum of statuses for the task list page.
type TRBAdviceLetterStatusTaskList string

// These statuses are a simplified version of the regular TRBAdviceLetterStatus enum above that are computed in the resolver.
const (
	TRBAdviceLetterStatusTaskListCannotStartYet TRBAdviceLetterStatusTaskList = "CANNOT_START_YET"
	TRBAdviceLetterStatusTaskListInReview       TRBAdviceLetterStatusTaskList = "IN_REVIEW"
	TRBAdviceLetterStatusTaskListCompleted      TRBAdviceLetterStatusTaskList = "COMPLETED"
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

func (a TRBAdviceLetter) GetMappingKey() uuid.UUID {
	return a.TRBRequestID
}
func (a TRBAdviceLetter) GetMappingVal() *TRBAdviceLetter {
	return &a
}
