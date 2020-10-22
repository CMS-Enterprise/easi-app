package models

import (
	"time"

	"github.com/google/uuid"
)

// ActionType represents type of action
type ActionType string

const (
	// ActionTypeSUBMIT captures enum value SUBMIT
	ActionTypeSUBMIT ActionType = "SUBMIT"
	// ActionTypeNOTITREQUEST captures enum value NOT_IT_REQUEST
	ActionTypeNOTITREQUEST ActionType = "NOT_IT_REQUEST"
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
