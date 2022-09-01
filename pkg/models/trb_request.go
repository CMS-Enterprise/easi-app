package models

//TRBRequest represents a TRB request object
type TRBRequest struct {
	baseStruct
	Archived bool   `json:"archived" db:"archived"`
	Type     string `json:"type" db:"type"`     //TODO should this be a type?
	Status   string `json:"status" db:"status"` //TODO should this be a type?
}

//NewTRBRequest returns a new trb request object
func NewTRBRequest(createdBy string) *TRBRequest {
	return &TRBRequest{
		baseStruct: NewBaseStruct(createdBy),
	}

}
