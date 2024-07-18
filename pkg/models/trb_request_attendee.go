package models

import (
	"github.com/google/uuid"
)

// PersonRole is an enumeration of values representing the role of a person (currently in use for
// TRBRequestAttendee and potentially SystemIntakeContact in the future)
type PersonRole string

const (
	// PersonRoleBusinessOwner is a person with the "Business Owner" role
	PersonRoleBusinessOwner PersonRole = "BUSINESS_OWNER"
	// PersonRoleProductOwner is a person with the "Product Owner" role
	PersonRoleProductOwner PersonRole = "PRODUCT_OWNER"
	// PersonRoleSystemOwner is a person with the "System Owner" role
	PersonRoleSystemOwner PersonRole = "SYSTEM_OWNER"
	// PersonRoleSystemMaintainer is a person with the "System Maintainer" role
	PersonRoleSystemMaintainer PersonRole = "SYSTEM_MAINTAINER"
	// PersonRoleContractOfficersRepresentative is a person with the "ContractOfficersRepresentative" role
	PersonRoleContractOfficersRepresentative PersonRole = "CONTRACT_OFFICE_RSREPRESENTATIVE"
	// PersonRoleCloudNavigator is a person with the "Cloud Navigator" role
	PersonRoleCloudNavigator PersonRole = "CLOUD_NAVIGATOR"
	// PersonRoleInformationSystemSecurityAdvisor is a person with the "Information System Security Advisor" role
	PersonRoleInformationSystemSecurityAdvisor PersonRole = "INFORMATION_SYSTEM_SECURITY_ADVISOR"
	// PersonRolePrivacyAdvisor is a person with the "Privacy Advisor" role
	PersonRolePrivacyAdvisor PersonRole = "PRIVACY_ADVISOR"
	// PersonRoleCRA is a person with the "Cyber Risk Advisor (CRA)" role
	PersonRoleCRA PersonRole = "CRA"
	// PersonRoleOther is a person with the "Other" role
	PersonRoleOther PersonRole = "OTHER"
)

// TRBRequestAttendee represents an EUA user who is included as an attendee for a TRB request
type TRBRequestAttendee struct {
	BaseStruct
	EUAUserID    string      `json:"euaUserId" db:"eua_user_id"`
	TRBRequestID uuid.UUID   `json:"trbRequestId" db:"trb_request_id"`
	Component    *string     `json:"component" db:"component"`
	Role         *PersonRole `json:"role" db:"role"`
}

func (a TRBRequestAttendee) GetMappingKey() uuid.UUID {
	return a.TRBRequestID
}

func (a TRBRequestAttendee) GetMappingVal() *TRBRequestAttendee {
	return &a
}

// TRBAttendeeByTRBAndEUAIDRequest is used by the dataloaders package to help batch attendee requests by EUA+TRB IDs
type TRBAttendeeByTRBAndEUAIDRequest struct {
	EUAUserID    string
	TRBRequestID uuid.UUID
}
