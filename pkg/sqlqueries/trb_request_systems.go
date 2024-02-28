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

// TRBRequestSystemForm holds all relevant SQL scripts for a TRB Request system
var TRBRequestSystemForm = trbRequestSystemScripts{
	Set:                        setTRBRequestSystemsSQL,
	Delete:                     deleteTRBRequestSystemsSQL,
	SelectByTRBRequestIDLOADER: selectSystemsByTRBRequestIDLOADERSQL,
}

type trbRequestSystemScripts struct {
	Set                        string
	Delete                     string
	SelectByTRBRequestIDLOADER string
}
