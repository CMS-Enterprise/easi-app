package models

import (
	"github.com/google/uuid"
)

// SystemIntake is the model for the system intake form
type SystemIntake struct {
	ID                      uuid.UUID      `json:"id"`
	EUAUserID               string         `json:"eua_user_id" db:"eua_user_id"`
	Requester               string         `json:"requester"`
	Component               string         `json:"component"`
	BusinessOwner           string         `json:"business_owner"`
	BusinessOwnerComponent  NullableString `json:"business_owner_component"`
	ProductManager          string         `json:"product_manager"`
	ProductManagerComponent string         `json:"product_manager_component"`
	HasISSO                 bool           `json:"has_isso"`
	ISSO                    string         `json:"isso"`
	TRBCollaborator         string         `json:"trb_collaborator"`
	OITSecurityCollaborator string         `json:"oit_security_collaborator"`
	EACollaborator          string         `json:"ea_collaborator"`
	ProjectName             string         `json:"project_name"`
	ExistingFunding         bool           `json:"existing_funding"`
	FundingSource           string         `json:"funding_source"`
	BusinessNeed            string         `json:"business_need"`
	Solution                string         `json:"solution"`
	ProcessStatus           string         `json:"process_status"`
	EASupportRequest        bool           `json:"ea_support_request"`
	ExistingContract        string         `json:"existing_contract"`
}

// SystemIntakes is a list of System Intakes
type SystemIntakes []SystemIntake
