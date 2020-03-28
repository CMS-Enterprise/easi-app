package models

import (
	"github.com/google/uuid"
	"github.com/guregu/null"
)

// SystemIntake is the model for the system intake form
type SystemIntake struct {
	ID                      uuid.UUID   `json:"id"`
	EUAUserID               string      `json:"eua_user_id" db:"eua_user_id"`
	Requester               null.String `json:"requester"`
	Component               null.String `json:"component"`
	BusinessOwner           null.String `json:"business_owner" db:"business_owner"`
	BusinessOwnerComponent  null.String `json:"business_owner_component" db:"business_owner_component"`
	ProductManager          null.String `json:"product_manager" db:"product_manager"`
	ProductManagerComponent null.String `json:"product_manager_component" db:"product_manager_component"`
	HasISSO                 null.Bool   `json:"has_isso" db:"has_isso"`
	ISSO                    null.String `json:"isso"`
	TRBCollaborator         null.String `json:"trb_collaborator" db:"trb_collaborator"`
	OITSecurityCollaborator null.String `json:"oit_security_collaborator" db:"oit_security_collaborator"`
	EACollaborator          null.String `json:"ea_collaborator" db:"ea_collaborator"`
	ProjectName             null.String `json:"project_name" db:"project_name"`
	ExistingFunding         null.Bool   `json:"existing_funding" db:"existing_funding"`
	FundingSource           null.String `json:"funding_source" db:"funding_source"`
	BusinessNeed            null.String `json:"business_need" db:"business_need"`
	Solution                null.String `json:"solution"`
	ProcessStatus           null.String `json:"process_status" db:"process_status"`
	EASupportRequest        null.Bool   `json:"ea_support_request" db:"ea_support_request"`
	ExistingContract        null.String `json:"existing_contract" db:"existing_contract"`
}

// SystemIntakes is a list of System Intakes
type SystemIntakes []SystemIntake
