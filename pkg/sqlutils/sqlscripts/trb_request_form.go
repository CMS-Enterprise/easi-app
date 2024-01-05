package sqlscripts

import _ "embed"

// trbRequestFormCreateSQL holds the SQL command to create a TRB Request Form
//
//go:embed SQL/trb_request_form/create.sql
var trbRequestFormCreateSQL string

// TRBRequestForm holds all relevant SQL scripts for a TRB Request Form
var TRBRequestForm = trbRequestFormScripts{
	Create: trbRequestFormCreateSQL,
}

type trbRequestFormScripts struct {
	// Holds the SQL query to create a TRB Request Form
	Create string
}
