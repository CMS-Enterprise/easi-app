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

// TRBTaskStatuses contains the individual statuses for the steps of the TRB task list
type TRBTaskStatuses struct {
	FormStatus                 TRBFormStatus                 `json:"formStatus"`
	FeedbackStatus             TRBFeedbackStatus             `json:"feedbackStatus"`
	ConsultPrepStatus          TRBConsultPrepStatus          `json:"consultPrepStatus"`
	AttendConsultStatus        TRBAttendConsultStatus        `json:"attendConsultStatus"`
	AdviceLetterStatus         TRBAdviceLetterStatus         `json:"adviceLetterStatus"`
	AdviceLetterStatusTaskList TRBAdviceLetterStatusTaskList `json:"adviceLetterStatusTaskList"`
}

// GetName returns the name of the TRB request as a string. If the "Name" property is nil, it returns "Draft"
func (t *TRBRequest) GetName() string {
	if t.Name != nil {
		return *t.Name
	}

	return "Draft"
}
