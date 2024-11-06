package sqlqueries

import _ "embed"

// trbRequestFormCreateSQL holds the SQL command to create a TRB Request Form
//
//go:embed SQL/trb_request_form/create.sql
var trbRequestFormCreateSQL string

// trbRequestFormGetByIDSQL holds the SQL command to get a TRB Request Form
//
//go:embed SQL/trb_request_form/get_by_ID.sql
var trbRequestFormGetByIDSQL string

// trbRequestFormGetByIDsSQL holds the SQL command to get TRB Request Forms by IDs
//
//go:embed SQL/trb_request_form/get_by_IDs.sql
var trbRequestFormGetByIDsSQL string

// TRBRequestForm holds all relevant SQL scripts for a TRB Request Form
var TRBRequestForm = trbRequestFormScripts{
	Create:   trbRequestFormCreateSQL,
	GetByID:  trbRequestFormGetByIDSQL,
	GetByIDs: trbRequestFormGetByIDsSQL,
}

type trbRequestFormScripts struct {
	Create   string
	GetByID  string
	GetByIDs string
}
