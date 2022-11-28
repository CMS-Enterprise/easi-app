package models

import "github.com/guregu/null/zero"

// CedarAssigneeType represents the possible types of assignees that can receive roles
type CedarAssigneeType string

// these values need to be in all-caps so that they match the GraphQL enum and match the frontend types generated from the GQL schema
const (
	// PersonAssignee represents a person that's been assigned a role
	PersonAssignee CedarAssigneeType = "PERSON"
	// OrganizationAssignee represents an organization that's been assigned a role
	OrganizationAssignee CedarAssigneeType = "ORGANIZATION"
)

// CedarRole is the model for the role that a user holds for some system
type CedarRole struct {
	// always-present fields
	Application string // should always be "alfabet"
	ObjectID    string // ID of the system that the role is assigned to
	RoleTypeID  string

	// possibly-null fields
	AssigneeType      *CedarAssigneeType
	AssigneeUsername  zero.String
	AssigneeEmail     zero.String
	AssigneeOrgID     zero.String
	AssigneeOrgName   zero.String
	AssigneeFirstName zero.String
	AssigneeLastName  zero.String
	AssigneePhone     zero.String
	AssigneeDesc      zero.String

	RoleTypeName zero.String
	RoleTypeDesc zero.String
	RoleID       zero.String
	ObjectType   zero.String
}

// CedarRoleType is the model for a type of role that a user or organization can hold for some system, i.e. "Business Owner" or "Project Lead"
type CedarRoleType struct {
	// always-present fields
	ID          string
	Application string // should always be "alfabet"
	Name        string

	// possibly-null fields
	Description zero.String
}
