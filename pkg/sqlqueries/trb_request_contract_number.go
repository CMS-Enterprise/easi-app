package sqlqueries

import _ "embed"

// deleteTRBRequestContractNumbersSQL holds the SQL command to remove all linked contract numbers from a TRB Request
//
//go:embed SQL/trb_request_contract_number/delete.sql
var deleteTRBRequestContractNumbersSQL string

// setTRBRequestContractNumbersSQL holds the SQL command to link Contract Numbers to a TRB Request
//
//go:embed SQL/trb_request_contract_number/set.sql
var setTRBRequestContractNumbersSQL string

// selectContractNumbersByTRBRequestIDLOADERSQL holds the SQL command to get linked Contract Numbers by TRB Request ID via dataloader
//
//go:embed SQL/trb_request_contract_number/get_by_trb_request_id_LOADER.sql
var selectContractNumbersByTRBRequestIDLOADERSQL string

// selectContractNumbersByTRBRequestIDLOADERSQL2 holds the SQL command to get linked Contract Numbers by TRB Request ID via dataloader
//
//go:embed SQL/trb_request_contract_number/get_by_trb_request_id_LOADER2.sql
var selectContractNumbersByTRBRequestIDLOADERSQL2 string

// TRBRequestContractNumbersForm holds all relevant SQL scripts for a TRB Request Contract Number
var TRBRequestContractNumbersForm = trbRequestContractNumberScripts{
	Set:                         setTRBRequestContractNumbersSQL,
	Delete:                      deleteTRBRequestContractNumbersSQL,
	SelectByTRBRequestIDLOADER:  selectContractNumbersByTRBRequestIDLOADERSQL,
	SelectByTRBRequestIDLOADER2: selectContractNumbersByTRBRequestIDLOADERSQL2,
}

type trbRequestContractNumberScripts struct {
	Set                         string
	Delete                      string
	SelectByTRBRequestIDLOADER  string
	SelectByTRBRequestIDLOADER2 string
}
