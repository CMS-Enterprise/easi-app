package models

import (
	"github.com/guregu/null/zero"
)

// CedarContract represents a single Contract object returned from the CEDAR API

type CedarContract struct {
	EndDate         zero.Time   `json:"endDate,omitempty"`
	StartDate       zero.Time   `json:"startDate,omitempty"`
	ContractNumber  zero.String `json:"contractNumber"`
	ContractName    zero.String `json:"contractName,omitempty"`
	Description     zero.String `json:"description,omitempty"`
	OrderNumber     zero.String `json:"orderNumber,omitempty"`
	ServiceProvided zero.String `json:"serviceProvided,omitempty"`
	IsDeliveryOrg   bool        `json:"isDeliveryOrg"`
	SystemID        zero.String `json:"systemId,omitempty"`
}
