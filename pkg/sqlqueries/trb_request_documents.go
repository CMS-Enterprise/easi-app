package sqlqueries

import _ "embed"

// getTRBDocumentsByTRBIDSQL holds the SQL command to get documents linked to a TRB Request
//
//go:embed SQL/trb_request_documents/get_by_TRB_ID.sql
var getTRBDocumentsByTRBIDSQL string

// getTRBDocumentsByTRBIDSQLs holds the SQL command to get documents linked to a list of TRB Requests
//
//go:embed SQL/trb_request_documents/get_by_TRB_IDs.sql
var getTRBDocumentsByTRBIDsSQL string

// TRBRequestDocuments holds all relevant SQL scripts for a TRB Request Contract Number
var TRBRequestDocuments = trbRequestDocumentsScripts{
	GetByTRBID:  getTRBDocumentsByTRBIDSQL,
	GetByTRBIDs: getTRBDocumentsByTRBIDsSQL,
}

type trbRequestDocumentsScripts struct {
	GetByTRBID  string
	GetByTRBIDs string
}
