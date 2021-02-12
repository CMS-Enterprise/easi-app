package models

import (
	"github.com/google/uuid"
	"github.com/guregu/null"
)

// BusinessOwner holds data about a system's business owner
type BusinessOwner struct {
	Component string `json:"component"`
	Name      string `json:"name"`
}

// System is derived from a system intake and represents a computer system managed by CMS
type System struct {
	ID                     uuid.UUID   `json:"id"`
	Name                   string      `json:"name"`
	BusinessOwnerName      null.String `db:"business_owner_name"`
	BusinessOwnerComponent null.String `db:"business_owner_component"`
	BusinessOwner          *BusinessOwner
	LCID                   string `db:"lcid"`
}
