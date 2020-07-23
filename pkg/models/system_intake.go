package models

import (
	"time"

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
	// SystemIntakeStatusACCEPTED captures enum value "ACCEPTED"
	SystemIntakeStatusACCEPTED SystemIntakeStatus = "ACCEPTED"
	// SystemIntakeStatusCLOSED captures enum value "CLOSED"
	SystemIntakeStatusCLOSED SystemIntakeStatus = "CLOSED"
	// SystemIntakeStatusAPPROVED captures enum value "APPROVED"
	SystemIntakeStatusAPPROVED SystemIntakeStatus = "APPROVED"
)

// SystemIntake is the model for the system intake form
type SystemIntake struct {
	ID                      uuid.UUID          `json:"id"`
	EUAUserID               string             `json:"euaUserId" db:"eua_user_id"`
	Status                  SystemIntakeStatus `json:"status"`
	Requester               string             `json:"requester"`
	Component               null.String        `json:"component"`
	BusinessOwner           null.String        `json:"businessOwner" db:"business_owner"`
	BusinessOwnerComponent  null.String        `json:"businessOwnerComponent" db:"business_owner_component"`
	ProductManager          null.String        `json:"productManager" db:"product_manager"`
	ProductManagerComponent null.String        `json:"productManagerComponent" db:"product_manager_component"`
	ISSO                    null.String        `json:"isso"`
	TRBCollaborator         null.String        `json:"trbCollaborator" db:"trb_collaborator"`
	OITSecurityCollaborator null.String        `json:"oitSecurityCollaborator" db:"oit_security_collaborator"`
	EACollaborator          null.String        `json:"eaCollaborator" db:"ea_collaborator"`
	ProjectName             null.String        `json:"projectName" db:"project_name"`
	ExistingFunding         null.Bool          `json:"existingFunding" db:"existing_funding"`
	FundingSource           null.String        `json:"fundingSource" db:"funding_source"`
	BusinessNeed            null.String        `json:"businessNeed" db:"business_need"`
	Solution                null.String        `json:"solution"`
	ProcessStatus           null.String        `json:"processStatus" db:"process_status"`
	EASupportRequest        null.Bool          `json:"eaSupportRequest" db:"ea_support_request"`
	ExistingContract        null.String        `json:"existingContract" db:"existing_contract"`
	CreatedAt               *time.Time         `json:"createdAt" db:"created_at"`
	UpdatedAt               *time.Time         `json:"updatedAt" db:"updated_at"`
	SubmittedAt             *time.Time         `json:"submittedAt" db:"submitted_at"`
	DecidedAt               *time.Time         `json:"decidedAt" db:"decided_at"`
	AlfabetID               null.String        `json:"alfabetID" db:"alfabet_id"`
	GrtReviewEmailBody      null.String        `json:"grtReviewEmailBody" db:"grt_review_email_body"`
	RequesterEmailAddress   null.String        `json:"requesterEmailAddress" db:"requester_email_address"`
	BusinessCaseID          *uuid.UUID         `json:"businessCase"`
}

// SystemIntakes is a list of System Intakes
type SystemIntakes []SystemIntake

// SystemIntakeMetrics is a model for storing metrics related to system intake
type SystemIntakeMetrics struct {
	StartTime          time.Time `json:"startTime"`
	EndTime            time.Time `json:"endTime"`
	Started            int       `json:"started"`
	CompletedOfStarted int       `json:"completedOfStarted"`
	Completed          int       `json:"completed"`
	Funded             int       `json:"funded"`
}
