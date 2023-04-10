package models

// TRBLeadOption represents an EUA user who can be assigned as a TRB lead for a TRB request
type TRBLeadOption struct {
	baseStruct
	EUAUserID string `json:"euaUserId" db:"eua_user_id"`
}
