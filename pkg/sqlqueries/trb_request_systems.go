package sqlqueries

import _ "embed"

// deleteTRBRequestSystemsSQL holds the SQL command to remove all linked systems from a TRB Request
//
//go:embed SQL/trb_request_system/delete.sql
var deleteTRBRequestSystemsSQL string

// setTRBRequestSystemsSQL holds the SQL command to link systems to a TRB Request
//
//go:embed SQL/trb_request_system/set.sql
var setTRBRequestSystemsSQL string

// selectSystemsByTRBRequestIDLOADERSQL holds the SQL command to get linked systems by TRB Request ID via dataloader
//
//go:embed SQL/trb_request_system/get_by_trb_request_id_LOADER.sql
var selectSystemsByTRBRequestIDLOADERSQL string

// selectSystemsByTRBRequestIDLOADERSQL2 holds the SQL command to get linked systems by TRB Request ID via dataloader
//
//go:embed SQL/trb_request_system/get_by_trb_request_id_LOADER2.sql
var selectSystemsByTRBRequestIDLOADERSQL2 string

// trbRequestSelectByCedarSystemID holds the SQL query to get TRB requests by their Cedar System ID
//
//go:embed SQL/trb_request_system/select_by_cedar_system_id.sql
var trbRequestSelectByCedarSystemID string

// TRBRequestSystemForm holds all relevant SQL scripts for a TRB Request system
var TRBRequestSystemForm = trbRequestSystemScripts{
	Set:                         setTRBRequestSystemsSQL,
	Delete:                      deleteTRBRequestSystemsSQL,
	SelectByCedarSystemID:       trbRequestSelectByCedarSystemID,
	SelectByTRBRequestIDLOADER:  selectSystemsByTRBRequestIDLOADERSQL,
	SelectByTRBRequestIDLOADER2: selectSystemsByTRBRequestIDLOADERSQL2,
}

type trbRequestSystemScripts struct {
	Set                         string
	Delete                      string
	SelectByCedarSystemID       string
	SelectByTRBRequestIDLOADER  string
	SelectByTRBRequestIDLOADER2 string
}
