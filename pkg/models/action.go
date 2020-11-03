package models

import (
	"time"

	"github.com/google/uuid"
)

// ActionType represents type of action
type ActionType string

const (
	// ActionTypeSUBMITINTAKE captures enum value SUBMIT_INTAKE
	ActionTypeSUBMITINTAKE ActionType = "SUBMIT_INTAKE"
	// ActionTypeNOTITREQUEST captures enum value NOT_IT_REQUEST
	ActionTypeNOTITREQUEST ActionType = "NOT_IT_REQUEST"
	// ActionTypeNEEDBIZCASE captures enum value NEED_BIZ_CASE
	ActionTypeNEEDBIZCASE ActionType = "NEED_BIZ_CASE"
	// ActionTypeREADYFORGRT captures enum value READY_FOR_GRT
	ActionTypeREADYFORGRT ActionType = "READY_FOR_GRT"
	// ActionTypeREADYFORGRB captures enum value READY_FOR_GRB
	ActionTypeREADYFORGRB ActionType = "READY_FOR_GRB"
	// ActionTypePROVIDEFEEDBACKNEEDBIZCASE captures enum value PROVIDE_FEEDBACK_NEED_BIZ_CASE
	ActionTypePROVIDEFEEDBACKNEEDBIZCASE = "PROVIDE_FEEDBACK_NEED_BIZ_CASE"
	// ActionTypeISSUELCID captures enum value ISSUE_LCID
	ActionTypeISSUELCID ActionType = "ISSUE_LCID"
	// ActionTypeSUBMITBIZCASE captures enum value SUBMIT_BIZ_CASE
	ActionTypeSUBMITBIZCASE ActionType = "SUBMIT_BIZ_CASE"
)

// Action is the model for an action on a system intake
type Action struct {
	ID             uuid.UUID  `json:"id"`
	IntakeID       *uuid.UUID `db:"intake_id"`
	BusinessCaseID *uuid.UUID `db:"business_case_id"`
	ActionType     ActionType `json:"actionType" db:"action_type"`
	ActorName      string     `json:"actorName" db:"actor_name"`
	ActorEmail     string     `json:"actorEmail" db:"actor_email"`
	ActorEUAUserID string     `json:"actorEuaUserId" db:"actor_eua_user_id"`
	Feedback       string
	CreatedAt      *time.Time `json:"createdAt" db:"created_at"`
}
