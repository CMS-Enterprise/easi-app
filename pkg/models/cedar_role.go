package models

import "github.com/guregu/null/zero"

// CedarRole is the model for the role that a user holds for some system
type CedarRole struct {
	// always-present fields
	Application zero.String // should always be "alfabet"
	ObjectID    zero.String // ID of the system that the role is assigned to
	RoleTypeID  zero.String

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
	ID          zero.String
	Application zero.String // should always be "alfabet"
	Name        zero.String

	// possibly-null fields
	Description zero.String
}
