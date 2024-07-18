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

// GetAttendeeByEUAIDAndTRBIDSQL holds the SQL query to get an attendee by EUA and TRB Req ID
//
//go:embed SQL/trb_request_attendees/get_attendee_by_EUA_ID_and_TRB_ID.sql
var GetAttendeeByEUAIDAndTRBIDSQL string

// GetAttendeesByEUAIDsAndTRBIDsSQL holds the SQL query to get a list of attendees by EUA and TRB Req IDs
//
//go:embed SQL/trb_request_attendees/get_attendees_by_EUA_IDs_and_TRB_IDs.sql
var GetAttendeesByEUAIDsAndTRBIDsSQL string

var TRBRequestAttendees = trbAttendeesScripts{
	GetByTRBID:                  getAttendeesByTRBReqIDSQL,
	GetByTRBIDs:                 getAttendeesByTRBReqIDsSQL,
	GetAttendeeByEUAAndTRBID:    GetAttendeeByEUAIDAndTRBIDSQL,
	GetAttendeesByEUAsAndTRBIDs: GetAttendeesByEUAIDsAndTRBIDsSQL,
}

type trbAttendeesScripts struct {
	GetByTRBID                  string
	GetByTRBIDs                 string
	GetAttendeeByEUAAndTRBID    string
	GetAttendeesByEUAsAndTRBIDs string
}
