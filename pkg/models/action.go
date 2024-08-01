package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
)

// ActionType represents type of action
type ActionType string

// IT Gov v2 actions
const (
	ActionTypePROGRESSTONEWSTEP        ActionType = "PROGRESS_TO_NEW_STEP"
	ActionTypeEXPIRELCID               ActionType = "EXPIRE_LCID"
	ActionTypeUPDATELCID               ActionType = "UPDATE_LCID"
	ActionTypeCONFIRMLCID              ActionType = "CONFIRM_LCID"
	ActionTypeREQUESTEDITS             ActionType = "REQUEST_EDITS"
	ActionTypeCLOSEREQUEST             ActionType = "CLOSE_REQUEST"
	ActionTypeREOPENREQUEST            ActionType = "REOPEN_REQUEST"
	ActionTypeNOTITGOVREQUEST          ActionType = "NOT_GOVERNANCE"
	ActionTypeRETIRELCID               ActionType = "RETIRE_LCID"
	ActionTypeCHANGELCIDRETIREMENTDATE ActionType = "CHANGE_LCID_RETIREMENT_DATE"
)

// v1/v2 actions - originally from v1, still used in IT Gov v2
const (
	ActionTypeISSUELCID    ActionType = "ISSUE_LCID"
	ActionTypeREJECT       ActionType = "REJECT"
	ActionTypeSUBMITINTAKE ActionType = "SUBMIT_INTAKE"
)

// v1 actions - no longer used in IT Gov v2 workflow
const (
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
	// ActionTypeEXTENDLCID captures enum value EXTEND_LCID
	ActionTypeEXTENDLCID ActionType = "EXTEND_LCID"
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
	// ActionTypeSENDEMAIL captures enum value SEND_EMAIL
	ActionTypeSENDEMAIL ActionType = "SEND_EMAIL"
	// ActionTypeGUIDERECEIVEDCLOSE captures enum value GUIDE_RECEIVED_CLOSE
	ActionTypeGUIDERECEIVEDCLOSE ActionType = "GUIDE_RECEIVED_CLOSE"
	// ActionTypeNOTRESPONDINGCLOSE captures enum value NOT_RESPONDING_CLOSE
	ActionTypeNOTRESPONDINGCLOSE ActionType = "NOT_RESPONDING_CLOSE"
)

// Action is the model for an action on a system intake
type Action struct {
	ID                                       uuid.UUID         `json:"id"`
	IntakeID                                 *uuid.UUID        `db:"intake_id"`
	BusinessCaseID                           *uuid.UUID        `db:"business_case_id"`
	ActionType                               ActionType        `json:"actionType" db:"action_type"`
	ActorName                                string            `json:"actorName" db:"actor_name"`
	ActorEmail                               EmailAddress      `json:"actorEmail" db:"actor_email"`
	ActorEUAUserID                           string            `json:"actorEuaUserId" db:"actor_eua_user_id"`
	Feedback                                 *HTML             `json:"feedback"`       // Feedback to requestor sent via email
	Step                                     *SystemIntakeStep `json:"step" db:"step"` // optional to account for previous actions that didn't save Step information
	CreatedAt                                *time.Time        `json:"createdAt" db:"created_at"`
	LCIDExpirationChangeNewDate              *time.Time        `db:"lcid_expiration_change_new_date"`
	LCIDExpirationChangePreviousDate         *time.Time        `db:"lcid_expiration_change_previous_date"`
	LCIDExpirationChangeNewScope             *HTML             `db:"lcid_expiration_change_new_scope"`
	LCIDExpirationChangePreviousScope        *HTML             `db:"lcid_expiration_change_previous_scope"`
	LCIDExpirationChangeNewNextSteps         *HTML             `db:"lcid_expiration_change_new_next_steps"`
	LCIDExpirationChangePreviousNextSteps    *HTML             `db:"lcid_expiration_change_previous_next_steps"`
	LCIDExpirationChangeNewCostBaseline      null.String       `db:"lcid_expiration_change_new_cost_baseline"`
	LCIDExpirationChangePreviousCostBaseline null.String       `db:"lcid_expiration_change_previous_cost_baseline"`
	LCIDRetirementChangeNewDate              *time.Time        `json:"newRetirementDate" db:"lcid_retirement_change_new_date"`
	LCIDRetirementChangePreviousDate         *time.Time        `json:"previousRetirementDate" db:"lcid_retirement_change_previous_date"`
}

func (a Action) GetMappingKey() uuid.UUID {
	return *a.IntakeID
}
func (a Action) GetMappingVal() *Action {
	return &a
}
