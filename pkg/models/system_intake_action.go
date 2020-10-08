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
	IntakeID       uuid.UUID              `json:"intakeId" db:"intake_id"`
	ActionType     SystemIntakeActionType `json:"actionType" db:"action_type"`
	ActorName      string                 `json:"actorName" db:"actor_name"`
	ActorEmail     string                 `json:"actorEmail" db:"actor_email"`
	ActorEUAUserID string                 `json:"actorEuaUserId" db:"actor_eua_user_id"`
	CreatedAt      *time.Time             `json:"createdAt" db:"created_at"`
}
