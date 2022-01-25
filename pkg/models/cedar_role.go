package models

import "github.com/guregu/null/zero"

// CedarAssigneeType represents the possible types of assignees that can receive roles
type CedarAssigneeType string

const (
	// UndefinedAssignee represents an assignee type that's not listed as an option in the CEDAR swagger
	UndefinedAssignee CedarAssigneeType = "undefined"

	// PersonAssignee represents a person that's been assigned a role
	PersonAssignee CedarAssigneeType = "person"
	// OrganizationAssignee represents an organization that's been assigned a role
	OrganizationAssignee CedarAssigneeType = "organization"
)

// CedarRole is the model for the role that a user holds for some system
type CedarRole struct {
	// always-present fields
	Application string // should always be "alfabet"
	ObjectID    string // ID of the system that the role is assigned to
	RoleTypeID  string

	// possibly-null fields
	AssigneeType      CedarAssigneeType
	AssigneeUserName  zero.String
	AssigneeEmail     zero.String
	AssigneeOrgID     zero.String
	AssigneeOrgName   zero.String
	AssigneeFirstName zero.String
	AssigneeLastName  zero.String
	AssigneePhone     zero.String
	AssigneeDesc      zero.String

	RoleTypeDesc zero.String
	RoleID       zero.String
	ObjectType   zero.String
}
