package models

import (
	"time"

	"github.com/google/uuid"
)

// SystemIntakeActionType represents type of action
type SystemIntakeActionType string

const (
	// SystemIntakeActionTypeSUBMIT captures enum value SUBMIT
	SystemIntakeActionTypeSUBMIT SystemIntakeActionType = "SUBMIT"
)

// SystemIntakeAction is the model for an action on a system intake
type SystemIntakeAction struct {
	ID             uuid.UUID              `json:"id"`
	IntakeID       uuid.UUID              `json:"intake_id" db:"intake_id"`
	ActionType     SystemIntakeActionType `json:"action_type" db:"action_type"`
	ActorName      string                 `json:"actor_name" db:"actor_name"`
	ActorEmail     string                 `json:"actor_email" db:"actor_email"`
	ActorEUAUserID string                 `json:"actor_eua_user_id" db:"actor_eua_user_id"`
	CreatedAt      *time.Time             `json:"createdAt" db:"created_at"`
}
