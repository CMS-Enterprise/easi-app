package models

// TRBRequest represents a TRB request object
type TRBRequest struct {
	baseStruct
	Name      string                `json:"name" db:"name"`
	Archived  bool                  `json:"archived" db:"archived"`
	Type      TRBRequestType        `json:"type" db:"type"`     //TODO should this be a type?
	Status    TRBRequestStatus      `json:"status" db:"status"` //TODO should this be a type?
	Attendees []*TRBRequestAttendee `json:"attendees"`
}

// NewTRBRequest returns a new trb request object
func NewTRBRequest(createdBy string) *TRBRequest {
	return &TRBRequest{
		Name:       "Draft",
		baseStruct: NewBaseStruct(createdBy),
	}

}

// TRBRequestType represents the types of TRBRequestType types.
type TRBRequestType string

// These are the options for TRBRequestType
const (
	TRBTNeedHelp     TRBRequestType = "NEED_HELP"
	TRBTBrainstorm   TRBRequestType = "BRAINSTORM"
	TRBTFollowup     TRBRequestType = "FOLLOWUP"
	TRBTFormalReview TRBRequestType = "FORMAL_REVIEW"
)

// TRBRequestStatus represents the types of TRBRequestStatus types.
type TRBRequestStatus string

// These are the options for TRBRequestStatus
const (
	TRBSOpen   TRBRequestStatus = "OPEN"
	TRBSClosed TRBRequestStatus = "CLOSED"
)
