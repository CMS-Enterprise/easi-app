package models

import (
	"github.com/google/uuid"
	"github.com/lib/pq"
)

// TRBRequestFeedback represents an individual feedback item given on a TRB request
type TRBRequestFeedback struct {
	baseStruct
	TRBRequestID    uuid.UUID         `json:"trbRequestId" db:"trb_request_id"`
	FeedbackMessage string            `json:"feedbackMessage" db:"feedback_message"`
	CopyTRBMailbox  bool              `json:"copyTrbMailbox" db:"copy_trb_mailbox"`
	NotifyEUAIDs    pq.StringArray    `json:"notifyEuaIds" db:"notify_eua_ids"`
	Status          TRBFeedbackStatus `json:"status" db:"status"`
}
