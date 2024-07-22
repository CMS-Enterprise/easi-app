package sqlqueries

import _ "embed"

// getTRBRequestFundingSourcesByTRBIDSQL holds the SQL command to get TRB Request Funding Sources by TRB Request ID
//
//go:embed SQL/trb_request_funding_sources/get_by_TRB_ID.sql
var getTRBRequestFundingSourcesByTRBIDSQL string

// getTRBRequestFundingSourcesByTRBIDsSQL holds the SQL command to get TRB Request Funding Sources by TRB Request IDs
//
//go:embed SQL/trb_request_funding_sources/get_by_TRB_IDs.sql
var getTRBRequestFundingSourcesByTRBIDsSQL string

// TRBRequestFundingSources holds all relevant SQL scripts for a TRB Request Form
var TRBRequestFundingSources = trbRequestFundingSourcesScripts{
	GetByTRBReqID:  getTRBRequestFundingSourcesByTRBIDSQL,
	GetByTRBReqIDs: getTRBRequestFundingSourcesByTRBIDsSQL,
}

type trbRequestFundingSourcesScripts struct {
	GetByTRBReqID  string
	GetByTRBReqIDs string
}
