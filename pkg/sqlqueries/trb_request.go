package sqlqueries

import _ "embed"

// trbRequestCreateSQL holds the SQL query to create a TRB Request
//
//go:embed SQL/trb_request/create.sql
var trbRequestCreateSQL string

// trbRequestUpdateSQL holds the SQL query to update a TRB Request
//
//go:embed SQL/trb_request/update.sql
var trbRequestUpdateSQL string

// trbRequestCollectionGetSQL holds the SQL query to get all TRB requests
//
//go:embed SQL/trb_request/collection_get.sql
var trbRequestCollectionGetSQL string

// trbRequestCollectionGetByUserAndArchivedStateSQL holds the SQL query to get all TRB requests by user and archived state
//
//go:embed SQL/trb_request/collection_get_by_user_and_archived_state.sql
var trbRequestCollectionGetByUserAndArchivedStateSQL string

// trbRequestGetByIDSQL holds the SQL query to get a TRB request by a specifc ID
//
//go:embed SQL/trb_request/get_by_id.sql
var trbRequestGetByIDSQL string

// trbRequestSelectByCedarSystemID holds the SQL query to get TRB requests by their Cedar System ID
//
//go:embed SQL/trb_request/select_by_cedar_system_id.sql
var trbRequestSelectByCedarSystemID string

// TRBRequest holds all relevant SQL scripts for a TRB Request
var TRBRequest = trbRequestScripts{
	Create:                              trbRequestCreateSQL,
	Update:                              trbRequestUpdateSQL,
	GetByID:                             trbRequestGetByIDSQL,
	CollectionGet:                       trbRequestCollectionGetSQL,
	CollectionGetByUserAndArchivedState: trbRequestCollectionGetByUserAndArchivedStateSQL,
	SelectByCedarSystemID:               trbRequestSelectByCedarSystemID,
}

type trbRequestScripts struct {
	// Holds the SQL query to create a TRB Request
	Create string
	// Holds the SQL query to update a TRB Request
	Update string
	// Holds the SQL query to get a TRB Request by it's id
	GetByID string
	// Holds the SQL query to get all TRB Requests
	CollectionGet string

	// Holds the SQL query to get all TRB Requests for a giver user.
	// It matches the created_by and the archived fields with the provided parameters
	CollectionGetByUserAndArchivedState string

	// Holds the SQL query to get TRB Requests by Cedar System ID
	SelectByCedarSystemID string
}
