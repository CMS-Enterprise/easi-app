package models

// CedarDataCenter represents a single Data Center object returned from the CEDAR API

import (
	"github.com/guregu/null/zero"
)

type CedarDataCenter2 struct {
	Address1     zero.String `json:"address1,omitempty"`
	Address2     zero.String `json:"address2,omitempty"`
	AddressState zero.String `json:"addressState,omitempty"`
	City         zero.String `json:"city,omitempty"`
	Description  zero.String `json:"description,omitempty"`
	EndDate      zero.Time   `json:"endDate,omitempty"`
	ID           zero.String `json:"id,omitempty"`
	Name         zero.String `json:"name,omitempty"`
	StartDate    zero.Time   `json:"startDate,omitempty"`
	State        zero.String `json:"state,omitempty"`
	Status       zero.String `json:"status,omitempty"`
	Version      zero.String `json:"version,omitempty"`
	Zip          zero.String `json:"zip,omitempty"`
}
