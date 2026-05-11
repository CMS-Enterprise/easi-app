package sqlqueries

import _ "embed"

// getTRBDocumentByIDSQL holds the SQL command to get a document linked to a TRB Request by ID
//
//go:embed SQL/trb_request_documents/get_by_id.sql
var getTRBDocumentByIDSQL string

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
	GetByID:     getTRBDocumentByIDSQL,
	GetByTRBID:  getTRBDocumentsByTRBIDSQL,
	GetByTRBIDs: getTRBDocumentsByTRBIDsSQL,
}

type trbRequestDocumentsScripts struct {
	GetByID     string
	GetByTRBID  string
	GetByTRBIDs string
}
