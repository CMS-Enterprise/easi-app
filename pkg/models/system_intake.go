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
	// SystemIntakeStatusNEEDBIZCASE captures enum value "NEED_BIZ_CASE"
	SystemIntakeStatusNEEDBIZCASE SystemIntakeStatus = "NEED_BIZ_CASE"
	// SystemIntakeStatusCLOSED captures enum value "CLOSED"
	SystemIntakeStatusCLOSED SystemIntakeStatus = "CLOSED"
	// SystemIntakeStatusAPPROVED captures enum value "APPROVED"
	SystemIntakeStatusAPPROVED SystemIntakeStatus = "APPROVED"
	// SystemIntakeStatusREADYFORGRT captures enum value "READY_FOR_GRT"
	SystemIntakeStatusREADYFORGRT SystemIntakeStatus = "READY_FOR_GRT"
	// SystemIntakeStatusREADYFORGRB captures enum value "READY_FOR_GRB"
	SystemIntakeStatusREADYFORGRB SystemIntakeStatus = "READY_FOR_GRB"
	// SystemIntakeStatusARCHIVED captures enum value "ARCHIVED"
	SystemIntakeStatusARCHIVED SystemIntakeStatus = "ARCHIVED"
	// SystemIntakeStatusNOTITREQUEST captures enum value "NOT_IT_REQUEST"
	SystemIntakeStatusNOTITREQUEST SystemIntakeStatus = "NOT_IT_REQUEST"
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
	FundingNumber           null.String        `json:"fundingNumber" db:"funding_number"`
	BusinessNeed            null.String        `json:"businessNeed" db:"business_need"`
	Solution                null.String        `json:"solution"`
	ProcessStatus           null.String        `json:"processStatus" db:"process_status"`
	EASupportRequest        null.Bool          `json:"eaSupportRequest" db:"ea_support_request"`
	ExistingContract        null.String        `json:"existingContract" db:"existing_contract"`
	CostIncrease            null.String        `json:"costIncrease" db:"cost_increase"`
	CostIncreaseAmount      null.String        `json:"costIncreaseAmount" db:"cost_increase_amount"`
	Contractor              null.String        `json:"contractor" db:"contractor"`
	ContractVehicle         null.String        `json:"contractVehicle" db:"contract_vehicle"`
	ContractStartMonth      null.String        `json:"contractStartMonth" db:"contract_start_month"`
	ContractStartYear       null.String        `json:"contractStartYear" db:"contract_start_year"`
	ContractEndMonth        null.String        `json:"contractEndMonth" db:"contract_end_month"`
	ContractEndYear         null.String        `json:"contractEndYear" db:"contract_end_year"`
	CreatedAt               *time.Time         `json:"createdAt" db:"created_at"`
	UpdatedAt               *time.Time         `json:"updatedAt" db:"updated_at"`
	SubmittedAt             *time.Time         `json:"submittedAt" db:"submitted_at"`
	DecidedAt               *time.Time         `json:"decidedAt" db:"decided_at"`
	ArchivedAt              *time.Time         `db:"archived_at"`
	AlfabetID               null.String        `json:"alfabetID" db:"alfabet_id"`
	GrtReviewEmailBody      null.String        `json:"grtReviewEmailBody" db:"grt_review_email_body"`
	RequesterEmailAddress   null.String        `json:"requesterEmailAddress" db:"requester_email_address"`
	BusinessCaseID          *uuid.UUID         `json:"businessCase"`
	LifecycleID             null.String        `json:"lcid" db:"lcid"`
	LifecycleExpiresAt      *time.Time         `json:"lcidExpiresAt" db:"lcid_expires_at"`
	LifecycleScope          null.String        `json:"lcidScope" db:"lcid_scope"`
	LifecycleNextSteps      null.String        `json:"lcidNextSteps" db:"lcid_next_steps"`
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
