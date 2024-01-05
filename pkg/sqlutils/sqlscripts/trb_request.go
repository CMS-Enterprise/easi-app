package sqlscripts

import _ "embed"

// trbRequestCreateSQL holds the SQL command to create a trbRequest
//
//go:embed SQL/trb_request/create.sql
var trbRequestCreateSQL string

// trbRequestUpdateSQL holds the SQL command to update a trbRequest
//
//go:embed SQL/trb_request/update.sql
var trbRequestUpdateSQL string

// TRBRequest holds all relevant SQL scripts for a trbRequest
var TRBRequest = trbRequestScripts{
	Create: trbRequestCreateSQL,
	Update: trbRequestUpdateSQL,
}

type trbRequestScripts struct {
	// Holds the SQL command to create a trbRequest
	Create string
	// Holds the SQL command to update a trbRequest
	Update string
}
