package models

import (
	"github.com/guregu/null/zero"
)

// CedarContract represents a single Contract object returned from the CEDAR API

type CedarContract struct {
	PopEndDate            zero.String `json:"popEndDate,omitempty"`
	PopStartDate          zero.String `json:"popStartDate,omitempty"`
	AwardID               *string     `json:"awardId"`
	ContractAdo           zero.String `json:"contractADO,omitempty"`
	ContractDeliverableID zero.String `json:"contractDeliverableId,omitempty"`
	ContractName          zero.String `json:"contractName,omitempty"`
	Description           zero.String `json:"description,omitempty"`
	ID                    *string     `json:"id"`
	ParentAwardID         *string     `json:"parentAwardId"`
	SystemID              zero.String `json:"systemId,omitempty"`
}
