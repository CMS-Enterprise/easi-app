package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
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
	ActionTypePROVIDEFEEDBACKNEEDBIZCASE ActionType = "PROVIDE_FEEDBACK_NEED_BIZ_CASE"
	// ActionTypeISSUELCID captures enum value ISSUE_LCID
	ActionTypeISSUELCID ActionType = "ISSUE_LCID"
	// ActionTypeCREATEBIZCASE captures enum value CREATE_BIZ_CASE
	ActionTypeCREATEBIZCASE ActionType = "CREATE_BIZ_CASE"
	// ActionTypeSUBMITBIZCASE captures enum value SUBMIT_BIZ_CASE
	ActionTypeSUBMITBIZCASE ActionType = "SUBMIT_BIZ_CASE"
	// ActionTypeSUBMITFINALBIZCASE captures enum value SUBMIT_FINAL_BIZ_CASE
	ActionTypeSUBMITFINALBIZCASE ActionType = "SUBMIT_FINAL_BIZ_CASE"
	// ActionTypeBIZCASENEEDSCHANGES captures enum value BIZ_CASE_NEEDS_CHANGES
	ActionTypeBIZCASENEEDSCHANGES ActionType = "BIZ_CASE_NEEDS_CHANGES"
	// ActionTypePROVIDEFEEDBACKBIZCASENEEDSCHANGES captures enum value PROVIDE_GRT_FEEDBACK_BIZ_CASE_DRAFT
	ActionTypePROVIDEFEEDBACKBIZCASENEEDSCHANGES ActionType = "PROVIDE_GRT_FEEDBACK_BIZ_CASE_DRAFT"
	// ActionTypePROVIDEFEEDBACKBIZCASEFINAL captures enum value PROVIDE_GRT_FEEDBACK_BIZ_CASE_FINAL
	ActionTypePROVIDEFEEDBACKBIZCASEFINAL ActionType = "PROVIDE_GRT_FEEDBACK_BIZ_CASE_FINAL"
	// ActionTypeNOGOVERNANCENEEDED captures enum value NO_GOVERNANCE_NEEDED
	ActionTypeNOGOVERNANCENEEDED ActionType = "NO_GOVERNANCE_NEEDED"
	// ActionTypeREJECT captures enum value REJECTED
	ActionTypeREJECT ActionType = "REJECT"
	// ActionTypeSENDEMAIL captures enum value SEND_EMAIL
	ActionTypeSENDEMAIL ActionType = "SEND_EMAIL"
	// ActionTypeGUIDERECEIVEDCLOSE captures enum value GUIDE_RECEIVED_CLOSE
	ActionTypeGUIDERECEIVEDCLOSE ActionType = "GUIDE_RECEIVED_CLOSE"
	// ActionTypeNOTRESPONDINGCLOSE captures enum value NOT_RESPONDING_CLOSE
	ActionTypeNOTRESPONDINGCLOSE ActionType = "NOT_RESPONDING_CLOSE"
)

// Action is the model for an action on a system intake
type Action struct {
	ID             uuid.UUID    `json:"id"`
	IntakeID       *uuid.UUID   `db:"intake_id"`
	BusinessCaseID *uuid.UUID   `db:"business_case_id"`
	ActionType     ActionType   `json:"actionType" db:"action_type"`
	ActorName      string       `json:"actorName" db:"actor_name"`
	ActorEmail     EmailAddress `json:"actorEmail" db:"actor_email"`
	ActorEUAUserID string       `json:"actorEuaUserId" db:"actor_eua_user_id"`
	Feedback       null.String  `json:"feedback"`
	CreatedAt      *time.Time   `json:"createdAt" db:"created_at"`
}
