package model

import (
	"github.com/google/uuid"
	"github.com/guregu/null"
)

// System is derived from a system intake and represents a computer system managed by CMS
type System struct {
	ID                     uuid.UUID   `json:"id"`
	Name                   string      `json:"name"`
	BusinessOwnerName      null.String `db:"business_owner_name"`
	BusinessOwnerComponent null.String `db:"business_owner_component"`
	BusinessOwner          *BusinessOwner
	LCID                   string `db:"lcid"`
}
