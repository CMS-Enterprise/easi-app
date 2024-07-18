package sqlqueries

import _ "embed"

// GetAttendeesByTRBReqIDSQL holds the SQL query to get the attendees by TRB Req ID
//
//go:embed SQL/trb_request_attendees/get_by_trb_ID.sql
var getAttendeesByTRBReqIDSQL string

// GetAttendeesByTRBReqIDsSQL holds the SQL query to get the attendees by TRB Req IDs
//
//go:embed SQL/trb_request_attendees/get_by_trb_IDs.sql
var getAttendeesByTRBReqIDsSQL string

var TRBRequestAttendees = trbAttendeesScripts{
	GetByTRBID:  getAttendeesByTRBReqIDSQL,
	GetByTRBIDs: getAttendeesByTRBReqIDsSQL,
}

type trbAttendeesScripts struct {
	GetByTRBID  string
	GetByTRBIDs string
}
