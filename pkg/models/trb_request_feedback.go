package models

import (
	"github.com/google/uuid"
	"github.com/lib/pq"
)

// TRBFeedbackAction is an enumertion of actions that can be taken by a TRB admin during the
// feedback step
type TRBFeedbackAction string

// These are the options for TRBFeedbackAction
const (
	TRBFeedbackActionRequestEdits    TRBFeedbackAction = "REQUEST_EDITS"
	TRBFeedbackActionReadyForConsult TRBFeedbackAction = "READY_FOR_CONSULT"
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

func (tf TRBRequestFeedback) GetMappingKey() uuid.UUID {
	return tf.TRBRequestID
}
func (tf TRBRequestFeedback) GetMappingVal() *TRBRequestFeedback {
	return &tf
}
