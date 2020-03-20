package models

import (
	"github.com/google/uuid"
)

// SystemIntake is the model for the system intake form
type SystemIntake struct {
	ID                      uuid.UUID      `json:"id"`
	EUAUserID               string         `json:"eua_user_id" db:"eua_user_id"`
	Requester               NullableString `json:"requester"`
	Component               NullableString `json:"component"`
	BusinessOwner           NullableString `json:"business_owner" db:"business_owner"`
	BusinessOwnerComponent  NullableString `json:"business_owner_component" db:"business_owner_component"`
	ProductManager          NullableString `json:"product_manager" db:"product_manager"`
	ProductManagerComponent NullableString `json:"product_manager_component" db:"product_manager_component"`
	HasISSO                 NullableBool   `json:"has_isso" db:"has_isso"`
	ISSO                    NullableString `json:"isso"`
	TRBCollaborator         NullableString `json:"trb_collaborator" db:"trb_collaborator"`
	OITSecurityCollaborator NullableString `json:"oit_security_collaborator" db:"oit_security_collaborator"`
	EACollaborator          NullableString `json:"ea_collaborator" db:"ea_collaborator"`
	ProjectName             NullableString `json:"project_name" db:"project_name"`
	ExistingFunding         NullableBool   `json:"existing_funding" db:"existing_funding"`
	FundingSource           NullableString `json:"funding_source" db:"funding_source"`
	BusinessNeed            NullableString `json:"business_need" db:"business_need"`
	Solution                NullableString `json:"solution"`
	ProcessStatus           NullableString `json:"process_status" db:"process_status"`
	EASupportRequest        NullableBool   `json:"ea_support_request" db:"ea_support_request"`
	ExistingContract        NullableString `json:"existing_contract" db:"existing_contract"`
}

// SystemIntakes is a list of System Intakes
type SystemIntakes []SystemIntake
