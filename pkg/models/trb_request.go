package models

import "time"

// TRBRequest represents a TRB request object
type TRBRequest struct {
	baseStruct
	Name               string           `json:"name" db:"name"`
	Archived           bool             `json:"archived" db:"archived"`
	Type               TRBRequestType   `json:"type" db:"type"`     //TODO should this be a type?
	Status             TRBRequestStatus `json:"status" db:"status"` //TODO should this be a type?
	ConsultMeetingTime *time.Time       `json:"consultMeetingTime" db:"consult_meeting_time"`
	TRBLead            *string          `json:"trbLead" db:"trb_lead"`
}

// NewTRBRequest returns a new trb request object
func NewTRBRequest(createdBy string) *TRBRequest {
	return &TRBRequest{
		Name:       "Draft",
		baseStruct: NewBaseStruct(createdBy),
	}

}

// TRBRequestType represents the types of TRBRequestType types
type TRBRequestType string

// These are the options for TRBRequestType
const (
	TRBTNeedHelp     TRBRequestType = "NEED_HELP"
	TRBTBrainstorm   TRBRequestType = "BRAINSTORM"
	TRBTFollowup     TRBRequestType = "FOLLOWUP"
	TRBTFormalReview TRBRequestType = "FORMAL_REVIEW"
)

// TRBRequestStatus represents the types of TRBRequestStatus types
type TRBRequestStatus string

// These are the options for TRBRequestStatus
const (
	TRBSOpen   TRBRequestStatus = "OPEN"
	TRBSClosed TRBRequestStatus = "CLOSED"
)

// TRBFeedbackStatus represents the types of TRBFeedbackStatus types
type TRBFeedbackStatus string

// These are the options for TRBFeedbackStatus
const (
	TRBFeedbackStatusCannotStartYet TRBFeedbackStatus = "CANNOT_START_YET"
	TRBFeedbackStatusInReview       TRBFeedbackStatus = "IN_REVIEW"
	TRBFeedbackStatusEditsRequested TRBFeedbackStatus = "EDITS_REQUESTED"
	TRBFeedbackStatusCompleted      TRBFeedbackStatus = "COMPLETED"
)

// TRBConsultPrepStatus represents the types of TRBConsultPrepStatus types
type TRBConsultPrepStatus string

// These are the options for TRBConsultPrepStatus
const (
	TRBConsultPrepStatusCannotStartYet TRBConsultPrepStatus = "CANNOT_START_YET"
	TRBConsultPrepStatusReadyToStart   TRBConsultPrepStatus = "READY_TO_START"
	TRBConsultPrepStatusCompleted      TRBConsultPrepStatus = "COMPLETED"
)

// TRBAttendConsultStatus represents the types of TRBAttendConsultStatus types
type TRBAttendConsultStatus string

// These are the options for TRBAttendConsultStatus
const (
	TRBAttendConsultStatusCannotStartYet  TRBAttendConsultStatus = "CANNOT_START_YET"
	TRBAttendConsultStatusReadyToSchedule TRBAttendConsultStatus = "READY_TO_SCHEDULE"
	TRBAttendConsultStatusScheduled       TRBAttendConsultStatus = "SCHEDULED"
	TRBAttendConsultStatusCompleted       TRBAttendConsultStatus = "COMPLETED"
)

// TRBTaskStatuses contains the individual statuses for the steps of the TRB task list
type TRBTaskStatuses struct {
	FormStatus          TRBFormStatus          `json:"formStatus"`
	FeedbackStatus      TRBFeedbackStatus      `json:"feedbackStatus"`
	ConsultPrepStatus   TRBConsultPrepStatus   `json:"consultPrepStatus"`
	AttendConsultStatus TRBAttendConsultStatus `json:"attendConsultStatus"`
	AdviceLetterStatus  TRBAdviceLetterStatus  `json:"adviceLetterStatus"`
}
