package models

import (
	"time"

	"github.com/google/uuid"
)

// SystemIntakeContact represents an EUA user's association with a system intake
type SystemIntakeContact struct {
	userIDRelation
	ID             uuid.UUID                 `json:"id"`
	EUAUserID      string                    `json:"euaUserId" db:"eua_user_id"`
	SystemIntakeID uuid.UUID                 `json:"systemIntakeId" db:"system_intake_id"`
	Component      string                    `json:"component" db:"component"`
	Roles          []SystemIntakeContactRole `json:"roles" db:"roles"`
	UpdatedAt      *time.Time                `db:"updated_at"`
	CreatedAt      *time.Time                `db:"created_at"`
}

// NewSystemIntakeContact creates a new SystemIntakeContact with the related userAccount
func NewSystemIntakeContact(userID uuid.UUID) *SystemIntakeContact {
	return &SystemIntakeContact{
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

// Returns the business owner from the List of Contacts
func (info *SystemIntakeContacts) BusinessOwners() ([]*SystemIntakeContact, error) {
	//TODO Implement
	return info.AllContacts, nil
}

// ProductManagers Returns the product managers from the List of Contacts
func (info *SystemIntakeContacts) ProductManagers() ([]*SystemIntakeContact, error) {
	//TODO Implement
	return info.AllContacts, nil
}

// AdditionalContacts Returns the additional contacts from the List of Contacts. These are all the contacts except for requester, businessOwners, productOwners
func (info *SystemIntakeContacts) AdditionalContacts() ([]*SystemIntakeContact, error) {
	//TODO Implement
	return info.AllContacts, nil
}
