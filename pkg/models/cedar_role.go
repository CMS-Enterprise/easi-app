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

type CedarRoleNameType string

const (
	AIContactRole                     CedarRoleNameType = "AI Contact"
	APIContactRole                    CedarRoleNameType = "API Contact"
	BudgetAnalystRole                 CedarRoleNameType = "Budget Analyst"
	BusinessOwnerRole                 CedarRoleNameType = "Business owner"
	CORRole                           CedarRoleNameType = "Contracting Officer's Representative (COR)"
	DataCenterContactRole             CedarRoleNameType = "Data Center Contact"
	ISSORole                          CedarRoleNameType = "ISSO"
	GovernmentTaskLeadRole            CedarRoleNameType = "Government Task Lead (GTL)"
	ProjectLeadRole                   CedarRoleNameType = "Project Lead"
	SubjectMatterExpertRole           CedarRoleNameType = "Subject Matter Expert (SME)"
	SupportStaffRole                  CedarRoleNameType = "Support Staff"
	SurveyPointOfContactRole          CedarRoleNameType = "Survey Point of Contact"
	SystemBusinessQuestionContactRole CedarRoleNameType = "Business Question Contact"
	SystemDataCenterContactRole       CedarRoleNameType = "Data Center Contact"
	SystemIssuesContactRole           CedarRoleNameType = "System Issues Contact"
	SystemMaintainerRole              CedarRoleNameType = "System Maintainer"
	TechnicalSystemIssuesContactRole  CedarRoleNameType = "Technical System Issues Contact"
)

func (c CedarRoleNameType) String() string {
	return string(c)
}

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

// CedarRoleType is the model for a type of role that a user or organization can hold for some system, i.e. "Business owner" or "Project Lead"
type CedarRoleType struct {
	// always-present fields
	ID          zero.String
	Application zero.String // should always be "alfabet"
	Name        zero.String

	// possibly-null fields
	Description zero.String
}
