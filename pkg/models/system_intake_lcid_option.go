package models

import (
	"github.com/google/uuid"
	"github.com/guregu/null"
)

// SystemIntakeLCIDOption is a requester-safe LCID lookup option for TRB flows.
type SystemIntakeLCIDOption struct {
	ID          uuid.UUID   `json:"id" db:"id"`
	LCID        null.String `json:"lcid" db:"lcid" gqlgen:"lcid"`
	RequestName null.String `json:"requestName" db:"request_name"`
}
