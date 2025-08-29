package models

import (
	"github.com/google/uuid"
)

// SystemIntakeContactRole is the various roles that a user can have as a contact on a system intake
type SystemIntakeContactRole string

const (
	SystemIntakeContactRoleBusinessOwner                     SystemIntakeContactRole = "BUSINESS_OWNER"
	SystemIntakeContactRoleCloudNavigator                    SystemIntakeContactRole = "CLOUD_NAVIGATOR"
	SystemIntakeContactRoleContractingOfficersRepresentative SystemIntakeContactRole = "CONTRACTING_OFFICERS_REPRESENTATIVE"
	SystemIntakeContactRoleCyberRiskAdvisor                  SystemIntakeContactRole = "CYBER_RISK_ADVISOR"
	SystemIntakeContactRoleInformationSystemSecurityAdvisor  SystemIntakeContactRole = "INFORMATION_SYSTEM_SECURITY_ADVISOR"
	SystemIntakeContactRoleOther                             SystemIntakeContactRole = "OTHER"
	SystemIntakeContactRolePrivacyAdvisor                    SystemIntakeContactRole = "PRIVACY_ADVISOR"
	SystemIntakeContactRoleProductOwner                      SystemIntakeContactRole = "PRODUCT_OWNER"
	SystemIntakeContactRoleProductManager                    SystemIntakeContactRole = "PRODUCT_MANAGER"
	SystemIntakeContactRoleProjectManager                    SystemIntakeContactRole = "PROJECT_MANAGER"
	SystemIntakeContactRoleSubjectMatterExpert               SystemIntakeContactRole = "SUBJECT_MATTER_EXPERT"
	SystemIntakeContactRoleSystemMaintainer                  SystemIntakeContactRole = "SYSTEM_MAINTAINER"
	SystemIntakeContactRoleSystemOwner                       SystemIntakeContactRole = "SYSTEM_OWNER"
	// SystemIntakeContactRolePLACEHOLDER is the default role given. It is removed before returning the frontend, so they know a user needs to select a role
	SystemIntakeContactRolePLACEHOLDER SystemIntakeContactRole = "PLACE_HOLDER"
)

// SystemIntakeContact represents an EUA user's association with a system intake
type SystemIntakeContact struct {
	userIDRelation
	BaseStructUser
	SystemIntakeID uuid.UUID                          `json:"systemIntakeId" db:"system_intake_id"`
	Component      string                             `json:"component" db:"component"`
	Roles          EnumArray[SystemIntakeContactRole] `json:"roles" db:"roles"`
	IsRequester    bool                               `json:"isRequester" db:"is_requester"`
}

// NewSystemIntakeContact creates a new SystemIntakeContact with the related userAccount
func NewSystemIntakeContact(userID uuid.UUID, createdBy uuid.UUID) *SystemIntakeContact {
	return &SystemIntakeContact{
		BaseStructUser: NewBaseStructUser(createdBy),
		userIDRelation: NewUserIDRelation(userID),
	}
}

// SystemIntakeContacts This is a convenience struct which surfaces information about the contacts associated with a system intake
type SystemIntakeContacts struct {

	// Returns all the raw contacts from the List of Contacts
	AllContacts []*SystemIntakeContact `json:"allContacts"`
}

// Requester returns the primary requester of a system intake. If none are found, it returns nil. This should be a very uncommon situation
func (info *SystemIntakeContacts) Requester() (*SystemIntakeContact, error) {
	if info == nil || info.AllContacts == nil || len(info.AllContacts) == 0 {
		return nil, nil
	}
	// TODO implement in other branch
	// lo.Find(info.AllContacts, func(c *SystemIntakeContact) bool {
	// 	return c.
	// })
	// This is a placeholder, just return the first contact for now
	return info.AllContacts[0], nil
}

// BusinessOwners returns the business owner from the List of Contacts
func (info *SystemIntakeContacts) BusinessOwners() ([]*SystemIntakeContact, error) {
	//TODO Implement
	return info.AllContacts, nil
}

// ProductManagers returns the product managers from the List of Contacts
func (info *SystemIntakeContacts) ProductManagers() ([]*SystemIntakeContact, error) {
	//TODO Implement
	return info.AllContacts, nil
}

// AdditionalContacts Returns the additional contacts from the List of Contacts. These are all the contacts except for requester, businessOwners, productOwners
func (info *SystemIntakeContacts) AdditionalContacts() ([]*SystemIntakeContact, error) {
	//TODO Implement
	return info.AllContacts, nil
}
