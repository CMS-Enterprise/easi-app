package models

import (
	"github.com/guregu/null/zero"
)

// CedarDataCenter represents a single DataCenter object returned from the CEDAR API
type CedarDataCenter struct {
	ID          zero.String
	Name        zero.String
	Version     zero.String
	Description zero.String
	State       zero.String // example: "Active" - NOT geographical state
	Status      zero.String
	StartDate   zero.Time
	EndDate     zero.Time

	// address components
	Address1     zero.String
	Address2     zero.String
	City         zero.String
	AddressState zero.String
	Zip          zero.String
}

// CedarDeployment represents a single Deployment object returned from the CEDAR API
type CedarDeployment struct {
	// always-present fields
	ID       string
	Name     string
	SystemID string

	// possibly-null fields
	StartDate                zero.Time
	EndDate                  zero.Time
	IsHotSite                zero.String // this could potentially be nullable Bool; sample values from CEDAR seem to be "Yes" or null
	Description              zero.String
	ContractorName           zero.String
	SystemVersion            zero.String
	HasProductionData        zero.String // this could potentially be nullable Bool; sample values from CEDAR seem to be "Yes" or null
	ReplicatedSystemElements []string
	DeploymentType           zero.String
	SystemName               zero.String
	DeploymentElementID      zero.String
	State                    zero.String
	Status                   zero.String
	WanType                  zero.String
	DataCenter               *CedarDataCenter
}
