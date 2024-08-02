package sqlqueries

import _ "embed"

// getIntakesByTRBReqID holds the SQL query to get System Intakes by a TRB Request ID
//
//go:embed SQL/trb_request_system_intakes/get_by_TRB_ID.sql
var getIntakesByTRBReqID string

// getIntakesByTRBReqIDs holds the SQL query to get System Intakes by TRB Request IDs
//
//go:embed SQL/trb_request_system_intakes/get_by_TRB_IDs.sql
var getIntakesByTRBReqIDs string

// TRBRequestFormSystemIntakes holds all relevant SQL scripts for TRB Request Form System Intakes
var TRBRequestFormSystemIntakes = trbRequestSystemIntakesScripts{
	GetByTRBRequestID:  getIntakesByTRBReqID,
	GetByTRBRequestIDs: getIntakesByTRBReqIDs,
}

type trbRequestSystemIntakesScripts struct {
	GetByTRBRequestID  string
	GetByTRBRequestIDs string
}
