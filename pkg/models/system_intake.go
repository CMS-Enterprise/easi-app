package models

import (
	"github.com/google/uuid"
	"github.com/guregu/null"
)

// SystemIntakeStatus represents the status of a system intake
type SystemIntakeStatus string

const (
	// SystemIntakeStatusDRAFT captures enum value "DRAFT"
	SystemIntakeStatusDRAFT SystemIntakeStatus = "DRAFT"
	// SystemIntakeStatusSUBMITTED captures enum value "SUBMITTED"
	SystemIntakeStatusSUBMITTED SystemIntakeStatus = "SUBMITTED"
	// SystemIntakeStatusREVIEWED captures enum value "REVIEWED"
	SystemIntakeStatusREVIEWED SystemIntakeStatus = "REVIEWED"
	// SystemIntakeStatusREJECTED captures enum value "REJECTED"
	SystemIntakeStatusREJECTED SystemIntakeStatus = "REJECTED"
)

// SystemIntake is the model for the system intake form
type SystemIntake struct {
	ID                      uuid.UUID          `json:"id"`
	EUAUserID               string             `json:"euaUserId" db:"eua_user_id"`
	Status                  SystemIntakeStatus `json:"status"`
	Requester               null.String        `json:"requester"`
	Component               null.String        `json:"component"`
	BidnessOwner            null.String        `json:"bidnessOwner" db:"bidness_owner"`
	BidnessOwnerComponent   null.String        `json:"bidnessOwnerComponent" db:"bidness_owner_component"`
	ProductManager          null.String        `json:"productManager" db:"product_manager"`
	ProductManagerComponent null.String        `json:"productManagerComponent" db:"product_manager_component"`
	ISSO                    null.String        `json:"isso"`
	TRBCollaborator         null.String        `json:"trbCollaborator" db:"trb_collaborator"`
	OITSecurityCollaborator null.String        `json:"oitSecurityCollaborator" db:"oit_security_collaborator"`
	EACollaborator          null.String        `json:"eaCollaborator" db:"ea_collaborator"`
	ProjectName             null.String        `json:"projectName" db:"project_name"`
	ExistingFunding         null.Bool          `json:"existingFunding" db:"existing_funding"`
	FundingSource           null.String        `json:"fundingSource" db:"funding_source"`
	BidnessNeed             null.String        `json:"bidnessNeed" db:"bidness_need"`
	Solution                null.String        `json:"solution"`
	ProcessStatus           null.String        `json:"processStatus" db:"process_status"`
	EASupportRequest        null.Bool          `json:"eaSupportRequest" db:"ea_support_request"`
	ExistingContract        null.String        `json:"existingContract" db:"existing_contract"`
}

// SystemIntakes is a list of System Intakes
type SystemIntakes []SystemIntake
