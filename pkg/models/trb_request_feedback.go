package models

import (
	"github.com/google/uuid"
	"github.com/lib/pq"
)

// TRBRequestFeedback represents an individual feedback item given on a TRB request
type TRBRequestFeedback struct {
	BaseStruct
	TRBRequestID    uuid.UUID         `json:"trbRequestId" db:"trb_request_id"`
	FeedbackMessage HTML              `json:"feedbackMessage" db:"feedback_message"`
	CopyTRBMailbox  bool              `json:"copyTrbMailbox" db:"copy_trb_mailbox"`
	NotifyEUAIDs    pq.StringArray    `json:"notifyEuaIds" db:"notify_eua_ids"`
	Action          TRBFeedbackAction `json:"action" db:"action"`
}
