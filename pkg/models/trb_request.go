package models

import (
	"time"

	"github.com/guregu/null/zero"
)

// TRBRequest represents a TRB request object
type TRBRequest struct {
	BaseStruct
	Name               *string              `json:"name" db:"name"`
	Archived           bool                 `json:"archived" db:"archived"`
	Type               TRBRequestType       `json:"type" db:"type"`
	State              TRBRequestState      `json:"state" db:"state"`
	ConsultMeetingTime *time.Time           `json:"consultMeetingTime" db:"consult_meeting_time"`
	TRBLead            *string              `json:"trbLead" db:"trb_lead"`
	ContractName       zero.String          `json:"contractName" db:"contract_name"`
	SystemRelationType *RequestRelationType `json:"relationType" db:"system_relation_type"`
}

// NewTRBRequest returns a new trb request object
func NewTRBRequest(createdBy string) *TRBRequest {
	return &TRBRequest{
		BaseStruct: NewBaseStruct(createdBy),
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
	TRBTOther        TRBRequestType = "OTHER"
)

// TRBRequestState represents the types of TRBRequestState types
type TRBRequestState string

// These are the options for TRBRequestStatus
const (
	TRBRequestStateOpen   TRBRequestState = "OPEN"
	TRBRequestStateClosed TRBRequestState = "CLOSED"
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
	FormStatus                 TRBFormStatus                 `json:"formStatus"`
	FeedbackStatus             TRBFeedbackStatus             `json:"feedbackStatus"`
	ConsultPrepStatus          TRBConsultPrepStatus          `json:"consultPrepStatus"`
	AttendConsultStatus        TRBAttendConsultStatus        `json:"attendConsultStatus"`
	AdviceLetterStatus         TRBAdviceLetterStatus         `json:"adviceLetterStatus"`
	AdviceLetterStatusTaskList TRBAdviceLetterStatusTaskList `json:"adviceLetterStatusTaskList"`
}

// TRBRequestStatus is an enumeration of the possible values for the overall status of a TRB request
type TRBRequestStatus string

// These are the possible values for TRBRequestStatus
const (
	TRBRequestStatusNew                  = "NEW"
	TRBRequestStatusDraftRequestForm     = "DRAFT_REQUEST_FORM"
	TRBRequestStatusRequestFormComplete  = "REQUEST_FORM_COMPLETE"
	TRBRequestStatusReadyForConsult      = "READY_FOR_CONSULT"
	TRBRequestStatusConsultScheduled     = "CONSULT_SCHEDULED"
	TRBRequestStatusConsultComplete      = "CONSULT_COMPLETE"
	TRBRequestStatusDraftAdviceLetter    = "DRAFT_ADVICE_LETTER"
	TRBRequestStatusAdviceLetterInReview = "ADVICE_LETTER_IN_REVIEW"
	TRBRequestStatusAdviceLetterSent     = "ADVICE_LETTER_SENT"
	TRBRequestStatusFollowUpRequested    = "FOLLOW_UP_REQUESTED"
)

// GetName returns the name of the TRB request as a string. If the "Name" property is nil, it returns "Draft"
func (t *TRBRequest) GetName() string {
	if t.Name != nil {
		return *t.Name
	}

	return "Draft"
}
