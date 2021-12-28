package models

import (
	"github.com/go-openapi/strfmt"
	"github.com/guregu/null"
)

// CedarDataCenter represents a single DataCenter object returned from the CEDAR API
type CedarDataCenter struct {
	ID          null.String
	Name        null.String
	Version     null.String
	Description null.String
	State       null.String // example: "Active" - NOT geographical state
	Status      null.String
	StartDate   null.String
	EndDate     null.String

	// address components
	Address1     null.String
	Address2     null.String
	City         null.String
	AddressState null.String
	Zip          null.String
}

// CedarDeployment represents a single Deployment object returned from the CEDAR API
type CedarDeployment struct {
	// always-present fields
	ID       string
	Name     string
	SystemID string

	// possibly-null fields
	StartDate                *strfmt.Date
	EndDate                  *strfmt.Date
	IsHotSite                null.String
	Description              null.String
	ContractorName           null.String
	SystemVersion            null.String
	HasProductionData        null.String
	ReplicatedSystemElements []string
	DeploymentType           null.String
	SystemName               null.String
	DeploymentElementID      null.String
	State                    null.String
	Status                   null.String
	WanType                  null.String
	DataCenter               CedarDataCenter
}
